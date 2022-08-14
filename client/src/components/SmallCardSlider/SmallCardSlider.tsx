import React, { useCallback, useEffect, useRef } from 'react'
import { IconButton } from '@mui/material'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import MusicSmallCard, {
  IMusicSmallCardProps,
} from '@components/MusicCard/MusicSmallCard'
import * as S from './SmallCardSlider.style'
import SetsCard, { ISetsCardProps } from '@components/SetsCard/SetsCard'
import UserSmallCard, {
  IUserSmallCardProps,
} from '@components/UserCard/UserSmallCard'

interface ISmallCardSliderProps {
  cardsProps: (IMusicSmallCardProps | ISetsCardProps | IUserSmallCardProps)[]
}

const SmallCardSlider = ({ cardsProps }: ISmallCardSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null)

  const handleOnScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    // 스크롤 이동 시 스크롤 위치에 따라 버튼이 보여질지 설정
    const el = event.currentTarget
    const leftBtn = sliderRef.current?.querySelector('.chart-box-btn.leftBtn')
    const rightBtn = sliderRef.current?.querySelector('.chart-box-btn.rightBtn')

    if (el.scrollLeft === 0) {
      // 맨 왼쪽이면 왼쪽이동버튼 숨김
      leftBtn?.classList.add('hide')
    } else if (el.scrollLeft === el.scrollWidth - el.clientWidth) {
      // 맨 오른쪽이면 오른쪽이동 숨김
      rightBtn?.classList.add('hide')
    } else {
      // 아닐 시 모두 보임
      leftBtn?.classList.remove('hide')
      rightBtn?.classList.remove('hide')
    }
  }, [])

  const handleClickButton = useCallback(
    // 버튼 클릭시 슬라이더를 이동시킨다
    (direction?: 'left' | 'right') =>
      (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const el = sliderRef.current?.querySelector('.chart-box')
        const musicCardEl = el?.querySelector('.chart-card')
        if (!el || !musicCardEl) {
          return
        }

        const cardWidth = musicCardEl.clientWidth + 20 // MusicSmallCard의 가로와 마진을 포함한 길이
        const displayNum = Math.floor(el.clientWidth / cardWidth) // 전체가 보여지는 카드의 갯수
        const move = cardWidth * displayNum // 스크롤 이동 값

        if (direction === 'right') {
          el.scrollBy({ behavior: 'smooth', left: move })
        } else {
          // 맨 오른쪽에서 왼쪽으로 슬라이드할때 잘린부분을 계산하여 이동
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

  const handleResizeHideBtn = useCallback(() => {
    // 화면크기가 바뀔때 스크롤 유무에 따라 버튼이 보여질지 설정
    const el = sliderRef.current?.querySelector('.chart-box')
    if (el) {
      const leftBtn = sliderRef.current?.querySelector('.chart-box-btn.leftBtn')
      const rightBtn = sliderRef.current?.querySelector(
        '.chart-box-btn.rightBtn'
      )
      el.scrollWidth <= el.clientWidth
        ? rightBtn?.classList.add('hide')
        : rightBtn?.classList.remove('hide')

      !el.scrollLeft
        ? leftBtn?.classList.add('hide')
        : leftBtn?.classList.remove('hide')
    }
  }, [])

  useEffect(() => {
    handleResizeHideBtn()
    window.addEventListener('resize', handleResizeHideBtn)
    return () => {
      window.removeEventListener('resize', handleResizeHideBtn)
    }
  }, [handleResizeHideBtn])

  return (
    <S.Slider ref={sliderRef}>
      <IconButton
        className="chart-box-btn leftBtn hide"
        onClick={handleClickButton('left')}
      >
        <AiOutlineLeft />
      </IconButton>
      <IconButton
        className="chart-box-btn rightBtn"
        onClick={handleClickButton('right')}
      >
        <AiOutlineRight />
      </IconButton>
      <div className="chart-box" onScroll={handleOnScroll}>
        {cardsProps.map((props, index) => {
          if ('mainText' in props) {
            return <SetsCard className="chart-card" key={index} {...props} />
          } else if ('user' in props) {
            return (
              <UserSmallCard className="chart-card" key={index} {...props} />
            )
          } else {
            return (
              <MusicSmallCard className="chart-card" key={index} {...props} />
            )
          }
        })}
      </div>
    </S.Slider>
  )
}

export default SmallCardSlider
