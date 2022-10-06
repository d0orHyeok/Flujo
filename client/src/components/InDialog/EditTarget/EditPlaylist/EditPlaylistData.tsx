import { fileToUint8Array, getCoverUrlFromMetadata } from '@api/functions'
import { IPlaylist } from '@appTypes/playlist.type'
import { EmptyPlaylistImage } from '@styles/EmptyImage'
import React, { useRef, useState, useLayoutEffect, useCallback } from 'react'
import { AiFillCamera } from 'react-icons/ai'
import { MdOutlineEdit } from 'react-icons/md'
import * as S from './EditPlaylistData.style'

export type TypeOnChangeDataKey =
  | 'name'
  | 'permalink'
  | 'description'
  | 'tags'
  | 'image'
  | 'status'

interface EditPlaylistDataProps {
  playlist: IPlaylist
  onChangeData?: (key: any, value: any) => void
}

interface Props
  extends EditPlaylistDataProps,
    React.HTMLAttributes<HTMLDivElement> {}

const EditPlaylistData = ({ playlist, onChangeData, ...props }: Props) => {
  const coverInputRef = useRef<HTMLInputElement>(null)

  const [status, setStatus] = useState(true)
  const [cover, setCover] = useState<string | null | undefined>(null)
  const [inputValue, setInputValue] = useState({
    name: '',
    permalink: '',
    description: '',
    tags: '',
  })

  const handleChangeCover = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      // 사용자가 앨범 이미지를 등록하면 미리보기 부분에 보여줌
      const { files } = event.currentTarget
      if (files?.length && files[0].type.includes('image/')) {
        const data = await fileToUint8Array(files[0])
        const url = getCoverUrlFromMetadata(data, files[0].type)
        setCover(url)
      } else {
        setCover(playlist.image)
      }
      onChangeData && onChangeData('image', files ? files[0] : null)
    },
    [onChangeData, playlist.image]
  )

  const handleResetCover = useCallback(() => {
    setCover(playlist.image)
    if (coverInputRef.current) {
      coverInputRef.current.files = null
    }
    onChangeData && onChangeData('image', playlist.image)
  }, [onChangeData, playlist.image])

  const handleChangePrivacy = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget
      setStatus(value === 'public' ? true : false)
      onChangeData && onChangeData('status', value.toUpperCase())
    },
    [onChangeData]
  )

  const handleClickEditPermal = useCallback(() => {
    document.getElementById('permalink')?.focus()
  }, [])

  const whenSetInputValue = useCallback(
    (key: string, value: any) => {
      setInputValue((prevState) => {
        return { ...prevState, [key]: value }
      })
      if (!onChangeData) {
        return
      }

      if (!value) {
        return onChangeData(key, null)
      }

      switch (key) {
        case 'tags':
          onChangeData(key, value.split('#').splice(1))
          break
        default:
          onChangeData(key, value)
      }
    },
    [onChangeData]
  )

  const handleChangePermalink = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget
      const newValue = value
        .trimStart()
        .replaceAll(/[\s]/g, '-')
        .replaceAll(/[^a-zA-Z0-9가-힣ㄱ-ㅎ\_\-]/g, '')
      whenSetInputValue('permalink', newValue)
    },
    [whenSetInputValue]
  )

  const handleLeaveTag = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // 입력한 태그에 #을 자동으로 붙여준다
      const specialRegex = /[!?@#$%^*():;+=~{}<>\_\[\]\|\\\"\'\,\.\/\`\₩\s]/g

      const { value } = event.currentTarget
      const newValue =
        value.length && value[0] !== '#'
          ? `#${value}`
          : value.trim().replaceAll(specialRegex, '#').replaceAll(/#+#/g, '#')
      whenSetInputValue('tags', newValue)
    },
    [whenSetInputValue]
  )

  const handleChangeInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value } = event.currentTarget
      whenSetInputValue(id, value)
    },
    [whenSetInputValue]
  )

  const setValue = useCallback(() => {
    const {
      name,
      permalink,
      tags,
      description,
      status: playlistStatus,
      image,
    } = playlist

    setCover(image)
    setStatus(playlistStatus === 'PRIVATE' ? false : true)
    setInputValue({
      name,
      permalink,
      description: description || '',
      tags: tags ? `#${tags.join('#')}` : '',
    })
  }, [playlist])

  useLayoutEffect(() => {
    setValue()
  }, [setValue])

  return (
    <div {...props}>
      <S.EditBasicInfo>
        <div className="imageBox">
          <label htmlFor="coverInput">
            <AiFillCamera />
            {'Upload Image'}
          </label>
          {cover !== playlist.image && (
            <button className="btn resetBtn" onClick={handleResetCover}>
              Reset Cover
            </button>
          )}
          <input
            id="coverInput"
            type="file"
            accept="image/*"
            hidden
            ref={coverInputRef}
            onChange={handleChangeCover}
          />
          {cover ? (
            <img className="img" src={cover} alt="cover" />
          ) : (
            <EmptyPlaylistImage className="img" />
          )}
        </div>
        <S.EditBasicInfoForm onSubmit={(e) => e.preventDefault()}>
          <S.EditInputBox>
            <label className="label" htmlFor="name">
              Title<span className="require">{' *'}</span>
            </label>
            <input
              id="name"
              type="text"
              required
              placeholder="Name of playlist"
              value={inputValue.name}
              onChange={handleChangeInput}
            />
          </S.EditInputBox>
          <S.EditInputPermalink>
            <h2 className="label">
              Permalink<span className="require">{' *'}</span>
            </h2>
            <div className="inputwrap">
              <label htmlFor="permalink">{`${window.location.hostname}/${playlist.userId}/`}</label>
              <input
                id="permalink"
                type="text"
                placeholder="Your link"
                required
                value={inputValue.permalink}
                onChange={handleChangePermalink}
              />
              <button className="permalinkBtn" onClick={handleClickEditPermal}>
                <MdOutlineEdit />
              </button>
            </div>
          </S.EditInputPermalink>
          <S.EditInputBox>
            <label className="label" htmlFor="tag">
              Additional tags
            </label>
            <input
              id="tags"
              type="text"
              placeholder="Add tags to describe the genre and mood of your music"
              value={inputValue.tags}
              onChange={handleChangeInput}
              onBlur={handleLeaveTag}
            />
          </S.EditInputBox>
          <S.EditInputBox>
            <label className="label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              placeholder="Describe your music"
              value={inputValue.description}
              onChange={handleChangeInput}
            />
          </S.EditInputBox>
          <S.EditInputPrivacy>
            <h2 className="label">Privacy</h2>
            <input
              type="radio"
              id="privacy-public"
              name="privacy"
              value="public"
              checked={status}
              onChange={handleChangePrivacy}
            />
            <label htmlFor="privacy-public">Public</label>
            <input
              type="radio"
              id="privacy-private"
              name="privacy"
              style={{ marginLeft: '0.5rem' }}
              value="private"
              checked={!status}
              onChange={handleChangePrivacy}
            />
            <label htmlFor="privacy-private">Private</label>
          </S.EditInputPrivacy>
        </S.EditBasicInfoForm>
      </S.EditBasicInfo>
    </div>
  )
}

export default EditPlaylistData
