import styled from 'styled-components'

export const Wrapper = styled.div`
  min-height: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 30px;
`

export const Container = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.bgColorRGBA(0.1)};
  }

  padding: 30px 0;

  & .section-title {
    font-size: 20px;
    margin-bottom: 10px;
  }

  & .section-description {
    font-size: 14px;
    margin-bottom: 30px;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
  }
`
