// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'

// ** Third Party Components
import { Toast, Toaster } from '@/core/CustomHotToast';

// ** Custom Components
import CustomChip from '@/components/mui/chip'
import CustomAvatar from '@/components/mui/avatar'

// ** Utils Import
import { getInitials } from '@/core/utils/get-initials'

// API
import { runOnce } from '@/api/scraperService';


// ** renders client column
const renderClient = params => {
  const { row } = params
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]
  if (row.avatar.length) {
    return <CustomAvatar src={`/images/avatars/${row.avatar}`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
  } else {
    return (
      <CustomAvatar skin='light' color={color} sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}>
        {getInitials(row.full_name ? row.full_name : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const statusObj = {
  1: { title: 'current', color: 'primary' },
  2: { title: 'Succes', color: 'success' },
  3: { title: 'rejected', color: 'error' },
  4: { title: 'resigned', color: 'warning' },
  5: { title: 'applied', color: 'info' }
}

// ** Full Name Getter
const getFullName = params =>
  Toast(
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {renderClient(params)}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
          {params.row.full_name}
        </Typography>
      </Box>
    </Box>
  )

const TableColumns = ({
  key, 
  webshop, 
  scrapers, 
  handleNewScraperBtn, 
  setSelectedScraper, 
  setDisplayAddScraperDialog,
  onStartStop
}) => {
  // ** States
  const [pageSize, setPageSize] = useState(7);
  const [hideNameColumn, setHideNameColumn] = useState(false);
  const [rows, setRows] = useState([]);



  useEffect(() => {
    if (scrapers !== undefined) {
      // Create rows here and store them in the 'rows' state
        const rows = scrapers.map(scraper => ({
    id: scraper.id,
    avatar: '', // Add appropriate avatar field
    full_name: scraper.name,
    post: scraper.type,
    email: scraper.id, // Add appropriate email field
    city: '', // Add appropriate city field
    lastrun: scraper.lastRun, // Add appropriate start_date field
    numProducts: scraper.totalProducts, // Add appropriate salary field
    newUpdated: scraper.changedProducts, // Add appropriate age field
    experience: '', // Add appropriate experience field
    status: scraper.lastRunStatus === 'success' ? 2 : 1, // Update status based on your data model
    active: scraper.active, // Add the active property here
  }));
      setRows(rows);
    }
  }, [scrapers]);

const handleRunOnce = async (scraperId) => {
  console.log(scraperId);
  try {
    const result = await runOnce(scraperId);
    console.log(result);
    Toast.success('Scraper ran: ' + result);
  } catch (error) {
    console.error('Error running scraper:', error);
    Toast.error('Error running scraper:', error);
  }
};

  const columns = [
    {
      flex: 0.25,
      minWidth: 290,
      field: 'full_name',
      headerName: 'Name',
      hide: hideNameColumn,
      renderCell: params => {
      const { row } = params;
      const scraper = scrapers.find(scraper => scraper.id === row.id);

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(params)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: 'text.primary', fontWeight: 600 }}
              onClick={() => {
                setSelectedScraper(scraper);
                setDisplayAddScraperDialog(true);
              }}
            >
              {row.full_name}
            </Typography>
            <Typography noWrap variant="caption">
              {row.email}
            </Typography>
          </Box>
        </Box>
      );
    },
    },
    {
      flex: 0.175,
      minWidth: 120,
      headerName: 'Last run',
      field: 'lastrun',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.lastrun}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 110,
      field: '# products',
      headerName: '# products',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.numProducts}
        </Typography>
      )
    },
    {
      flex: 0.1,
      field: 'New/Updated',
      minWidth: 80,
      headerName: 'New/Updated',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.newUpdated}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'status',
      headerName: 'Status',
      renderCell: params => {
        const status = statusObj[params.row.status]

        return (
          <CustomChip
            size='small'
            skin='light'
            color={status.color}
            label={status.title}
            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          />
        )
      }
    },
    {
      flex: 0.125,
      minWidth: 240,
      field: 'actions',
      headerName: 'Actions',
  renderCell: params => {
    const scraperId = params.row.id; // Get the scraper id from the row data
    const scraper = rows.find(row => row.id === scraperId);

    return (
      <>
        <Button size='small' variant='outlined' color='secondary' onClick={() => handleRunOnce(scraperId)}>
          Run Once
        </Button>
       <Button
          size='small'
          variant='outlined'
          color='secondary'
          onClick={() => onStartStop(scraperId, scraper.active)}
        >
          {scraper.active ? 'Stop' : 'Start'}
        </Button>

      </>
    );
  },
    }
  ]

  return (
    <Card>
      <CardHeader
        title={webshop.name}
        action={
          <div>
            <Button size='small' variant='contained' onClick={() => handleNewScraperBtn( )}>
              Add new scraper
            </Button>
          </div>
        }
      />
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        disableSelectionOnClick
        rowsPerPageOptions={[7, 10, 25, 50]}
        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
      />
    </Card>
  )
}

export default TableColumns
