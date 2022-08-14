import styled from 'styled-components'

export const CardContainer = styled.div`
  display: inline-block;
  width: 170px;
  font-size: 0.9rem;
  line-height: 0.9rem;

  ${({ theme }) => theme.device.tablet} {
    width: 140px;
    font-size: 0.85rem;
  }

  ${({ theme }) => theme.device.mobile} {
    width: 110px;
    font-size: 0.8rem;
  }
`

export const ImageBox = styled.div`
  position: relative;
  width: 100%;
  height: 170px;

  ${({ theme }) => theme.device.tablet} {
    height: 140px;
  }

  ${({ theme }) => theme.device.mobile} {
    height: 110px;
  }

  & .img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: ease 0.2s all;
  }

  & .cardHoverBtn,
  & .cardHoverControl {
    display: none;
  }

  &:hover {
    & .img {
      filter: saturate(100%) brightness(40%);
    }

    & .cardHoverBtn {
      display: block;
    }
    & .cardHoverControl {
      display: flex;
    }
  }
`

export const CardHoverControl = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  font-size: 1.1em;
  color: white;

  & button {
    margin-right: 8px;
  }
`

export const CardPlayButton = styled.button<{ isPlay: string }>`
  position: absolute;
  border: none;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0;
  color: ${({ theme, isPlay }) =>
    isPlay === 'true' ? theme.colors.primaryColor : 'white'};
  font-size: 2em;
`

export const CardControlBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

export const CartInfoBox = styled.div`
  width: 100%;
  font-size: inherit;
  padding: 6px 3px;
  & .setsCard-title,
  & .setsCard-uploader {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & .setsCard-uploader {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
  }
`
