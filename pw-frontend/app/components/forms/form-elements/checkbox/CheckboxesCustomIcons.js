// ** MUI Imports
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Icon Imports
import CustomIcon from '@/vercelFix/Icon'

const CheckboxesCustomIcons = () => {
  return (
    <FormGroup row>
      <FormControlLabel
        label='Heart'
        control={
          <Checkbox
            defaultChecked
            name='size-small'
            checkedIcon={<CustomIcon icon='mdi:heart' fontSize={24} />}
            icon={<CustomIcon icon='mdi:heart-outline' fontSize={24} />}
          />
        }
      />
      <FormControlLabel
        label='Star'
        control={
          <Checkbox
            defaultChecked
            name='size-small'
            checkedIcon={<CustomIcon icon='mdi:star' fontSize={24} />}
            icon={<CustomIcon icon='mdi:star-outline' fontSize={24} />}
          />
        }
      />
    </FormGroup>
  )
}

export default CheckboxesCustomIcons
