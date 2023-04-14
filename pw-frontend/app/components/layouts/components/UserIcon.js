// ** Custom Icon Import
import CustomIcon from '@/vercelFix/Icon'

const UserIcon = ({ icon, ...rest }) => {
  return <CustomIcon icon={icon} {...rest} />
}

export default UserIcon
