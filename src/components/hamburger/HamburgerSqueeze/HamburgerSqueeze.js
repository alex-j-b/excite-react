import React from 'react'
import { Button } from '../button/Button'
import { StyledLinesSqueeze } from './StyledLinesSqueeze'

export const HamburgerSqueeze = props => (
    <Button {...props} Lines={StyledLinesSqueeze} />
)
