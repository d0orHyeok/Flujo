import { Button } from '@components/Common'
import styled, { css } from 'styled-components'

export const Container = styled.div`
  min-height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
`
export const Head = styled.div`
  & .title {
    font-size: 20px;
    margin-bottom: 10px;
  }

  & .description {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
  }

  margin-bottom: 30px;
`
export const ChartItem = styled.li`
  &:not(:last-child) {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px dotted ${({ theme }) => theme.colors.border1};
  }

  & .chart-title {
    font-size: 16px;
    margin-bottom: 10px;

    & a {
      &:hover {
        color: ${({ theme }) => theme.colors.primaryColor};
        border-bottom: 1.5px solid ${({ theme }) => theme.colors.primaryColor};
      }
    }
  }
`

export const FilterBox = styled.div`
  margin-bottom: 30px;
`

export const CheckboxContainer = styled.div`
  ${({ theme }) => {
    const t = theme.colors
    return css`
      background-color: ${t.bgColorRGBA(0.12)};
      padding: 10px 20px;
      max-height: 160px;
      overflow-y: auto;
      border-radius: 4px;

      &::-webkit-scrollbar {
        width: 5px;
        border-radius: 2.5px;
        background-color: ${t.bgColorRGBA('0.06')};
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 2.5px;
        background-color: ${t.bgColorRGBA('0.2')};
      }
    `
  }}
`
export const FilterBtn = styled(Button)<{ active?: boolean }>`
  ${({ theme, active }) => {
    const t = theme.colors
    return css`
      border-radius: 4px;
      padding: 2px 6px;
      background-color: ${active && t.primaryColor};
      color ${active && t.bgColor};
    `
  }}
`
