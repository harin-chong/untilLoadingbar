import React from 'react'
import LoginButton from '../../common/component/LoginButton'
import { Box } from '@mui/material'

const Navbar = () => {
  return (
    <Box display = "flex" justifyContent = "flex-end" alignItems = "center" height = "64px">
        <LoginButton />
    </Box>
  )
}

export default Navbar
