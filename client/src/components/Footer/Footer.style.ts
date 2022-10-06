import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Divider as MuiDivider } from '@mui/material'

export const Wrapper = styled.footer`
  font-size: 12px;
  line-height: 12px;
  background-color: ${({ theme }) => theme.colors.bgColor};
`

export const Container = styled.div`
  position: relative;
  padding: 1rem 3rem;
  background-color: ${({ theme }) => theme.colors.bgColorRGBA('0.06')};
`

export const Divider = styled(MuiDivider)`
  background-color: ${({ theme }) => theme.colors.bgTextRGBA('0.16')};
`

export const FooterLink = styled(Link)`
  font-size: 1em;
  color: ${({ theme }) => theme.colors.bgTextRGBA('0.6')};
  margin-right: 1em;

  &:last-child {
    margin-right: 0;
  }
  &:hover {
    text-decoration: underline;
  }
`

export const Section = styled.div`
  padding: 1rem 0;
`

export const SectionInfo = styled(Section)`
  max-width: 800px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  & .item {
    margin: 0.5em 0;
    margin-right: 2em;
    color: ${({ theme }) => theme.colors.bgTextRGBA('0.86')};

    &:last-child {
      margin-right: 0;
    }

    & .item-head {
      color: ${({ theme }) => theme.colors.bgTextRGBA('0.6')};
      margin-right: 0.5em;
    }
  }
`

export const SectionTerms = styled(Section)`
  text-align: left;

  ${({ theme }) => theme.device.tablet} {
    text-align: center;
  }
`

export const SectionSNS = styled(Section)`
  top: 0;
  right: 0;
  position: absolute;
  text-align: right;

  & a {
    margin: 0 0.5em;
    font-size: 2.2em;
    color: ${({ theme }) => theme.colors.bgTextRGBA('0.6')};
    &:hover {
      color: ${({ theme }) => theme.colors.primaryColor};
    }
  }

  ${({ theme }) => theme.device.tablet} {
    position: relative;
    text-align: center;
  }
`
