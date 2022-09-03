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
import styled from 'styled-components'
import { BsFillCameraFill } from 'react-icons/bs'
import {
  userDeleteImage,
  userUpdateImage,
  userUpdateProfile,
} from '@redux/thunks/userThunks'
import { fileToUint8Array, getCoverUrlFromMetadata } from '@api/functions'
import * as ModalStyle from './common.style'
import LoadingPage from '@components/Loading/LoadingPage'

const Title = styled(ModalStyle.ModalTitle)`
  font-size: 20px;
  line-height: 20px;
`

const EditContainer = styled(ModalStyle.ModalContent)`
  padding: 1rem 25px;
  display: flex;

  & .area-image {
    padding: 0 1rem;
    position: relative;
    & .empty,
    & .profileImage {
      width: 250px;
      height: 250px;
      border-radius: 50%;

      ${({ theme }) => theme.device.tablet} {
        width: 160px;
        height: 160px;
      }

      & img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    & .upload {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);

      & .select {
        display: none;
      }

      &:hover {
        & > * {
          background-color: white;
        }
        & .select {
          display: flex;
        }
      }
    }
  }

  & .area-text {
    width: 100%;

    & input,
    & textarea {
      &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.border2};
      }
      border: 1px solid ${({ theme }) => theme.colors.border1};
      background-color: ${({ theme }) => theme.colors.bgColorRGBA(0.16)};
      border-radius: 3px;
      color: inherit;
      width: 100%;
    }

    & input {
      font-size: 1.1rem;
      padding: 6px;
    }

    & .item {
      margin-bottom: 30px;
      &:last-child {
        margin-bottom: 0;
      }

      & .item-title {
        font-size: 1rem;
        line-height: 1rem;
        margin-bottom: 0.5rem;
        & span {
          color: ${({ theme }) => theme.colors.errorColor};
        }
      }
    }
  }
`

const UploadButton = styled.button`
  background-color: lightgray;
  color: black;
  border: 1px solid rgba(0, 0, 0, 0.6);
  border-radius: 3px;
  transition: 0.2s ease all;
  width: 130px;
  font-size: 13px;
  &:hover {
    background-color: white;
  }
`

const UpdateImage = styled.div`
  position: absolute;
  width: 130px;
  display: flex;
  flex-direction: column;
  background-color: white;
  color: black;
  box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.16);
  border: 1px solid rgba(0, 0, 0, 0.6);

  & button {
    font-size: 13px;
    transition: 0.2s ease all;
    padding: 1px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
      color: ${({ theme }) => theme.colors.primaryColor};
    }
  }
`

const ButtonArea = styled(ModalStyle.ModalActions)`
  display: flex;
  justify-content: right;

  & button {
    height: 30px;
    padding: 0 8px;
    border-radius: 3px;

    &:last-child {
      margin-left: 8px;
    }
  }

  & button.block {
    filter: grayscale(100%);
    cursor: default;
  }
`

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
    setImage({})
    setImageDelete(false)
  }, [])

  const handleClickUploadButton = useCallback(() => {
    if (!userData?.profileImage) {
      handleUpload()
    }
  }, [handleUpload, userData?.profileImage])

  const handleClickSave = async () => {
    if (changed) {
      setLoading(true)
      try {
        if (image.file) {
          const formData = new FormData()
          formData.append('file', image.file)
          await dispatch(userUpdateImage(formData)).unwrap()
        }
        if (imageDelete) {
          await dispatch(userDeleteImage()).unwrap()
        }
        if (
          userData?.nickname !== nickname ||
          userData?.description !== description
        ) {
          const data = { nickname, description }
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
    <ModalStyle.InnerModalWrapper>
      {loading ? <LoadingPage /> : <></>}
      <ModalStyle.InnerModalContainer>
        <Title>
          Edit your Profile
          <ModalStyle.StyledDivider sx={{ margin: '0.5rem 0' }} />
        </Title>
        <EditContainer>
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
              <UploadButton onClick={handleClickUploadButton}>
                <BsFillCameraFill style={{ marginRight: '6px' }} />
                {'Upload Image'}
              </UploadButton>
              {userData?.profileImage || image.link ? (
                <UpdateImage className="select">
                  <button onClick={handleUpload}>Replace Image</button>
                  {image.link ? (
                    <button onClick={handleResetImage}>Reset Image</button>
                  ) : (
                    <button onClick={handleDeleteImage}>Delete Image</button>
                  )}
                </UpdateImage>
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
          <ModalStyle.StyledDivider sx={{ margin: '0.5rem 0' }} />
        </EditContainer>
        {/* 버튼 */}
        <ButtonArea>
          <Button onClick={onClose}>Cancel</Button>
          <PrimaryButton
            className={!changed ? 'block' : undefined}
            onClick={handleClickSave}
          >
            Save Changes
          </PrimaryButton>
        </ButtonArea>
      </ModalStyle.InnerModalContainer>
    </ModalStyle.InnerModalWrapper>
  )
}

export default EditProfile
