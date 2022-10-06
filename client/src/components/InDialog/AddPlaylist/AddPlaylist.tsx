import { IMusic, IPlaylist } from '@appTypes/types.type.'
import React, { useState, useCallback, useLayoutEffect } from 'react'
import * as CommonStyle from '../common.style'
import * as S from './AddPlaylist.style'
import { MdClose } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import EmptyPlaylistImage from '@styles/EmptyImage/EmptyPlaylistImage.stlye'
import EmptyMusicCover from '@styles/EmptyImage/EmptyMusicCover.style'
import { BsSoundwave } from 'react-icons/bs'
import {
  userAddMusicsToPlaylist,
  userCreatePlaylist,
  userDeleteMusicsFromPlaylist,
} from '@redux/thunks/playlistThunks'
import { useAlert } from '@redux/context/alertProvider'
import { Link } from 'react-router-dom'
import Reload from '@components/Loading/Reload'

interface AddPlaylistProps {
  onClose: (any?: any) => any
  onCreateSuccess?: (createPlaylist: IPlaylist) => any
  onCreateFail?: () => any
  onAddSuccess?: (playlist: IPlaylist) => any
  onAddFail?: () => any
  onRemoveSuccess?: (playlistId: number) => any
  onRemoveFail?: () => any
  addMusics?: IMusic[]
}

