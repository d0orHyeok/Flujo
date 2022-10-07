import React, {
  forwardRef,
  useCallback,
  useRef,
  useState,
  useImperativeHandle,
  useLayoutEffect,
} from 'react'
import * as S from './MusicBasicInfo.style'
import { useAppSelector } from '@redux/hook'
import { fileToUint8Array, getCoverUrlFromMetadata } from '@api/functions'
import { MdOutlineEdit } from 'react-icons/md'
import { AiFillCamera } from 'react-icons/ai'
import EmptyMusicCover from '@styles/EmptyImage/EmptyMusicCover.style'
import { IExtractMetadata } from '../extractMetadata.types'
import { IMusic } from '@appTypes/music.type'
import Select, { Option } from '@components/Common/Select/Select'
import { genreList } from '@assets/data/genre'

export interface IMusicBasicInfoHandler {
  getData: () => IMusicBasicInfoValue | void
}

export interface IMusicBasicInfoValue {
  title: string
  permalink: string
  genre?: string[]
  description?: string
  tags?: string[]
  cover?: File
  status: 'PRIVATE' | 'PUBLIC' | string
}

export type TypeOnChnageDataKey =
  | 'title'
  | 'permalink'
  | 'genre'
  | 'description'
  | 'tags'
  | 'cover'
  | 'status'

interface MusicBaiscInfoProps {
  music?: IMusic
  metadata?: IExtractMetadata | null
  onChangeData?: (key: any, value: any) => void
}

interface Props
  extends MusicBaiscInfoProps,
    React.HTMLAttributes<HTMLDivElement> {}

