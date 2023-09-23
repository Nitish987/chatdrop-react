import React from 'react'
import "../styles/LeftMenu.css"
import IconTextButton from '../../../shared/ui/IconTextButton'
import Icons from '../../../settings/constants/icons'
import { useNavigate } from 'react-router-dom'


export default function LeftMenu() {
  const navigate = useNavigate();

  return (
    <div className='left-menu-container'>
        <IconTextButton icon={Icons.home} justifyContent='left' showBorder={false} label='Home' onClick={() => navigate('/')}/>
        <IconTextButton icon={Icons.friends} justifyContent='left' showBorder={false} label='Friends' />
        <IconTextButton icon={Icons.chats} justifyContent='left' showBorder={false} label='Chats' />
        <IconTextButton icon={Icons.stories} justifyContent='left' showBorder={false} label='Stories' />
        <IconTextButton icon={Icons.reels} justifyContent='left' showBorder={false} label='Reels' onClick={() => navigate('/reel')}/>
        <IconTextButton icon={Icons.notification} justifyContent='left' showBorder={false} label='Notification' />
    </div>
  )
}
