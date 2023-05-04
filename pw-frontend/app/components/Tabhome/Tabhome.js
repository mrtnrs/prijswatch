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

// Styled TabList component
const TabList = styled(MuiTabList)(({ theme }) => ({
      backdropFilter: "blur(3px)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "100px",
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    minHeight: 'unset',
    padding: "3px 15px",
        padding: '0px 0px',
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    color: 'white !important',
    borderRadius: "1000px !important",
    border: '1px solid #ffffffa6 !important',
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
    boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer'
  }
}))

const NewTabPanel = styled(TabPanel)(({ theme }) => ({
  width: '100%',
}))

const Tabhome = () => {
  // ** State
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <>
    <Typography className='text-gradient' variant="h4" style={{ marginTop: 50, width: '100%', marginBottom: 20, fontWeight: 600 }}>Populaire categorieën</Typography>
    <TabContext value={value}>
      <TabList onChange={handleChange} aria-label='customized tabs example'>
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
