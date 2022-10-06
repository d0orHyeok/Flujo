import styled, { css } from 'styled-components'
import { Divider, Popover } from '@mui/material'
import { Button } from '@components/Common'

export const StyledDivider = styled(Divider)`
  background-color: ${({ theme }) => theme.colors.border1};
`

export const CommentHead = styled.div`
  margin-bottom: 10px;
  & .icon.comment {
    margin-right: 5px;
  }
`

export const MusicComments = styled.div`
  padding: 10px 0;
  font-size: 13px;

  & .comment-item {
    display: flex;

    &:not(:last-child) {
      margin-bottom: 15px;
    }

    & .comment-imageBox {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      margin-right: 10px;
      & .comment-imageBox-image,
      & .comment-imageBox-link {
        width: 100%;
        height: 100%;
        border-radius: 20px;
        object-fit: cover;
      }
    }

    & .comment-content {
      min-width: 0;
      flex-grow: 1;
      & .comment-content-top {
        display: flex;
        margin-bottom: 3px;
        align-items: center;
        height: 20px;
        line-height: 20px;

        & .commentedAt,
        & .createdAt {
          flex-shrink: 0;
        }

        & .comment-link {
          margin-right: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        & .commentedAt {
          border: none;
          padding: 0;
          font-size: 12px;
          margin-right: 5px;

          &:hover {
            color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
          }

          &::before {
            cursor: default;
            color: ${({ theme }) => theme.colors.bgTextRGBA(0.5)};
            font-size: 0.8em;
            content: 'at';
            margin-right: 5px;
          }
        }

        & .createdAt {
          margin-left: auto;
          font-size: 12px;
          text-align: right;
        }
      }

      & .comment-content-bottom {
        position: relative;
        & .text {
          line-height: 18px;
          overflow-wrap: break-word;
          white-space: normal;
          padding-right: 30px;
        }

        & .deleteBtn {
          position: absolute;
          top: 0;
          right: 0;
          display: none;
        }

        & .deleteBtn.active,
        &:hover .deleteBtn {
          display: block;
        }
      }

      & .comment-content-top .comment-link:hover,
      & .comment-content-bottom {
        color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
      }
    }
  }
`

export const DeleteButton = styled(Button)`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.bgText};
  padding: 0 3px;
  border: 1px solid ${({ theme }) => theme.colors.border2};
  border-radius: 3px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.bgText};
  }
`

export const EmptyComment = styled.div`
  padding: 10px 0;
  text-align: center;
  font-size: 10px;

  & .icon.comment {
    font-size: 15em;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.15)};
  }

  & .text-main {
    font-size: 2em;
    color: ${({ theme }) => theme.colors.bgText};
    margin: 1em 0;
  }

  & .text-light {
    font-size: 1.6em;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
  }

  ${({ theme }) => theme.device.tablet} {
    font-size: 8px;
  }
`

export const StyledPopover = styled(Popover)`
  ${({ theme }) => {
    const c = theme.colors
    return css`
      & .MuiPopover-paper {
        background-color: ${c.bgColor};
        box-shadow: 0 2px 7px -1px ${c.bgColorRGBA(0.4)};
        border-radius: 4px;
      }
    `
  }}
`

export const Dialog = styled.div`
  ${({ theme }) => {
    const c = theme.colors
    return css`
      width: 200px;
      padding: 8px;
      color: ${c.bgText};

      & .dialog-content {
        font-size: 14px;
        line-height: 18px;
      }

      & .buttons {
        margin-top: 10px;
        text-align: right;

        & .delete-cancelBtn {
          margin-right: 4px;
        }

        & .delete-cancelBtn,
        & .delete-yesBtn {
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 13px;
        }
      }
    `
  }}
`
