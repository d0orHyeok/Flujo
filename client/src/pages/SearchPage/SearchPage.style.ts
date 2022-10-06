import styled from 'styled-components'
import SearchSide from './SearchSide/SearchSide'

export const Wrapper = styled.div`
  position: relative;
  min-height: 100%;
  padding: 0 16px;
  max-width: 1300px;
  width: 100%;
  margin: 0 auto;
`

const stickyTop = 65

export const Head = styled.h1`
  position: sticky;
  top: ${stickyTop}px;
  height: 44px;
  line-height: 44px;
  font-size: 18px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border1};
  margin-bottom: 16px;
  z-index: 10;
  background-color: ${({ theme }) => theme.colors.bgColor};
`

export const StyledSearchSide = styled(SearchSide)`
  position: sticky;
  top: ${stickyTop + 60}px;
  width: 220px;
  float: left;

  &::after {
    content: '';
    display: block;
    clear: both;
  }
`
export const Container = styled.div`
  padding-left: 236px;
  padding-right: 16px;
  padding-bottom: 20px;
`
