import React from 'react'
import "../styles/FriendRequestBox.css"
import Avatar from '../../../shared/utils/avatar'
import PrimaryTextButton from '../../../shared/ui/PrimaryTextButton'
import TextButton from '../../../shared/ui/TextButton'

export default function FriendRequestBox() {
    return (
        <div className='friend-request-container' >
            <div className='friend-request-header'>
                <img className='friend-request-pic' src={Avatar.get("F")} alt="profile_pic" />
                <div className='friend-request-header-middle'>
                    <span className='friend-request-name'>Amelia coco</span>
                    <span className='friend-request-message'>friend request</span>
                </div>
            </div>
            <div className='friend-request-footer'>
                <PrimaryTextButton label='Confirm'/>
                <TextButton label='Ignore'/>
            </div>
        </div>
    )
}
