import React, { useCallback, useRef } from 'react'
import { IconButton } from '@mui/material'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import { IMusic } from '@appTypes/music.type'
import MusicSmallCard from '@components/MusicCard/MusicSmallCard'
import * as S from './SmallCardSlider.style'

interface ISmallCardSliderProps {
  musics: IMusic[]
}

const SmallCardSlider = ({ musics }: ISmallCardSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null)

  const handleOnScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget
    const leftBtn = sliderRef.current?.querySelector(
      '.chart-musicBox-btn.leftBtn'
    )
    const rightBtn = sliderRef.current?.querySelector(
      '.chart-musicBox-btn.rightBtn'
    )

    if (el.scrollLeft === 0) {
      leftBtn?.classList.add('hide')
    } else if (el.scrollLeft === el.scrollWidth - el.clientWidth) {
      rightBtn?.classList.add('hide')
    } else {
      leftBtn?.classList.remove('hide')
      rightBtn?.classList.remove('hide')
    }
  }, [])

  const handleClickButton = useCallback(
    (direction?: 'left' | 'right') =>
      (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const el = sliderRef.current?.querySelector('.chart-musicBox')
        const musicCardEl = el?.querySelector('.chart-musicCard')
        if (!el || !musicCardEl) {
          return
        }

        const cardWidth = musicCardEl.clientWidth + 20
        const displayNum = Math.floor(el.clientWidth / cardWidth)
        const move = cardWidth * displayNum

        if (direction === 'right') {
          el.scrollBy({ behavior: 'smooth', left: move })
        } else {
          const blankWidth = el.clientWidth % cardWidth
          const left =
            el.scrollLeft === el.scrollWidth - el.clientWidth
              ? -move + blankWidth
              : -move
          el.scrollBy({ behavior: 'smooth', left })
        }
      },
    []
  )

  return (
    <S.Slider ref={sliderRef}>
      <IconButton
        className="chart-musicBox-btn leftBtn hide"
        onClick={handleClickButton('left')}
      >
        <AiOutlineLeft />
      </IconButton>
      <IconButton
        className="chart-musicBox-btn rightBtn"
        onClick={handleClickButton('right')}
      >
        <AiOutlineRight />
      </IconButton>
      <div className="chart-musicBox" onScroll={handleOnScroll}>
        {musics.map((music, index) => (
          <MusicSmallCard
            className="chart-musicCard"
            key={index}
            music={music}
          />
        ))}
      </div>
    </S.Slider>
  )
}

export default SmallCardSlider
