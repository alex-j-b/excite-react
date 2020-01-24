import React from 'react'
import { StyledButton } from './StyledButton.js'
import { StyledBox } from '../styledBox/StyledBox.js'
import { StyledLines } from '../styledLines/StyledLines.js'

export const Button = props => {
  const {
    toggleButton,
    buttonColor,
    buttonWidth,
    buttonStyle,
    className,
    Box,
    Lines,
    barColor,
    isActive,
    ...rest
  } = props

  return (
    <StyledButton
      onClick={toggleButton}
      aria-label="Navigation"
      {...{ buttonWidth, buttonColor, buttonStyle, className }}
      {...rest}
    >
      <Box {...{ buttonWidth }}>
        <Lines {...{ buttonWidth, barColor, isActive }} />
      </Box>
    </StyledButton>
  )
}

Button.defaultProps = {
  buttonWidth: 40,
  Box: StyledBox,
  Lines: StyledLines,
}
