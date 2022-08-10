import {
  FormControlLabel,
  Checkbox,
  FormControlLabelProps,
  CheckboxProps,
} from '@mui/material'
import React from 'react'
import styled from 'styled-components'

const StyledFormControlLabel = styled(FormControlLabel)<{
  textSize?: string
}>`
  &.MuiFormControlLabel-root {
    margin-left: -9px;
  }

  & .MuiCheckbox-root.Mui-checked ~ .MuiFormControlLabel-label {
    color: ${({ theme }) => theme.colors.bgText};
  }
  & .MuiFormControlLabel-label {
    font-size: ${({ textSize }) => textSize || '13px'};
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
    font-family: inherit;
    line-height: 100%;
  }
`
const StyledCheckBox = styled(Checkbox)`
  &.MuiCheckbox-root {
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
    padding: 4px;

    &.Mui-checked {
      color: ${({ theme }) => theme.colors.primaryColor};
    }
  }
`

interface ICheckboxProps extends CheckboxProps {
  label?: string | number
  formControlLabelProps?: FormControlLabelProps
  textSize?: string
}

const CheckBox = ({
  label,
  formControlLabelProps,
  textSize,
  ...props
}: ICheckboxProps) => {
  return (
    <StyledFormControlLabel
      {...formControlLabelProps}
      textSize={textSize}
      control={<StyledCheckBox {...props} defaultChecked />}
      label={label || ''}
    />
  )
}

export default CheckBox
