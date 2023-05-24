// ** MUI Imports
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Icon Imports
import CustomIcon from '@/vercelFix/Icon'

const CheckboxesSizes = () => {
  return (
    <FormGroup row>
      <FormControlLabel
        label='Small'
        control={
          <Checkbox
            defaultChecked
            name='size-small'
            icon={<CustomIcon icon='mdi:checkbox-blank-outline' fontSize={20} />}
            checkedIcon={<CustomIcon icon='mdi:checkbox-marked' fontSize={20} />}
          />
        }
      />
      <FormControlLabel label='Default' control={<Checkbox defaultChecked name='size-default' />} />
    </FormGroup>
  )
}

export default CheckboxesSizes
