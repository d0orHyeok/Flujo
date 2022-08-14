import { IMusic } from '@appTypes/types.type.'
import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import * as S from './SetsCard.style.ts'
import { FaPlay, FaPause } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import {
  addMusic,
  clearMusics,
  togglePlay,
} from '@redux/features/player/playerSlice'
import {
  AddMusicMenuItem,
  AddPlaylistMenuItem,
} from '@components/Common/MenuItem'
import { MusicMenu } from '@components/Common/Menu'
import { MoreButton } from '@components/Common/Button'
import { EmptyPlaylistImage } from '@styles/EmptyImage'

export interface ISetsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  mainText: { name: string; link: string }
  subText: string
  musics: IMusic[]
}

const SetsCard = ({ mainText, subText, musics, ...props }: ISetsCardProps) => {
  const dispatch = useAppDispatch()

  const isPlay = useAppSelector((state) => state.player.controll.isPlay)
  const nextups = useAppSelector((state) => state.player.musics)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [active, setActive] = useState(false)

  const openMenu = Boolean(anchorEl)

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleClickPlay = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      if (!active) {
        dispatch(clearMusics())
        dispatch(addMusic(musics))
        dispatch(togglePlay(true))
      } else {
        dispatch(togglePlay())
      }
    },
    [active, dispatch, musics]
  )

  const handleClickMore = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }

  useEffect(() => {
    if (nextups.length !== musics.length) {
      setActive(false)
    } else {
      const bol =
        nextups.findIndex(
          (nextup) => musics.findIndex((m) => m.id === nextup.id) === -1
        ) === -1
      setActive(bol)
    }
  }, [nextups, musics])

  return (
    <>
      <S.CardContainer {...props}>
        <S.ImageBox>
          <Link to={mainText.link}>
            {musics[0].cover ? (
              <img className="img" src={musics[0].cover} alt="cover" />
            ) : (
              <EmptyPlaylistImage className="img" />
            )}
            {/* when hover on image  */}
            <S.CardPlayButton
              isPlay={`${active}`}
              className="cardHoverBtn"
              onClick={handleClickPlay}
            >
              {!active || !isPlay ? (
                <FaPlay style={{ marginLeft: '2px' }} />
              ) : (
                <FaPause />
              )}
            </S.CardPlayButton>
            <S.CardHoverControl className="cardHoverControl">
              <MoreButton
                onClick={handleClickMore}
                style={{ fontSize: '1.2em' }}
              />
            </S.CardHoverControl>
          </Link>
        </S.ImageBox>
        {/* description */}
        <S.CartInfoBox>
          <div className="setsCard-title">
            <Link to={mainText.link}>{mainText.name}</Link>
          </div>
          <div className="setsCard-uploader">{subText}</div>
        </S.CartInfoBox>
      </S.CardContainer>
      <MusicMenu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
        <AddMusicMenuItem musics={musics} onClose={handleCloseMenu} />
        <AddPlaylistMenuItem musics={musics} onClose={handleCloseMenu} />
      </MusicMenu>
    </>
  )
}

export default SetsCard
