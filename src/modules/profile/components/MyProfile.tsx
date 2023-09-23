import '../styles/Profile.css';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import Avatar from '../../../shared/utils/avatar';
import HighlightButton from '../../../shared/ui/HighlightButton';
import PrimaryIconTextButton from '../../../shared/ui/PrimaryIconTextButton';
import Icons from '../../../settings/constants/icons';
import IconTextButton from '../../../shared/ui/IconTextButton';
import IconButton from '../../../shared/ui/IconButton';
import ProfileTabs from './ProfileTabs';
import React, { useRef, useState } from 'react';
import { showAlert } from '../../../features/alert/alertSlice';
import ProfileController from '../controllers/ProfileController';
import { updateProfileContent, updateProfileCoverContent, updateProfilePhotoContent } from '../../../features/content/contentSlice';
import CentreModal from '../../../shared/ui/CentreModal';
import ImageCropModal from '../../../shared/ui/ImageCropModal';
import useModal from '../../../shared/hooks/Modal';
import { readFileAsDataUrl } from '../../../infra/utils';
import { FollowersModel, FollowingsModel } from '../../../models/fans';
import User from '../../../shared/components/User';
import MessageBlock from '../../../shared/ui/MessageBlock';
import Loading from '../../../shared/ui/Loading';


export default function MyProfile() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(state => state.content.profile);
  const [profileDetails, setProfileDetails] = useState({message: '', bio: '', interest: '', location: '', website: ''});
  const [messageCharCount, setMessageCharCount] = useState(0);
  const [bioCharCount, setBioCharCount] = useState(0);
  const profilePhotoInputFile = useRef<HTMLInputElement>(null);
  const profileCoverInputFile = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState({ action: '', data: ''});
  const profileController = ProfileController.getInstance();
  const [modalController] = useModal({
    onOpen: () => {
      setProfileDetails({
        message: profile!.profile.message,
        bio: profile!.profile.bio,
        interest: profile!.profile.interest,
        location: profile!.profile.location,
        website: profile!.profile.website
      });
      setMessageCharCount(profile!.profile.message.length);
      setBioCharCount(profile!.profile.bio.length);
    }
  });
  const [cropController] = useModal({});
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
      profileController.fetchFollowersList(profile!.profile.uid).then(data => {
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
      profileController.fetchFollowingsList(profile!.profile.uid).then(data => {
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

  const pickProfilePhoto = () => profilePhotoInputFile.current?.click();
  const pickProfileCover = () => profileCoverInputFile.current?.click();

  const pickPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const imageDataUrl = await readFileAsDataUrl(e.target.files[0]);
      setImage({action: 'photo', data: imageDataUrl});
      cropController.openModal();
    }
  }

  const pickCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const imageDataUrl = await readFileAsDataUrl(e.target.files[0]);
      setImage({action: 'cover', data: imageDataUrl});
      cropController.openModal();
    }
  }

  const onProfilePhotoSave = (image: { localUrl: string, blob: Blob} | null) => {
    if (image !== null) {
      profileController.updateProfilePhoto(image.blob).then(photo => {
        if (photo) {
          cropController.closeModal();
          dispatch(updateProfilePhotoContent(photo));
          dispatch(showAlert({
            message: 'Profile photo updated!',
            type: 'info'
          }));
        } else {
          dispatch(showAlert({
            message: 'Unable to update profile photo.',
            type: 'danger'
          }));
        }
      }).catch(error => {
        dispatch(showAlert({
          message: 'Something went wrong.',
          type: 'danger',
        }));
      });
    } else {
      dispatch(showAlert({
        message: 'Something went wrong while cropping photo.',
        type: 'danger',
      }));
    }
  }

  const onProfileCoverSave = (image: { localUrl: string, blob: Blob} | null) => {
    if (image !== null) {
      profileController.updateCoverPhoto(image.blob).then(cover => {
        if (cover) {
          cropController.closeModal();
          dispatch(updateProfileCoverContent(cover));
          dispatch(showAlert({
            message: 'Profile Cover updated!',
            type: 'info'
          }));
        } else {
          dispatch(showAlert({
            message: 'Unable to update cover photo.',
            type: 'danger'
          }));
        }
      }).catch(error => {
        dispatch(showAlert({
          message: 'Something went wrong.',
          type: 'danger',
        }));
      });
    } else {
      dispatch(showAlert({
        message: 'Something went wrong while cropping cover photo.',
        type: 'danger',
      }));
    }
  }

  const onProfileDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === 'message') {
      if (e.target.value.length > 100) return;
      setMessageCharCount(e.target.value.length);
    }
    if (e.target.name === 'bio') {
      if (e.target.name.length > 2000) return;
      setBioCharCount(e.target.value.length);
    }
    setProfileDetails({ ...profileDetails, [e.target.name]: e.target.value });
  }

  const onSaveProfileDetails = () => {
    if (profileDetails.website !== '' && !profileDetails.website.startsWith('https://')) {
      dispatch(showAlert({
        message: 'Website link must starts with https.',
        type: 'danger'
      }));
      return;
    }

    profileController.updateProfile(profileDetails).then(profile => {
      if (profile !== null) {
        modalController.closeModal();
        dispatch(updateProfileContent(profile));
        dispatch(showAlert({
          message: 'Profile updated!',
          type: 'info'
        }));
      } else {
        dispatch(showAlert({
          message: 'Unable to update profile.',
          type: 'danger'
        }));
      }
    }).catch(error => {
      dispatch(showAlert({
        message: 'Something went wrong.',
        type: 'danger'
      }));
    });
  }

  return (
    <>
      {
        profile &&
        <div className='profile-sections'>
          <div className='profile-data-block'>
            <div className='profile-pic-container'>
              <div className="profile-cover-holder">
                <img className='profile-cover' src={profile.profile.cover_photo} alt="cover_pic" />
              </div>
              <div className="profile-photo-holder">
                <img className='profile-photo' src={Avatar.get(profile.profile.gender, profile.profile.photo)} alt="profile_pic" />
                <input type='file' ref={profilePhotoInputFile} style={{display: 'none'}} accept='image/*' onChange={pickPhotoChange}/>
                <input type='file' ref={profileCoverInputFile} style={{display: 'none'}} accept='image/*' onChange={pickCoverChange}/>
                <div className="profile-pics-edit-btns">
                  <IconTextButton icon={Icons.camera} label='Photo' onClick={pickProfilePhoto}/>
                  <IconTextButton icon={Icons.profileCover} label='Cover' onClick={pickProfileCover}/>
                </div>
                <div className="profile-pics-edit-btns profile-pic-edit-btns-mobile">
                  <IconButton icon={Icons.camera} label='Photo' onClick={pickProfilePhoto}/>
                  <IconButton icon={Icons.profileCover} label='Cover' onClick={pickProfileCover}/>
                </div>
              </div>
            </div>
            <div className='profile-content-holder'>
              <div className="profile-details">
                <span className='profile-name'>{profile.profile.name}</span>
                <span className='profile-message'>{profile.profile.message}</span>
              </div>
              <div className="profile-fanfollowing">
                <HighlightButton highlight={profile.profile.follower_count.toString()} label='followers' showBorder={false} onClick={followerController.openModal}/>
                <HighlightButton highlight={profile.profile.following_count.toString()} label='followings' showBorder={false} onClick={followingController.openModal}/>
                <HighlightButton highlight={profile.profile.post_count.toString()} label='posts' showBorder={false} />
                <HighlightButton highlight={profile.profile.reel_count.toString()} label='reels' showBorder={false} />
              </div>
              <div className="profile-buttons">
                <IconTextButton icon={Icons.addCircle} label='Create Story' />
                <PrimaryIconTextButton icon={Icons.editFill} label='Edit Profile' onClick={modalController.openModal} />
                <IconButton icon={Icons.moreVertical} label='options' />
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
      <CentreModal title='Edit Profile' controller={modalController} onSave={onSaveProfileDetails}>
        <div className="edit-profile-block">
          <div>
            <span className="sub-heading-theme">Message</span>
            <input type="text" className="input-text" name='message' placeholder='Your Message' value={profileDetails.message} onChange={onProfileDetailsChange}/>
            <span className="counter-text">{messageCharCount}/100</span>
          </div>
          <div>
            <span className="sub-heading-theme">Bio</span>
            <textarea className="input-text no-resize" name='bio' placeholder='Your bio' rows={10} value={profileDetails.bio} onChange={onProfileDetailsChange}></textarea>
            <span className="counter-text">{bioCharCount}/2000</span>
          </div>
          <div>
            <span className="sub-heading-theme">Interest</span>
            <input type="text" className="input-text" name='interest' placeholder='Your Interest' value={profileDetails.interest} onChange={onProfileDetailsChange}/>
            <span className='instruction'>Separate with commas, eg: Photography, Designing</span>
          </div>
          <div>
            <span className="sub-heading-theme">Location</span>
            <input type="text" className="input-text" name='location' placeholder='Where do you live' value={profileDetails.location} onChange={onProfileDetailsChange}/>
          </div>
          <div>
            <span className="sub-heading-theme">Website</span>
            <input type="text" className="input-text" name='website' placeholder='Where do you live' value={profileDetails.website} onChange={onProfileDetailsChange}/>
            <span className='instruction'>Link should starts wih https. eg: https://www.example.com</span>
          </div>
        </div>
      </CentreModal>
      <ImageCropModal title='Crop Photo' image={image.data} aspectRatio={image.action === 'photo' ? 1/1 : 4/1} controller={cropController} onSave={image.action === 'photo' ? onProfilePhotoSave : onProfileCoverSave}></ImageCropModal>
    </>
  )
}
