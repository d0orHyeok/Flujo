import styled from 'styled-components'

export const Slider = styled.div`
  position: relative;

  & .chart-musicBox-btn {
    &.hide {
      display: none;
    }

    &.leftBtn {
      left: 0;
    }

    &.rightBtn {
      right: 0;
    }

    z-index: 100;
    top: 40%;
    transform: translateY(-50%);
    position: absolute;
    width: 40px;
    height: 40px;
    padding: 0;
    background-color: rgba(${({ theme }) => theme.colors.bgColorRGB}, 0.77);
    border: 1px solid ${({ theme }) => theme.colors.border1};
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};

    &:hover {
      background-color: rgba(${({ theme }) => theme.colors.bgColorRGB}, 0.86);
      border-color: ${({ theme }) => theme.colors.primaryColor};
      color: ${({ theme }) => theme.colors.primaryColor};
    }

    ${({ theme }) => theme.device.tablet} {
      width: 32px;
      height: 32px;
      padding: 4px;
    }
  }

  & .chart-musicBox {
    display: flex;
    align-items: center;
    overflow-x: scroll;

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }

    & .chart-musicCard {
      flex-shrink: 0;
      &:not(:last-child) {
        margin-right: 20px;
      }
    }
  }
`
