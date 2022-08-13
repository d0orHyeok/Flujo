import { Divider } from '@mui/material'
import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  min-height: 100%;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  font-size: 14px;
  line-height: 14px;
  min-width: 725px;
`

export const Toolbox = styled.div`
  padding: 15px 20px 0 20px;

  & .comment {
    margin-bottom: 15px;
  }
  & .interaction {
    margin-bottom: 10px;
  }
`

export const Container = styled.div`
  position: relative;
  padding: 20px;
  padding-top: 15px;
  display: flex;
  height: 100%;
`

export const SideContent = styled.div`
  flex-shrink: 0;
  width: 300px;
  height: 100%;
  position: sticky;
  top: 80px;
`

export const StyledDivider = styled(Divider)`
  background-color: ${({ theme }) => theme.colors.border1};
`

export const Content = styled.div<{ media?: number; border?: boolean }>`
  min-width: 0;
  display: flex;
  width: 100%;

  ${({ border }) =>
    border &&
    css`
      margin-right: 20px;
      padding-right: 20px;
      border-right: 1px solid ${({ theme }) => theme.colors.border1};
    `}

  & .media-divider {
    display: none;
  }

  @media screen and (max-width: ${({ media }) => (media ? media : '800')}px) {
    flex-direction: column;
    align-items: center;

    & .media-divider {
      display: block;
    }
    & .maincontent {
      margin-left: 0;
    }
  }
`

export const MainContent = styled.div`
  min-width: 0;
  width: 100%;
  margin-left: 20px;
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};

  & .content-info {
    &:not(:last-child) {
      margin-bottom: 20px;
    }

    &.content-description {
      white-space: normal;
      word-wrap: break-word;
    }
  }

  & .content-tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    font-size: 13px;

    & .content-tags-item {
      flex-shrink: 0;
      color: white;
      background-color: gray;
      padding: 0 5px;
      height: 20px;
      line-height: 20px;
      border-radius: 10px;
      margin-bottom: 6px;

      &:hover {
        background-color: #616161;
      }

      &:not(:last-child) {
        margin-right: 10px;
      }
    }
  }
`
