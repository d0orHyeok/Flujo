import Button, { PrimaryButton } from '@components/Common/Button'
import EmptyProfileImage from '@styles/EmptyImage/EmptyProfileImage.style'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
} from 'react'
import { BsFillCameraFill } from 'react-icons/bs'
import { userUpdateImage, userUpdateProfile } from '@redux/thunks/userThunks'
import { fileToUint8Array, getCoverUrlFromMetadata } from '@api/functions'
import LoadingPage from '@components/Loading/LoadingPage'
import * as S from './EditProfile.style'
import * as CommonStyle from '../common.style'

interface EditProfileProps {
  onClose?: any
}

const EditProfile = ({ onClose }: EditProfileProps) => {
  const dispatch = useAppDispatch()
  const userData = useAppSelector((state) => state.user.userData)

  const imageRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [changed, setChanged] = useState(false)
  const [image, setImage] = useState<{ file?: File; link?: string }>({})
  const [imageDelete, setImageDelete] = useState(false)
  const [nickname, setNickname] = useState('')
  const [description, setDescription] = useState('')

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value, id } = event.currentTarget
      id === 'nickname' ? setNickname(value) : setDescription(value)
      setChanged(true)
    },
    []
  )

  const handleChangeFile = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = event.currentTarget
      setImageDelete(false)
      if (files?.length) {
        const file = files[0]
        const data = await fileToUint8Array(file)
        const link = getCoverUrlFromMetadata(data, file.type)
        setImage({ file, link })
      } else {
        setImage({})
      }
    },
    []
  )

  const handleUpload = useCallback(() => {
    if (!imageRef.current) {
      return
    }
    imageRef.current.click()
  }, [])

  const handleDeleteImage = useCallback(() => {
    setImage({})
    setImageDelete(true)
  }, [])

  const handleResetImage = useCallback(() => {
    if (imageRef.current) {
      imageRef.current.value = ''
    }
    setImage({})
    setImageDelete(false)
  }, [])

  const handleClickUploadButton = useCallback(() => {
    if (!userData?.profileImage) {
      handleUpload()
    }
  }, [handleUpload, userData?.profileImage])

  const handleClickSave = async () => {
    if (!changed) {
      return
    }

    setLoading(true)
    const data =
      userData?.nickname !== nickname || userData?.description !== description
        ? { nickname, description }
        : null

    try {
      if (image.file || imageDelete) {
        const formData = new FormData()
        if (image.file) {
          formData.append('image', image.file)
        }
        if (data) {
          formData.append(
            'data',
            new Blob([JSON.stringify(data)], { type: 'application/json' })
          )
        }

        await dispatch(userUpdateImage(formData)).unwrap()
      } else if (data) {
        await dispatch(userUpdateProfile(data)).unwrap()
      }
    } catch (error) {
      console.error(error)
      alert('Error to update profile')
    } finally {
      setLoading(false)
      onClose && onClose()
    }
  }

  const checkChanged = useCallback(() => {
    const defaultDesc = userData?.description || ''
    if (
      nickname.trim() === userData?.nickname &&
      description === defaultDesc &&
      !image.file &&
      !imageDelete
    ) {
      setChanged(false)
    } else {
      setChanged(true)
    }
  }, [description, image.file, imageDelete, nickname, userData])

  useEffect(() => {
    checkChanged()
  }, [checkChanged])

  useLayoutEffect(() => {
    if (!userData) {
      onClose && onClose()
    } else {
      setNickname(userData.nickname || userData.username)
      setDescription(userData.description || '')
    }
  }, [onClose, userData])

  return (
    <S.Container>
      {loading ? <LoadingPage /> : <></>}
      <S.Title>
        Edit your Profile
        <CommonStyle.StyledDivider sx={{ margin: '0.5rem 0' }} />
      </S.Title>
      <S.EditContainer>
        {/* 프로필 이미지 */}
        <div className="area-image">
          {image.file ? (
            <div className="profileImage">
              <img src={image.link} alt="" />
            </div>
          ) : !userData?.profileImage || imageDelete ? (
            <EmptyProfileImage className="empty" />
          ) : (
            <div className="profileImage">
              <img src={userData.profileImage} alt="" />
            </div>
          )}
          {/* 이미지 업로드 */}
          <input
            ref={imageRef}
            type="file"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleChangeFile}
          />
          <div className="upload">
            <S.UploadButton onClick={handleClickUploadButton}>
              <BsFillCameraFill style={{ marginRight: '6px' }} />
              {'Upload Image'}
            </S.UploadButton>
            {userData?.profileImage || image.link ? (
              <S.UpdateImage className="select">
                <button onClick={handleUpload}>Replace Image</button>
                {image.link ? (
                  <button onClick={handleResetImage}>Reset Image</button>
                ) : (
                  <button onClick={handleDeleteImage}>Delete Image</button>
                )}
              </S.UpdateImage>
            ) : (
              <></>
            )}
          </div>
        </div>
        {/* 유저 정보 */}
        <div className="area-text">
          <div className="item">
            <h2 className="item-title">
              Nickname<span>{' *'}</span>
            </h2>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={handleChange}
            />
          </div>
          <div className="item">
            <h2 className="item-title">Profile URL</h2>
            <span>{`${location.host}/profile/${userData?.id}`}</span>
          </div>
          <div className="item">
            <h2 className="item-title">Description</h2>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <CommonStyle.StyledDivider sx={{ margin: '0.5rem 0' }} />
      </S.EditContainer>
      {/* 버튼 */}
      <S.ButtonArea>
        <Button onClick={onClose}>Cancel</Button>
        <PrimaryButton
          className={!changed ? 'block' : undefined}
          onClick={handleClickSave}
        >
          Save Changes
        </PrimaryButton>
      </S.ButtonArea>
    </S.Container>
  )
}

export default EditProfile
