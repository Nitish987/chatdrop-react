import React, { useEffect, useRef, useState } from 'react'
import TextButton from '../../../shared/ui/TextButton'
import Divider from '../../../shared/ui/Divider';
import { FriendProfileModel, FullProfileModel, ProfileCoverPhotoModel, ProfilePhotoModel } from '../../../models/profile';
import MessageBlock from '../../../shared/ui/MessageBlock';
import { PostsModel } from '../../../models/post';
import ProfileController from '../controllers/ProfileController';
import Loading from '../../../shared/ui/Loading';
import Post from '../../../shared/components/Post';
import { useAppDispatch } from '../../../redux/hooks';
import { showAlert } from '../../../features/alert/alertSlice';

interface ProfileTabsProps {
  profile: FullProfileModel | FriendProfileModel;
}

export default function ProfileTabs({ profile }: ProfileTabsProps) {
  const profileController = ProfileController.getInstance();
  const dispatch = useAppDispatch();
  const [selectedTab, setSelectedTab] = useState(1);
  const [posts, setPosts] = useState<PostsModel | null>(null);
  const postListDiv = useRef<HTMLDivElement>(null);

  const fetchPosts = () => {
    if (posts === null || posts.has_next) {
      profileController.fetchPostList(profile.profile.uid).then(data => {
        if (data) {
          if (posts) {
            setPosts({posts: posts.posts.concat(data.posts), has_next: data.has_next});
          } else {
            setPosts(data);
          }
        }
      });
    }
  }

  const changeTab = (tab: number) => {
    setSelectedTab(tab);
    if (tab === 2) {
      fetchPosts();
    } else {
      setPosts(null);
    }
  }

  const onPostDelete = async (postId: string) => {
    const success = await profileController.deletePost(postId);
    if (success) {
      dispatch(showAlert({
        message: 'Post deleted.',
        type: 'info'
      }));
    } else {
      dispatch(showAlert({
        message: 'Unable to delete this post.',
        type: 'danger'
      }));
    }
    return success;
  }

  useEffect(() => {
    window.onscroll = e => {
      if (postListDiv.current) {
        if(window.scrollY > postListDiv.current.clientHeight - 100) {
          fetchPosts();
        }
      }
    }
  });

  return (
    <>
      <div className='profile-tabs'>
        <TextButton className={selectedTab === 1 ? 'profile-tab-selected' : ''} label='About' showBorder={false} onClick={() => changeTab(1)} />
        <TextButton className={selectedTab === 2 ? 'profile-tab-selected' : ''} label='Post' showBorder={false} onClick={() => changeTab(2)} />
        <TextButton className={selectedTab === 3 ? 'profile-tab-selected' : ''} label='Photos' showBorder={false} onClick={() => changeTab(3)} />
        <TextButton className={selectedTab === 4 ? 'profile-tab-selected' : ''} label='Cover' showBorder={false} onClick={() => changeTab(4)} />
      </div>
      <Divider />
      <div className="profile-tabs-output">
        {/* About */}
        {
          selectedTab === 1 &&
          <div className='profile-about'>
            {
              profile?.profile.bio !== '' &&
              <>
                <span className='sub-heading-theme'>Bio</span>
                <p>{profile?.profile.bio}</p>
              </>
            }
            {
              profile?.profile.interest !== '' &&
              <>
                <span className='sub-heading-theme'>Interest</span>
                <div className='interest-chip-container'>
                  {profile?.profile.interest.split(',').map((value: string, index: number) => {
                    return (
                      <span key={`interest_${index}`} className='interest-chip'>{value}</span>
                    );
                  })}
                </div>
              </>
            }
            {
              profile?.profile.website !== '' &&
              <>
                <span className='sub-heading-theme'>Website</span>
                <p><a href={profile?.profile.website} target='_blank' rel="noreferrer">{profile?.profile.website}</a></p>
              </>
            }
            {
              profile?.profile.location !== '' &&
              <>
                <span className='sub-heading-theme'>Location</span>
                <p>{profile?.profile.location}</p>
              </>
            }
          </div>
        }

        {/* Post */}
        {
          selectedTab === 2 &&
          <div className="profile-posts-content">
            <div className='profile-post-list' ref={postListDiv}>
              {
                posts
                  ? <>
                    {
                      posts.posts.length > 0
                        ? posts.posts.map((post, index) => {
                          return <Post key={post.id} index={index} post={post} onDelete={() => onPostDelete(post.id)} isSameUser={post.auth_user.uid === post.user.uid} />
                        })
                        : <MessageBlock message='Nothing to show...' />
                    }
                  </>
                  : <Loading />
              }
            </div>
          </div>
        }

        {/* Photos */}
        {
          selectedTab === 3 &&
          <div className='profile-photo-list'>
            {
              profile!.profile_photos.length > 0 ?
                profile!.profile_photos.map((photo: ProfilePhotoModel) => {
                  return (
                    <div key={`photo_${photo.id}`}>
                      <img src={photo.photo} alt="profile_pic" />
                    </div>
                  );
                })
                :
                <MessageBlock message='No Photos found.' />
            }
          </div>
        }

        {/* Cover */}
        {
          selectedTab === 4 &&
          <div className='profile-photo-list'>
            {
              profile!.profile_cover_photos.length > 0 ?
                profile!.profile_cover_photos.map((cover: ProfileCoverPhotoModel) => {
                  return (
                    <img key={`cover_${cover.id}`} src={cover.cover} alt="profile_pic" />
                  );
                })
                :
                <MessageBlock message='No Photos found.' />
            }
          </div>
        }
      </div>
    </>
  )
}