const MusicBasicInfo = forwardRef<IMusicBasicInfoHandler, Props>(
  ({ music, metadata, onChangeData, ...props }, ref) => {
    const coverInputRef = useRef<HTMLInputElement>(null)

    const userId = useAppSelector((state) => state.user.userData?.id)

    const [status, setStatus] = useState(true)
    const [cover, setCover] = useState<string | null | undefined>(null)
    const [originalCover, setOriginalCover] = useState<{
      file?: File
      url?: string
    }>({})

    const [inputValue, setInputValue] = useState({
      title: '',
      permalink: '',
      genre: 'None',
      description: '',
      tags: '',
    })
    const [customGenre, setCustomGenre] = useState('')

    useImperativeHandle(
      ref,
      () => ({
        getData: () => {
          const { title, permalink, genre, description, tags } = inputValue
          const newCover = !coverInputRef.current?.files
            ? undefined
            : coverInputRef.current.files[0]

          if (!title) {
            document.getElementById('title')?.focus()
            return alert('[Basic Info]\nPlease enter a title')
          }
          if (!permalink) {
            document.getElementById('permalink')?.focus()
            return alert('[Basic Info]\nPlease enter a permalink')
          }

          const genreData =
            genre === 'None' ? [] : genre === 'Custom' ? [customGenre] : [genre]

          const data = {
            title,
            permalink,
            tags: !tags ? undefined : tags.split('#').splice(1),
            genre: genreData,
            description,
            cover: newCover || originalCover.file,
            status: status ? 'PUBLIC' : 'PRIVATE',
          }
          return data
        },
      }),
      [customGenre, inputValue, originalCover.file, status]
    )

    const handleChangeCover = useCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        // 사용자가 앨범 이미지를 등록하면 미리보기 부분에 보여줌
        const { files } = event.currentTarget
        if (files?.length && files[0].type.includes('image/')) {
          const data = await fileToUint8Array(files[0])
          const url = getCoverUrlFromMetadata(data, files[0].type)
          setCover(url)
        } else {
          setCover(originalCover.url)
        }
        onChangeData && onChangeData('cover', files?.item(0))
      },
      [onChangeData, originalCover.url]
    )

    const handleResetCover = useCallback(() => {
      setCover(originalCover.url)
      if (coverInputRef.current) {
        const datatransfer = new DataTransfer()
        coverInputRef.current.files = datatransfer.files
      }
      onChangeData && onChangeData('cover', null)
    }, [onChangeData, originalCover.url])

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
          case 'genre':
            const v =
              value === 'None'
                ? undefined
                : value === 'Custom'
                ? customGenre
                : value
            onChangeData(key, [v])
            break
          default:
            onChangeData(key, value)
        }
      },
      [customGenre, onChangeData]
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

    const handleChangeTag = useCallback(
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

    const handleChangeGenreOption = useCallback(
      (value?: string | number) => {
        whenSetInputValue('genre', value)
        if (value === 'Custom') {
          document.getElementById('genre')?.focus()
        }
      },
      [whenSetInputValue]
    )

    const handleChangeCustomGenre = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget
        setCustomGenre(value)
      },
      []
    )

    const setValue = useCallback(() => {
      if (!metadata) {
        return
      }
      // 음악파일을 분석하고 앨범커버가 있으면 등록
      const {
        picture,
        title,
        genre,
        comment,
        tags,
        status: musicStatus,
        permalink,
      } = metadata

      if (picture?.length) {
        const { data, format } = picture[0]
        const url = getCoverUrlFromMetadata(data, format)
        setCover(url)

        const origin = new File(
          [data],
          `cover.${format.split('/')[1] || 'jpg'}`,
          {
            type: format,
          }
        )
        setOriginalCover({ file: origin, url })
      } else {
        setCover(null)
        setOriginalCover({})
      }

      if (musicStatus) {
        setStatus(musicStatus === 'PUBLIC' ? true : false)
      }

      const selectGenre = genreList.find((item) => {
        if (!genre) {
          return false
        }
        return Boolean(
          genre.filter(
            (g) =>
              item.keywords.findIndex((keyword) =>
                g.toLowerCase().includes(keyword)
              ) !== -1
          ).length
        )
      })

      const trackGenre = !genre
        ? 'None'
        : !selectGenre
        ? 'Custom'
        : selectGenre.label
      if (trackGenre === 'Custom' && genre) {
        setCustomGenre(genre[0])
      }

      setInputValue((prevState) => {
        return {
          ...prevState,
          title: title || '',
          permalink:
            permalink ||
            (title || '')
              .trim()
              .replaceAll(/[\s]/g, '-')
              .replaceAll(/[^a-zA-Z0-9가-힣ㄱ-ㅎ\_\-]/g, ''),
          genre: trackGenre,
          description: comment?.length ? comment.join('\n') : '',
          tags: tags
            ? `#${tags.join('#')}`
            : genre
            ? `#${genre.join('#')}`
            : '',
        }
      })
    }, [metadata])

    const handleUploadImage = useCallback(() => {
      coverInputRef.current?.click()
    }, [])

    useLayoutEffect(() => {
      setValue()
    }, [setValue])

    return (
      <div {...props}>
        <S.EditBasicInfo>
          <div className="imageBox">
            <div className="imageBox-control">
              <button className="btn imageBtn" onClick={handleUploadImage}>
                <AiFillCamera className="icon" />
                {'Upload Image'}
              </button>
              {Boolean(cover) !== Boolean(originalCover.url) ? (
                <button className="btn resetBtn" onClick={handleResetCover}>
                  Reset Cover
                </button>
              ) : null}
            </div>
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
              <EmptyMusicCover className="img" />
            )}
          </div>
          <S.EditBasicInfoForm onSubmit={(e) => e.preventDefault()}>
            <S.EditInputBox>
              <label className="label" htmlFor="title">
                Title<span className="require">{' *'}</span>
              </label>
              <input
                id="title"
                type="text"
                required
                placeholder="Title of music"
                value={inputValue.title}
                onChange={handleChangeInput}
              />
            </S.EditInputBox>
            <S.EditInputPermalink>
              <h2 className="label">
                Permalink<span className="require">{' *'}</span>
              </h2>
              <div className="inputwrap">
                <label htmlFor="permalink">{`${window.location.hostname}/${
                  music ? music.userId : userId
                }/`}</label>
                <input
                  id="permalink"
                  type="text"
                  placeholder="Your link"
                  required
                  value={inputValue.permalink}
                  onChange={handleChangePermalink}
                />
                <button
                  className="permalinkBtn"
                  onClick={handleClickEditPermal}
                >
                  <MdOutlineEdit />
                </button>
              </div>
            </S.EditInputPermalink>
            <S.GenreInputBox>
              <S.GenreBox>
                <div className="label">Genre</div>
                <Select
                  value={inputValue.genre}
                  onChangeValue={handleChangeGenreOption}
                >
                  <S.OptionBox>
                    <Option value="None">None</Option>
                    <Option value="Custom">Custom</Option>
                  </S.OptionBox>
                  <S.OptionTitle>Music</S.OptionTitle>
                  <S.OptionBox>
                    {genreList.map((item) => (
                      <Option key={item.label} value={item.label}>
                        {item.label}
                      </Option>
                    ))}
                  </S.OptionBox>
                </Select>
              </S.GenreBox>
              {inputValue.genre === 'Custom' && (
                <S.GenreBox style={{ marginTop: 'auto' }}>
                  <input
                    type="text"
                    id="genre"
                    value={customGenre}
                    onChange={handleChangeCustomGenre}
                  />
                </S.GenreBox>
              )}
            </S.GenreInputBox>
            <S.EditInputBox>
              <label className="label" htmlFor="tag">
                Additional tags
              </label>
              <input
                id="tags"
                type="text"
                value={inputValue.tags}
                onChange={handleChangeInput}
                onBlur={handleChangeTag}
                placeholder="Add tags to describe the genre and mood of your music"
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
)

MusicBasicInfo.displayName = 'MusicBasicInfo'

export default MusicBasicInfo