const AddPlaylist = ({
  onClose,
  addMusics,
  onCreateSuccess,
  onCreateFail,
  onAddSuccess,
  onAddFail,
  onRemoveSuccess,
  onRemoveFail,
}: AddPlaylistProps) => {
  const dispatch = useAppDispatch()
  const openAlert = useAlert()

  const playlists = useAppSelector((state) => {
    return state.user.userData?.playlists || []
  })

  const [navIndex, setNavIndex] = useState(0)
  //  플레이 리스트 생성 정보
  const [newPlaylist, setNewPlaylist] = useState({
    title: '',
    privacy: 'PUBLIC',
  })
  const [filter, setFilter] = useState('') // 플레이리스트 검색 필터
  const [musics, setMusics] = useState<IMusic[]>([]) // 플레이리스트에 추가할 음악
  const [navItems, setNavItems] = useState([
    'Add to playlist',
    'Create playlist',
  ])
  const [loading, setLoading] = useState(false)
  const [loadingArr, setLoadingArr] = useState<number[]>([])

  const handleClickPrivacy = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { id } = event.currentTarget
      setNewPlaylist({ ...newPlaylist, privacy: id.toUpperCase() })
    },
    [newPlaylist]
  )

  const handleChangeInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = event.currentTarget
      if (id === 'filter') {
        setFilter(value)
      } else {
        setNewPlaylist({ ...newPlaylist, title: value })
      }
    },
    [newPlaylist]
  )

  const createPlaylist = useCallback(async () => {
    if (newPlaylist.title.length < 2) {
      return alert('2자 이상의 제목을 입력해 주세요.')
    }

    setLoading(true)

    const body = {
      name: newPlaylist.title,
      musicIds: musics.map((music) => music.id),
      status: newPlaylist.privacy,
    }

    const value = await dispatch(userCreatePlaylist(body))

    if (value.type.indexOf('fulfilled') !== -1) {
      const createPlaylist: IPlaylist = value.payload
      openAlert(`Create playlist: ${createPlaylist.name}`, {
        severity: 'success',
      })
      onCreateSuccess && onCreateSuccess(createPlaylist)
    } else {
      openAlert(`Fail to Create playlist`, {
        severity: 'error',
      })
      onCreateFail && onCreateFail()
    }

    setLoading(false)
    setNewPlaylist({ title: '', privacy: 'PUBLIC' })
    onClose()
  }, [
    openAlert,
    dispatch,
    musics,
    newPlaylist.privacy,
    newPlaylist.title,
    onClose,
    onCreateFail,
    onCreateSuccess,
  ])

  const pullMusic = useCallback(
    // 추가할 음악 제거
    (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      setMusics(musics.filter((_, n) => index !== n))
    },
    [musics]
  )

  const editPlaylistMusics = useCallback(
    (musics: IMusic[], action: 'add' | 'delete') =>
      async (event: React.MouseEvent<HTMLElement>) => {
        const playlistId = event.currentTarget.getAttribute('data-playlistid')

        if (!playlistId) {
          return
        }

        setLoadingArr((state) => [...state, Number(playlistId)])

        const params = {
          playlistId,
          musicIds: musics.map((music) => music.id),
        }
        const actionFunc =
          action === 'add'
            ? userAddMusicsToPlaylist
            : userDeleteMusicsFromPlaylist

        const value = await dispatch(actionFunc(params))

        setLoadingArr((state) =>
          state.filter((id) => id !== Number(playlistId))
        )

        if (value.type.indexOf('fulfilled') !== -1) {
          const updatedPlaylist: IPlaylist = value.payload
          openAlert(
            `'${updatedPlaylist.name}' ${
              musics.length > 1
                ? `${action} ${musics.length} tracks`
                : `${action} track: ${musics[0].title}`
            }`,
            {
              severity: 'success',
            }
          )

          if (action === 'add') {
            onAddSuccess && onAddSuccess(updatedPlaylist)
          } else {
            onRemoveSuccess && onRemoveSuccess(Number(playlistId))
          }
        } else {
          openAlert(`Fail to ${action} track`, {
            severity: 'error',
          })
          if (action === 'add') {
            onAddFail && onAddFail()
          } else {
            onRemoveFail && onRemoveFail()
          }
        }
      },
    [
      dispatch,
      openAlert,
      onAddSuccess,
      onRemoveSuccess,
      onAddFail,
      onRemoveFail,
    ]
  )

  const handleSetNav = useCallback(() => {
    !playlists.length
      ? setNavItems(['Create playlist'])
      : setNavItems(['Add to playlist', 'Create playlist'])
    setNavIndex(0)
  }, [playlists])

  useLayoutEffect(() => {
    handleSetNav()
  }, [handleSetNav])

  useLayoutEffect(() => {
    setMusics(addMusics || [])
  }, [addMusics])

  return (
    <S.Container>
      <S.Title>
        <S.TitleUllist className="title">
          {navItems.map((nav, index) => (
            <S.TitleItem
              key={index}
              select={navIndex === index}
              onClick={() => setNavIndex(index)}
            >
              {nav}
            </S.TitleItem>
          ))}
        </S.TitleUllist>
        <CommonStyle.StyledDivider />
      </S.Title>
      <S.DialogContent>
        {navItems[navIndex] === 'Add to playlist' ? (
          // Add Music to Playlist
          <S.AddContent>
            <S.TextInput
              id="filter"
              type="text"
              value={filter}
              onChange={handleChangeInput}
              placeholder="Filter playlists"
              style={{ width: '100%' }}
            />
            <ul className="ul-playlists">
              {playlists.map((playlist, index) => {
                if (playlist.name.indexOf(filter) === -1) {
                  return
                }

                let added = false
                let filteredMusics = musics
                if (filteredMusics.length === 1) {
                  added =
                    playlist.musics.findIndex(
                      (pm) => pm.id === musics[0].id
                    ) !== -1
                } else {
                  filteredMusics = musics.filter(
                    (music) =>
                      playlist.musics.findIndex((pm) => pm.id === music.id) ===
                      -1
                  )
                  added = filteredMusics.length ? false : true
                }
                return (
                  <S.PlaylistItem key={index}>
                    <div className="image">
                      <Link
                        target="_blank"
                        className="link"
                        to={`/playlist/${playlist.userId}/${playlist.permalink}`}
                      >
                        {playlist.image ? (
                          <img className="img" src={playlist.image} alt="" />
                        ) : (
                          <EmptyPlaylistImage className="img" />
                        )}
                      </Link>
                    </div>
                    <div className="info">
                      <div className="info-name">
                        <Link
                          target="_blank"
                          to={`/playlist/${playlist.userId}/${playlist.permalink}`}
                        >
                          {playlist.name}
                        </Link>
                      </div>
                      <div
                        className="info-num"
                        title={`${playlist.musics.length} musics`}
                      >
                        <BsSoundwave size={14} style={{ marginRight: '4px' }} />
                        {playlist.musics.length}
                      </div>
                    </div>

                    {loadingArr.includes(playlist.id) ? (
                      <Reload size={40} style={{ margin: '0 10px 0 auto' }} />
                    ) : (
                      <S.AddButton
                        added={added}
                        data-playlistid={playlist.id}
                        onClick={
                          !added
                            ? editPlaylistMusics(filteredMusics, 'add')
                            : editPlaylistMusics(musics, 'delete')
                        }
                      >
                        {added ? 'Added' : 'Add to playlist'}
                      </S.AddButton>
                    )}
                  </S.PlaylistItem>
                )
              })}
            </ul>
          </S.AddContent>
        ) : (
          // Create Playlist
          <>
            <S.CreatePlaylist>
              <div className="inputBox">
                <S.Label>
                  Playlist title<span>{' *'}</span>
                </S.Label>
                <S.TextInput
                  id="title"
                  type="text"
                  value={newPlaylist.title}
                  onChange={handleChangeInput}
                />
              </div>
              <div className="inputBox flex">
                <S.Label>{`Privacy: `}</S.Label>
                <input
                  type="radio"
                  id="public"
                  name="privacy"
                  onChange={handleClickPrivacy}
                  checked={newPlaylist.privacy.toLowerCase() === 'public'}
                />
                <label htmlFor="public">Public</label>
                <input
                  type="radio"
                  id="private"
                  name="privacy"
                  onChange={handleClickPrivacy}
                  checked={newPlaylist.privacy.toLowerCase() === 'private'}
                />
                <label htmlFor="private">Private</label>
              </div>
              <S.SaveBox>
                {loading ? (
                  <Reload size={40} />
                ) : (
                  <S.SaveButton onClick={createPlaylist}>Save</S.SaveButton>
                )}
              </S.SaveBox>
            </S.CreatePlaylist>
            <S.AddMusicsWrapper>
              {musics.map((music, index) => {
                return (
                  <S.AddItem key={index}>
                    <div className="music-cover">
                      {music.cover ? (
                        <img className="img" src={music.cover} alt="" />
                      ) : (
                        <EmptyMusicCover className="img" />
                      )}
                    </div>
                    <div className="music-name">
                      <span>{`${
                        music.user?.nickname || music.userId
                      } - `}</span>
                      {music.title}
                    </div>
                    <button className="music-close" onClick={pullMusic(index)}>
                      <MdClose />
                    </button>
                  </S.AddItem>
                )
              })}
              {musics.length < 4 &&
                Array.from({ length: 4 - musics.length }, (_, i) => i).map(
                  (_, index) => <S.AddItem key={index}></S.AddItem>
                )}
            </S.AddMusicsWrapper>
          </>
        )}
      </S.DialogContent>
    </S.Container>
  )
}

export default AddPlaylist
