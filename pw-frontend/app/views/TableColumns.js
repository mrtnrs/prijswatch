// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Custom Components
import CustomChip from '@/components/mui/chip'
import CustomAvatar from '@/components/mui/avatar'

// ** Utils Import
import { getInitials } from '@/core/utils/get-initials'

// ** Data Import


const rows = [
  {
    id: 47,
    avatar: '4.png',
    full_name: 'Had Chatelot',
    post: 'Cost Accountant',
    email: 'hchatelot1a@usatoday.com',
    city: 'Mercedes',
    start_date: '11/23/2016',
    salary: 11446.3,
    age: '64',
    experience: '4 Years',
    status: 4
  },
  {
    id: 48,
    avatar: '',
    full_name: 'Georgia McCrum',
    post: 'Registered Nurse',
    email: 'gmccrum1b@icio.us',
    city: 'Nggalak',
    start_date: '04/19/2018',
    salary: 14002.31,
    age: '63',
    experience: '3 Years',
    status: 1
  },
  {
    id: 49,
    avatar: '5.png',
    full_name: 'Krishnah Stilldale',
    post: 'VP Accounting',
    email: 'kstilldale1c@chronoengine.com',
    city: 'Slavs’ke',
    start_date: '03/18/2017',
    salary: 10704.29,
    age: '56',
    experience: '6 Years',
    status: 1
  },
  {
    id: 50,
    avatar: '4.png',
    full_name: 'Mario Umbert',
    post: 'Research Assistant',
    email: 'mumbert1d@digg.com',
    city: 'Chorotis',
    start_date: '05/13/2019',
    salary: 21813.54,
    age: '43',
    experience: '3 Years',
    status: 1
  },
  {
    id: 95,
    avatar: '2.png',
    full_name: 'Edwina Ebsworth',
    post: 'Human Resources Assistant',
    email: 'eebsworth2m@sbwire.com',
    city: 'Puzi',
    start_date: '09/27/2018',
    salary: 19586.23,
    age: '27',
    experience: '2 Years',
    status: 1
  }
]


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
  2: { title: 'professional', color: 'success' },
  3: { title: 'rejected', color: 'error' },
  4: { title: 'resigned', color: 'warning' },
  5: { title: 'applied', color: 'info' }
}

// ** Full Name Getter
const getFullName = params =>
  toast(
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {renderClient(params)}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
          {params.row.full_name}
        </Typography>
      </Box>
    </Box>
  )

const TableColumns = ({handleNewScraperBtn}) => {
  // ** States
  const [pageSize, setPageSize] = useState(7)
  const [hideNameColumn, setHideNameColumn] = useState(false)

  const columns = [
    {
      flex: 0.25,
      minWidth: 290,
      field: 'full_name',
      headerName: 'Name',
      hide: hideNameColumn,
      renderCell: params => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(params)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.full_name}
              </Typography>
              <Typography noWrap variant='caption'>
                {row.email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.175,
      minWidth: 120,
      headerName: 'Date',
      field: 'start_date',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.start_date}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 110,
      field: 'salary',
      headerName: 'Salary',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.salary}
        </Typography>
      )
    },
    {
      flex: 0.1,
      field: 'age',
      minWidth: 80,
      headerName: 'Age',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.age}
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
      minWidth: 140,
      field: 'actions',
      headerName: 'Actions',
      renderCell: params => {
        return (
          <Button size='small' variant='outlined' color='secondary' onClick={() => getFullName(params)}>
            Get Name
          </Button>
        )
      }
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Column'
        action={
          <div>
            <Button size='small' variant='contained' onClick={() => handleNewScraperBtn()}>
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
