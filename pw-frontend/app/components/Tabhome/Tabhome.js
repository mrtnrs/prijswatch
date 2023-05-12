// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiTabList from '@mui/lab/TabList'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'

// Styled TabList component
const TabList = styled(MuiTabList)(({ theme }) => ({
      backdropFilter: "blur(3px)",
    backgroundColor: theme.palette.customColors.rgba(theme.palette.mode === 'light' ? '#000000' : '#ffffff', .12),
border: `1px solid ${theme.palette.customColors.rgba(
      theme.palette.mode === 'light' ? '#8b8b8b' : '#8b8888',
      0.25
    )}`,
    borderRadius: "100px",
    cursor: "pointer",
    minHeight: 'unset',
    padding: "3px 15px",
        padding: '0px 0px',
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    color: `${theme.palette.customColors.secondMain} !important`,
    backgroundColor: theme.palette.customColors.rgba(theme.palette.mode === 'light' ? '#ffffff' : '#1b1b1b', .62),
    borderRadius: "1000px !important",
    border: `1px solid ${theme.palette.customColors.rgba(
      theme.palette.mode === 'light' ? '#5f5d5d' : '#8b8888',
      .6
    )} !important`,
    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.1)",
  },
  '& .MuiTab-root': {
    minWidth: 110,
    borderRadius: 8,
    paddingTop: "3px",
    paddingBottom: "3px",
    borderRadius: "1000px",
    minHeight: 'unset',
    border: 'none',
    textTransform: 'capitalize',
    cursor: 'pointer'
  }
}))

const NewTabPanel = styled(TabPanel)(({ theme }) => ({
  width: '100%',
}))

const Tabhome = () => {
  // ** State
  const [value, setValue] = useState('1');
  const theme = useTheme();

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <>
    <Typography
    className={theme.palette.mode === 'light' ? 'text-gradient-light' : 'text-gradient'}
    variant="h4" sx={{ textAlign: {xs: 'center', md: 'left'}}} style={{ marginTop: 50, width: '100%', marginBottom: 20, fontWeight: 600 }}>Populaire categorieën</Typography>
    <TabContext value={value}>
      <TabList onChange={handleChange} aria-label='customized tabs example' sx={{ margin: {xs: '0 auto', md: 'unset'} }}>
        <Tab value='1' label='Entertainment' />
        <Tab value='2' label='Huishouden' />
      </TabList>
      <NewTabPanel value='1'>
      <Grid sx={{ flexWrap: 'wrap', display: 'flex', gap: '1em', marginTop: '15px', paddingTop: '5px'}}>
        <div className="popularCat">Hello</div>
        <div className="popularCat">Hello</div>
        <div className="popularCat">Hello</div>
        <div className="popularCat">Hello</div>
        <div className="popularCat">Hello</div>
        <div className="popularCat">Hello</div>
      </Grid>
      </NewTabPanel>
      <NewTabPanel value='2'>
      <Grid sx={{ flexWrap: 'wrap', display: 'flex', gap: '1em', marginTop: '15px', paddingTop: '5px'}}>
        <div className="popularCat">Ja</div>
        <div className="popularCat">Hello</div>
        <div className="popularCat">Hello</div>
        <div className="popularCat">Hello</div>
        <div className="popularCat">Hello</div>
        <div className="popularCat">Hello</div>
      </Grid>
      </NewTabPanel>
    </TabContext>
    </>
  )
}

export default Tabhome
