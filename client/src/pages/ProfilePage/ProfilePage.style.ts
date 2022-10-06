import styled from 'styled-components'

export const Wrapper = styled.div`
  min-height: 100%;
  max-width: 1200px;
  margin: auto;

  & .profileNav {
    margin: 0 30px;
  }
`

export const Container = styled.div`
  position: relative;
  padding: 10px 30px;
  display: flex;
  box-sizing: border-box;

  & > * {
    min-width: 0;
  }

  & .profile-main {
    flex-grow: 1;
    border-right: 1px solid ${({ theme }) => theme.colors.border1};
    margin-right: 20px;
    padding-right: 20px;
  }

  & .profile-side {
    position: sticky;
    top: 65px;
    width: 300px;
    height: 100%;
    flex-shrink: 0;
  }
`
