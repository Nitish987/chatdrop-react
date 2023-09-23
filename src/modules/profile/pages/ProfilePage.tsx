import { useParams } from 'react-router-dom';
import { FriendProfileModel } from '../../../models/profile';
import { useAppSelector } from '../../../redux/hooks';
import ProfileController from '../controllers/ProfileController';
import '../styles/ProfilePage.css';
import React, { useCallback, useEffect, useState } from 'react';
import MyProfile from '../components/MyProfile';
import FriendProfile from '../components/FriendProfile';
import UserModel from '../../../models/user';
import User from '../../../shared/components/User';
import MessageBlock from '../../../shared/ui/MessageBlock';
import Loading from '../../../shared/ui/Loading';

export default function ProfilePage() {
  const params = useParams();
  const auth = useAppSelector(state => state.auth);
  const [profileModel, setProfileModel] = useState<FriendProfileModel | null>(null);
  const [friends, setFriends] = useState<UserModel[] | null>(null);
  const profileController = ProfileController.getInstance();

  const fetchProfile = useCallback(async () => {
    if (params.uid && auth.uid !== params.uid) {
      const profile = await profileController.fetchFriendProfile(params.uid);
      setProfileModel(profile);
    }
  }, [auth.uid, params.uid, profileController]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const fetchFriends = useCallback(async () => {
    if (params.uid) {
      const friendList = await profileController.fetchFriendList(params.uid);
      setFriends(friendList);
    }
  }, [params.uid, profileController]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  return (
    <div className='profile-container'>
      <div className="profile-outlet">
        <div className="profile-view">
          {
            auth.uid === params.uid
              ? <MyProfile />
              : profileModel ? <FriendProfile profile={profileModel} /> : <MessageBlock message='Nothing to show...' height={500} applyBoxShadow={true}/>
          }
        </div>
      </div>
      <div className="profile-menu">
        <div className="profile-friends">
          <span className='sub-heading-theme'>Friends</span>
          {
            friends === null
              ?
              <Loading />
              :
              <>
                {
                  friends.length > 0
                    ?
                    <>
                      {
                        friends.map(user => {
                          return <User key={user.uid} uid={user.uid} name={user.name} photo={user.photo} gender={user.gender} message={user.message} applyBoxShadow={false} />
                        })
                      }
                    </>
                    :
                    <MessageBlock message='No friends found.' />
                }
              </>
          }
        </div>
      </div>
    </div>
  )
}
