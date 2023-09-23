import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import User from '../../../shared/components/User';
import '../styles/Dashboard.css';
import React, { useEffect, useRef, useState } from 'react';
import AddPost from './AddPost';
import LeftMenu from './LeftMenu';
import Post from '../../../shared/components/Post';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PostModel from '../../../models/post';
import DashboardController from '../controllers/DashboardController';
import Loading from '../../../shared/ui/Loading';
import { appendTimelineFeeds } from '../../../features/timeline/timelineSlice';
import MessageBlock from '../../../shared/ui/MessageBlock';
import FriendRequestBox from './FriendRequestBox';
import { showAlert } from '../../../features/alert/alertSlice';
import ReelBlock from './ReelBlock';

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const profile = useAppSelector(state => state.content.profile);
  const timeline = useAppSelector(state => state.timeline.timeline);
  const [loading, setLoading] = useState(false);
  const dashboardController = DashboardController.getInstance();
  const timelineFeedDiv = useRef<HTMLDivElement | null>(null);

  const redirectAccordingly = () => {
    // redirect user to the redirect url if provided in query params otherwise dashboard is opened
    const redirectTo = searchParams.get('redirect');
    if (redirectTo !== null) {
      navigate(`${redirectTo}`);
    }
  }

  const fetchTimeLineFeeds = async () => {
    if (timeline && timeline.hasNext && !loading) {
      setLoading(true);
      const timelineFeeds = await dashboardController.fetchTimelineFeeds();
      dispatch(appendTimelineFeeds(timelineFeeds));
      setLoading(false);
    }
  }

  const onPostDelete = async (postId: string) => {
    const success = await dashboardController.deletePost(postId);
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
    redirectAccordingly();
    window.onscroll = (e) => {
      if (timelineFeedDiv.current !== null) {
        if (window.scrollY > (timelineFeedDiv.current?.scrollHeight - 1000)) {
          fetchTimeLineFeeds();
        }
      }
    }
  });

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-menu">
          <div className="left-menu">
            {
              profile &&
              <User uid={profile?.profile.uid!} name={profile?.profile.name!} photo={profile?.profile.photo!} gender={profile?.profile.gender!} message={profile?.profile.message!} />
            }
            <LeftMenu />
          </div>
          <div className="right-menu">
            <FriendRequestBox/>
          </div>
        </div>
        <div className="outlet-holder">
          <div className='outlet-view'>
            <AddPost />
            <ReelBlock />
            <div ref={timelineFeedDiv} className='timeline-feeds'>
              {
                timeline &&
                timeline.posts.map((post: PostModel, index: number) => {
                  return (
                    <Post key={`${post.id}::${index}`} index={index} post={post} onDelete={() => onPostDelete(post.id)} isSameUser={post.user.uid === post.auth_user.uid} />
                  );
                })
              }
              {
                timeline && !timeline.hasNext &&
                <MessageBlock message="you're all caught up for now"/>
              }
              {
                loading && <Loading />
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
