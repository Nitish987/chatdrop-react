import '../styles/Profile.css';
import React, { useEffect, useState } from 'react';
import { FriendProfileModel } from '../../../models/profile'
import Avatar from '../../../shared/utils/avatar';
import HighlightButton from '../../../shared/ui/HighlightButton';
import IconTextButton from '../../../shared/ui/IconTextButton';
import PrimaryIconTextButton from '../../../shared/ui/PrimaryIconTextButton';
import ProfileTabs from './ProfileTabs';
import Icons from '../../../settings/constants/icons';
import ProfileController from '../controllers/ProfileController';
import { useAppDispatch } from '../../../redux/hooks';
import { showAlert } from '../../../features/alert/alertSlice';
import IconButton from '../../../shared/ui/IconButton';
import DropdownItem from '../../../shared/ui/DropdownItem';
import useModal from '../../../shared/hooks/Modal';
import CentreModal from '../../../shared/ui/CentreModal';
import User from '../../../shared/components/User';
import MessageBlock from '../../../shared/ui/MessageBlock';
import Loading from '../../../shared/ui/Loading';
import { FollowersModel, FollowingsModel } from '../../../models/fans';

interface IFriendProfileProps {
  profile: FriendProfileModel | null;
}

export default function FriendProfile({ profile }: IFriendProfileProps) {
  const controller = ProfileController.getInstance();
  const dispatch = useAppDispatch();
  const [friendBtnText, setFriendBtnText] = useState('Add Friend');
  const [friendBtnIcon, setFriendBtnIcon] = useState(Icons.addFriend);
  const [isBlocked, setIsBlocked] = useState(profile!.is_blocked);
  const [isFriend, setIsFriend] = useState(profile!.is_friend);
  const [isFriendRequested, setIsFriendRequested] = useState(profile!.is_friend_requested);
  const [friendRequestId, setFriendRequestId] = useState(profile!.friend_request_id);
  const [followBtnText, setFollowBtnText] = useState('Follow');
  const [followBtnIcon, setFollowBtnIcon] = useState(Icons.favourite);
  const [isFollowing, setIsFollowing] = useState(profile!.is_following);
  const [isFollowRequested, setIsFollowRequested] = useState(profile!.is_follow_requested);
  const [followRequestId, setFollowRequestId] = useState(profile!.follow_request_id);

  const [followers, setFollowers] = useState<FollowersModel | null>(null);
  const [followerController] = useModal({
    onOpen: () => fetchFollowers(),
    onClose: () => {
      setFollowers(null);
    }
  });
  const [followings, setFollowings] = useState<FollowingsModel | null>(null);
  const [followingController] = useModal({
    onOpen: () => fetchFollowings(),
    onClose: () => {
      setFollowings(null);
    }
  });

  const fetchFollowers = () => {
    if (followers === null || followers.has_next) {
      controller.fetchFollowersList(profile!.profile.uid).then(data => {
        if (data) {
          if (followers) {
            setFollowers({followers: followers.followers.concat(data.followers), has_next: data.has_next});
          } else {
            setFollowers(data);
          }
        }
      });
    }
  }
  const fetchFollowings = () => {
    if (followings === null || followings.has_next) {
      controller.fetchFollowingsList(profile!.profile.uid).then(data => {
        if (data) {
          if (followings) {
            setFollowings({followings: followings.followings.concat(data.followings), has_next: data.has_next});
          } else {
            setFollowings(data);
          }
        }
      });
    }
  }

  const onFriend = async () => {
    if (isFriend) {
      const success = await controller.unFriend(profile!.profile.uid);
      if (success) {
        dispatch(showAlert({
          message: 'You break the friendship.',
          type: 'info'
        }));
        setIsFriend(false);
        setFriendBtnText('Add Friend');
        setFriendBtnIcon(Icons.addFriend);
      }
    } else if (isFriendRequested) {
      const success = await controller.acceptFriendRequest(friendRequestId);
      if (success) {
        dispatch(showAlert({
          message: 'You are friends now.',
          type: 'info'
        }));
        setIsFriend(true);
        setIsFriendRequested(false);
        setFriendRequestId(-1);
        setFriendBtnText('Unfriend');
        setFriendBtnIcon(Icons.removeFriend);
      }
    } else {
      const success = await controller.sendFriendRequest(profile!.profile.uid);
      if (success) {
        dispatch(showAlert({
          message: 'Friend request sent.',
          type: 'info'
        }));
      }
    }
  }

  const onFollow = async () => {
    if (isFollowing) {
      const success = await controller.unFollowFriend(profile!.profile.uid);
      if (success) {
        dispatch(showAlert({
          message: 'You unfollow.',
          type: 'info'
        }));
        setIsFollowing(false);
        setFollowBtnText('Follow');
        setFollowBtnIcon(Icons.favourite);
      }
    } else {
      const success = await controller.sendFriendFollowRequest(profile!.profile.uid);
      if (success) {
        dispatch(showAlert({
          message: 'Follow request sent.',
          type: 'info'
        }));
      }
    }
  }

  const onFollowAccept = async () => {
    if (isFollowRequested) {
      const success = await controller.acceptFriendFollowRequest(followRequestId);
      if (success) {
        dispatch(showAlert({
          message: 'New Follower added.',
          type: 'info'
        }));
        setIsFollowRequested(false);
        setFollowRequestId(-1);
      }
    }
  }

  const onBlock = async () => {
    if (isBlocked) {
      const success = await controller.unblock(profile!.profile.uid);
      if (success) {
        dispatch(showAlert({
          message: 'Unblocked!',
          type: 'success'
        }));
        setIsBlocked(false);
      }
    } else {
      const success = await controller.block(profile!.profile.uid);
      if (success) {
        dispatch(showAlert({
          message: 'Blocked!',
          type: 'info'
        }));
        setIsBlocked(true);
      }
    }
  }

  useEffect(() => {
    if (isFriend) {
      setFriendBtnText('Unfriend');
      setFriendBtnIcon(Icons.removeFriend);
    } else if (isFriendRequested) {
      setFriendBtnText('Accept Request');
      setFriendBtnIcon(Icons.check);
    }
  }, [setFriendBtnIcon, setFriendBtnText, isFriend, isFriendRequested]);

  useEffect(() => {
    if (isFollowing) {
      setFollowBtnText('Unfollow');
      setFollowBtnIcon(Icons.favouriteFill);
    }
  }, [isFollowing, setFollowBtnIcon, setFollowBtnText]);

  return (
    <>
      {
        profile &&
        <div className='profile-sections'>
          <div className='profile-data-block'>
            <div className='profile-pic-container'>
              <div className="profile-cover-holder">
                <img className='profile-cover' src={profile.profile.cover_photo} alt="cover_pic" />
                <div className="profile-dropdown-menu">
                  <IconButton icon={Icons.moreVertical} label='menu' />
                  <div className="profile-dropdown-menu-options">
                    <DropdownItem label={isBlocked ? 'Unblock' : 'Block'} onClick={onBlock} />
                    <DropdownItem label='Report' />
                  </div>
                </div>
              </div>
              <div className="profile-photo-holder">
                <img className='profile-photo' src={Avatar.get(profile.profile.gender, profile.profile.photo)} alt="profile_pic" />
              </div>
            </div>
            <div className='profile-content-holder'>
              <div className="profile-details">
                <span className='profile-name'>{profile.profile.name}</span>
                <span className='profile-message'>{profile.profile.message}</span>
              </div>
              <div className="profile-fanfollowing">
                <HighlightButton highlight={profile.profile.follower_count.toString()} label='followers' showBorder={false} onClick={followerController.openModal} />
                <HighlightButton highlight={profile.profile.following_count.toString()} label='followings' showBorder={false} onClick={followingController.openModal} />
                <HighlightButton highlight={profile.profile.post_count.toString()} label='posts' showBorder={false} />
                <HighlightButton highlight={profile.profile.reel_count.toString()} label='reels' showBorder={false} />
              </div>
              <div className="profile-buttons">
                <IconTextButton icon={friendBtnIcon} label={friendBtnText} onClick={onFriend} />
                <PrimaryIconTextButton icon={followBtnIcon} label={followBtnText} onClick={onFollow} />
                {
                  isFollowRequested &&
                  <PrimaryIconTextButton icon={Icons.check} label="Accept Follower" onClick={onFollowAccept} />
                }
              </div>
            </div>
          </div>
          <div className='profile-data-block profile-content-holder'>
            <ProfileTabs profile={profile}/>
          </div>
        </div>
      }
      <CentreModal title='Followers' controller={followerController} onScrollEnd={fetchFollowers}>
        <div className="profile-followers">
          {
            followers
              ? <>
                {
                  followers.followers.length > 0
                    ? followers.followers.map(user => {
                      return <User key={user.uid} uid={user.uid} name={user.name} photo={user.photo} gender={user.gender} message={user.message} applyBoxShadow={false}/>
                    })
                    : <MessageBlock message='nothing to show...' />
                }
              </>
              : <Loading />
          }
        </div>
      </CentreModal>
      <CentreModal title='Followings' controller={followingController} onScrollEnd={fetchFollowings}>
        <div className="profile-followings">
          {
            followings
              ? <>
                {
                  followings.followings.length > 0
                    ? followings.followings.map(user => {
                      return <User key={user.uid} uid={user.uid} name={user.name} photo={user.photo} gender={user.gender} message={user.message} applyBoxShadow={false}/>
                    })
                    : <MessageBlock message='nothing to show...' />
                }
              </>
              : <Loading />
          }
        </div>
      </CentreModal>
    </>
  )
}
