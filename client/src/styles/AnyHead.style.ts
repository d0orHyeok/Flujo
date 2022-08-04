import styled from 'styled-components'

export const AnyHeadWrapper = styled.div<{ background: string }>`
  font-size: 16px;
  line-height: 16px;
  padding: 30px;

  ${({ background }) => background}
`

export const AnyHeadImage = styled.div`
  width: 200px;
  height: 200px;
  & .img {
    border-radius: inherit;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media screen and (max-width: 1000px) {
    width: 150px;
    height: 150px;
  }
`

export const AnyHeadInfo = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  & .info {
    display: inline-block;

    color: rgba(255, 255, 255, 0.6);
    background-color: rgba(0, 0, 0, 0.75);
    padding: 0.25em 0.5em;

    max-width: 100%;
    margin-right: auto;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    margin-bottom: 0.5em;

    &:last-child {
      margin-bottom: 0;
    }

    &.info-main {
      font-size: 1.25em;
      line-height: 1.25em;
      color: rgba(255, 255, 255, 0.86);
    }
  }
`
