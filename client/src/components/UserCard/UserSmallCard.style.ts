import styled from 'styled-components'

export const CardContainer = styled.div`
  display: inline-block;
  width: 170px;
  font-size: 14px;
  line-height: 100%;

  ${({ theme }) => theme.device.tablet} {
    width: 140px;
  }

  ${({ theme }) => theme.device.mobile} {
    width: 110px;
    font-size: 12px;
  }
`

export const ImageBox = styled.div`
  position: relative;
  width: 100%;
  height: 170px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border1};

  ${({ theme }) => theme.device.tablet} {
    height: 140px;
  }

  ${({ theme }) => theme.device.mobile} {
    height: 110px;
  }

  & .img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
    object-fit: cover;
    transition: ease 0.2s all;
  }

  & .cardHoverBtn,
  & .cardHoverControl {
    display: none;
  }

  & .absolute {
    position: absolute;
    left: 8px;
    right: 8px;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & .absolute.nickname {
    top: 4px;
  }

  & .absolute.subText {
    bottom: 4px;
    display: inline-flex;
    align-items: center;

    &::before {
      content: '';
      height: 1px;
      flex-grow: 1;
      background-color: ${({ theme }) => theme.colors.bgText};
      margin-right: 4px;
    }
  }
`

export const CartInfoBox = styled.div`
  width: 100%;
  font-size: inherit;
  padding: 6px 3px;
  & .userCard-nickname,
  & .userCard-subText {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & .userCard-subText {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
  }
`
