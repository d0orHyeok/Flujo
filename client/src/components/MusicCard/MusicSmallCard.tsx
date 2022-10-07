import { IMusic } from '@appTypes/types.type.'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as S from './MusicSmallCard.style'
import { FaPlay, FaPause } from 'react-icons/fa'
import { useAppDispatch, useAppSelector, useAuthDispatch } from '@redux/hook'
import { setCurrentMusic, togglePlay } from '@redux/features/player/playerSlice'
import {
  AddMusicMenuItem,
  AddPlaylistMenuItem,
} from '@components/Common/MenuItem'
import { MusicMenu } from '@components/Common/Menu'
import { LikeFilledButton, MoreButton } from '@components/Common/Button'
import EmptyMusicCover from '@styles/EmptyImage/EmptyMusicCover.style'
import { userToggleLike } from '@redux/thunks/userThunks'

export interface IMusicSmallCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  music: IMusic
}

const MusicSmallCard = ({ music, ...props }: IMusicSmallCardProps) => {
  const authDispath = useAuthDispatch()
  const dispatch = useAppDispatch()

  const currentMusic = useAppSelector((state) => state.player.currentMusic)
  const isPlay = useAppSelector((state) => state.player.controll.isPlay)
  const likeMusics =
    useAppSelector((state) => state.user.userData?.likeMusics) || []

  const [cardIsCurrentMusic, setCardIsCurrentMusic] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const openMenu = Boolean(anchorEl)

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleClickPlay = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    dispatch(setCurrentMusic(music))
    if (cardIsCurrentMusic) {
      dispatch(togglePlay())
    } else {
      dispatch(togglePlay(true))
    }
  }

  const handleClickMore = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }

  const handleClickLike = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    event.preventDefault()
    authDispath(userToggleLike({ targetId: music.id, targetType: 'music' }))
  }

  useEffect(() => {
    if (music.id === currentMusic?.id) {
      // 현재 재생중인 음악인지 확인
      setCardIsCurrentMusic(true)
    } else {
      setCardIsCurrentMusic(false)
    }
  }, [currentMusic?.id, music])

  return (
    <>
      <S.CardContainer {...props}>
        <S.ImageBox>
          <Link to={`/track/${music.userId}/${music.permalink}`}>
            {music.cover ? (
              <img className="img" src={music.cover} alt="cover" />
            ) : (
              <EmptyMusicCover className="img" />
            )}
            {/* when hover on image  */}
            <S.CardPlayButton
              isPlay={cardIsCurrentMusic.toString()}
              className="cardHoverBtn"
              onClick={handleClickPlay}
            >
              {!cardIsCurrentMusic || !isPlay ? (
                <FaPlay style={{ marginLeft: '2px' }} />
              ) : (
                <FaPause />
              )}
            </S.CardPlayButton>
            <S.CardHoverControl className="cardHoverControl">
              <LikeFilledButton
                isLike={likeMusics.findIndex((lm) => lm.id === music.id) !== -1}
                onClick={handleClickLike}
              />
              <MoreButton
                onClick={handleClickMore}
                style={{ fontSize: '1.2em' }}
              />
            </S.CardHoverControl>
          </Link>
        </S.ImageBox>
        {/* description */}
        <S.CartInfoBox>
          <div className="musicCard-title">
            <Link to={`/track/${music.userId}/${music.permalink}`}>
              {music.title}
            </Link>
          </div>
          <div className="musicCard-uploader">
            <Link to={`/profile/${music.userId}`}>
              {music.user?.nickname || music.userId}
            </Link>
          </div>
        </S.CartInfoBox>
      </S.CardContainer>
      <MusicMenu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
        <AddMusicMenuItem musics={[music]} onClose={handleCloseMenu} />
        <AddPlaylistMenuItem musics={[music]} onClose={handleCloseMenu} />
      </MusicMenu>
    </>
  )
}

export default MusicSmallCard
