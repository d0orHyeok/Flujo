import styled from 'styled-components'

export const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  min-height: 100%;
`

export const Head = styled.div`
  font-size: 24px;
  height: 100px;
  line-height: 100px;
`

export const Navbar = styled.nav`
  & ul {
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border1};

    & li {
      position: relative;
      padding: 8px 0;

      & .icon {
        margin-right: 4px;
        transform: translateY(2px);
      }

      &:not(:last-child) {
        margin-right: 20px;
      }

      &::before {
        display: none;
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background-color: ${({ theme }) => theme.colors.bgText};
      }

      &:hover {
        &::before {
          display: block;
        }
      }

      &.select {
        color: ${({ theme }) => theme.colors.primaryColor};
        &::before {
          display: block;
          background-color: ${({ theme }) => theme.colors.primaryColor};
        }
      }
    }
  }
`

export const Container = styled.div`
  padding: 20px 0 30px 0;
`
