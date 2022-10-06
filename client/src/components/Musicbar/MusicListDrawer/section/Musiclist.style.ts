import styled from 'styled-components'

export const AreaImage = styled.div`
  margin: 0 auto;

  ${({ theme }) => theme.device.tablet} {
    display: none;
  }
`

export const MusicImage = styled.div`
  width: 360px;
  height: 360px;

  @media screen and (max-width: 1000px) {
    width: 240px;
    height: 240px;
  }

  & .img {
    width: 100%;
    height: 100%;
    overflow: cover;
  }
`

export const AreaPlaylist = styled.div`
  position: relative;
  width: 400px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.bgColorRGBA(0.03)};

  ${({ theme }) => theme.device.tablet} {
    width: 100%;
  }

  & .playlist-container {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 8px;
      background-color: ${({ theme }) => theme.colors.bgColorRGBA(0.15)};
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: ${({ theme }) => theme.colors.bgColorRGBA(0.3)};
    }
  }
`

export const PlaylistHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 20px;
  font-size: 16px;

  & .button-wrap {
    display: flex;
    align-items: center;
    height: 100%;
  }

  & .btn {
    margin-right: 16px;
    font-size: inherit;

    &:last-child {
      margin-right: 0;
    }
  }

  ${({ theme }) => theme.device.tablet} {
    font-size: 1.2rem;
  }
`

export const ClearBtn = styled.button`
  border: none;
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
  &:hover {
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
  }
`

export const PlaylistItem = styled.li<{ select?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;

  background-color: ${({ theme, select }) =>
    select && theme.colors.bgColorRGBA(0.08)};

  & .btn {
    display: none;
  }

  & .hoverIcon {
    display: ${({ select }) => !select && 'none'};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.bgColorRGBA(0.16)};

    & .duration {
      display: none;
    }

    & .btn,
    & .hoverIcon {
      display: inline;
    }

    & .image {
      filter: brightness(50%);
    }
  }
`

export const ItemImageBox = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  cursor: pointer;
  flex-shrink: 0;

  & .image {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  & .hoverIcon {
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 12px;
  }
`

export const ItemInfoBox = styled.div`
  min-width: 0;
  flex-grow: 1;
  font-size: 0.8rem;
  line-height: 1rem;
  margin: 0 0.75rem;

  & .uploader,
  & .title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  & .uploader {
    color: ${({ theme }) => theme.colors.bgTextRGBA('0.6')};
  }
  & .title {
    color: ${({ theme }) => theme.colors.bgTextRGBA('0.86')};
  }
  & .title:hover,
  & .uploader:hover {
    color: ${({ theme }) => theme.colors.bgText};
  }
`

export const ItemControlBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  & .duration {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
  }

  & .btn {
    font-size: 14px;
    border: none;
  }
`

export const LikeBtn = styled.button<{ like?: boolean }>`
  color: ${({ theme, like }) => like && theme.colors.errorColor};
`
