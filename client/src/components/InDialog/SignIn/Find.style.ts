import styled from 'styled-components'
import * as CommonStyle from '../common.style'

export const Wrapper = styled(CommonStyle.DialogContainer)`
  padding: 30px 0;
  width: 100%;
  text-align: center;
`

export const Title = styled(CommonStyle.DialogTitle)`
  font-size: 20px;
  margin-bottom: 20px;
`

export const Content = styled(CommonStyle.DialogContent)`
  font-size: 14px;
  padding: 0 30px;
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};

  & .content-btn {
    padding: 0 20px;
    height: 40px;
    border-radius: 6px;
  }
`

export const ResultBox = styled.div`
  margin-top: 30px;

  & .result-title + * {
    margin-top: 10px;
  }
`
