import styled from 'styled-components'
import { Divider } from '@mui/material'

export const Wrapper = styled.div`
  min-height: 100%;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  font-size: 14px;
  line-height: 14px;
`

export const Container = styled.div`
  display: flex;
  padding: 30px;

  & .main {
    min-width: 0;
    flex-grow: 1;
    padding-right: 20px;
    border-right: 1px solid ${({ theme }) => theme.colors.border1};
    margin-right: 20px;
  }
`

export const SideContent = styled.div`
  flex-shrink: 0;
  width: 300px;
  height: 100%;
  position: sticky;
  top: 80px;

  & .side-description {
    margin-bottom: 20px;
    word-break: normal;
  }
`
export const BoxTitle = styled.h2`
  padding: 10px 0;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};

  & .icon {
    margin-right: 5px;
    &.repost,
    &.soundwave {
      font-size: 16px;
    }
  }

  & .text {
    margin-right: auto;
  }
`
export const StyledDivider = styled(Divider)`
  background-color: ${({ theme }) => theme.colors.border1};
`
export const UserItem = styled.li`
  display: flex;
  align-items: center;

  margin: 16px 0;

  & .userItem-profileImage {
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    margin-right: 10px;

    & .link,
    & .img {
      width: 100%;
      height: 100%;
      border-radius: 100%;
      object-fit: cover;
    }
  }

  & .userItem-info {
    min-width: 0;
    flex-grow: 1;

    & .name {
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
      font-size: 14px;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    & .countGroup {
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};

      & .followers,
      & .tracks {
        & .icon {
          margin-right: 4px;
        }

        &:first-child {
          margin-right: 8px;
        }

        &:hover {
          color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
        }
      }
    }
  }

  & .userItem-button {
    margin-left: auto;
    background-color: ${({ theme }) => theme.colors.bgColor};
    padding: 3px 6px;
    border-radius: 4px;

    &:hover {
      border-color: ${({ theme }) => theme.colors.border2};
    }
  }
`

export const Error = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 18px;

  & .notfound {
    font-size: 50px;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
    margin-bottom: 50px;
  }
`
