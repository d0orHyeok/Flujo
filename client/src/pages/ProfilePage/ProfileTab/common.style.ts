import styled from 'styled-components'
import { GoSettings } from 'react-icons/go'

export const Empty = styled.div`
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & > * {
    min-width: 0;

    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }

  & .empty-content {
    font-size: 18px;
  }

  & .empty-link {
    color: ${({ theme }) => theme.colors.secondaryColor};
    font-size: 14px;
  }

  & a.empty-link:hover,
  & .empty-link a:hover {
    color: ${({ theme }) => theme.colors.bgText};
  }

  & .empty-button {
    padding: 8px;
    border-radius: 4px;
    font-size: 16px;
  }
`

export const StyledEmptyTrackIcon = styled(GoSettings)`
  padding: 30px 80px;
  font-size: 100px;
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.33)};
  border: 4px solid ${({ theme }) => theme.colors.bgTextRGBA(0.33)};
  border-radius: 8px;
`
