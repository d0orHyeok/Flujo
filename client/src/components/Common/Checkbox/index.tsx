import {
  FormControlLabel,
  Checkbox,
  FormControlLabelProps,
  CheckboxProps,
} from '@mui/material'
import React from 'react'
import styled from 'styled-components'

const StyledFormControlLabel = styled(FormControlLabel)<{
  textsize?: string
}>`
  &.MuiFormControlLabel-root {
    margin-left: -9px;
  }

  & .MuiCheckbox-root.Mui-checked ~ .MuiFormControlLabel-label {
    color: ${({ theme }) => theme.colors.bgText};
  }
  & .MuiFormControlLabel-label {
    font-size: ${({ textsize }) => textsize || '13px'};
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
  textsize?: string
}

const CheckBox = ({
  label,
  formControlLabelProps,
  textsize,
  ...props
}: ICheckboxProps) => {
  return (
    <StyledFormControlLabel
      {...formControlLabelProps}
      control={<StyledCheckBox {...props} />}
      label={label || ''}
      textsize={textsize}
    />
  )
}

export default CheckBox
