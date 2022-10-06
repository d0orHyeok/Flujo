import styled from 'styled-components'
import Dropzone from '@components/Dropzone/Dropzone'

export const Wrapper = styled.div`
  min-height: 100%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
`

export const StyledDropzone = styled(Dropzone)<{ hidden?: boolean }>`
  width: 100%;
  flex-shrink: 0;
  max-width: 600px;
  border-style: dotted;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.bgColorRGBA(0.1)};
  display: ${({ hidden }) => (hidden ? 'none' : 'flex')};
`
