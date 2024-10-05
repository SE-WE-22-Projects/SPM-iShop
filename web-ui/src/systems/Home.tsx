import { Box, Typography } from '@mui/material'
import React from 'react'
import { DateCard } from '../components/DashbordCard'
import dashboardImg from '../../assets/DashboardImg.jpg'

function Home() {
  return (
    <>
    <Typography variant="h2" align="center">Welcome To VisionGuide</Typography>
    <Typography variant="h4"  align="center">Admin Dashboard</Typography>
    <Box mt={5} justifyContent="center" display="flex">
        <DateCard/>
    </Box>
    <Box justifyContent="center" display="flex">
        <img width={650} src={dashboardImg} />
    </Box>
    </>
  )
}

export default Home