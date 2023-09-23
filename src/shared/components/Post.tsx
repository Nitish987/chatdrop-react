import React, { useEffect, useRef, useState } from 'react'
import "../../shared/styles/Post.css"
import Avatar from '../utils/avatar'
import IconButton from '../ui/IconButton'
import Icons from '../../settings/constants/icons'
import PostModel, { PostCommentModel } from '../../models/post'
import PostController, { PostHashTag, PostLike, PostVisibility } from '../controllers/PostController'
import Emojis from '../../settings/constants/emojis'
import useModal from '../hooks/Modal'
import CentreModal from '../ui/CentreModal'
import PostComment from './PostComment'
import { useAppDispatch } from '../../redux/hooks';
import { showAlert } from '../../features/alert/alertSlice';
import DropdownItem from '../ui/DropdownItem'
import LinkPreviewCard from './LinkPreview'
import useViewportObserver from '../hooks/Viewport'
import { likePostFeed } from '../../features/timeline/timelineSlice'

interface PostProps {
  index: number;
  post: PostModel;
  onDelete: () => Promise<boolean>;
  isSameUser: boolean;
}


export default function Post({ index, post, onDelete, isSameUser }: PostProps) {
  const postController = PostController.getInstance(post.id);
  const dispatch = useAppDispatch();
  const [isDeleted, setDeleted] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const videoPlayer = useRef<HTMLVideoElement>(null);
  const isVideoPlayerInViewPort = useViewportObserver(videoPlayer);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [postVisibility, setPostVisibility] = useState(post.visibility);
  const [liked, setLike] = useState(post.liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<PostCommentModel[]>([]);
  const commentListDiv = useRef<HTMLDivElement | null>(null);
  const [commentController] = useModal({
    onOpen: async () => {
      playVideo();
      const comments = await postController.listComment();
      comments && setComments(comments);
      if (commentListDiv.current) {
        commentListDiv.current.scroll({
          top: commentListDiv.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    },
    onClose: () => {
      playVideo();
    }
  });

  const getVisibilityIcon = () => {
    if (postVisibility === PostVisibility.PUBLIC) return Icons.public;
    if (postVisibility === PostVisibility.ONLY_FRIENDS) return Icons.friends;
    if (postVisibility === PostVisibility.PRIVATE) return Icons.private;
  }

  const getChangeVisibilityText = () => {
    let visibility = '';
    if (postVisibility === PostVisibility.PUBLIC) visibility = PostVisibility.ONLY_FRIENDS;
    if (postVisibility === PostVisibility.ONLY_FRIENDS) visibility = PostVisibility.PRIVATE;
    if (postVisibility === PostVisibility.PRIVATE) visibility = PostVisibility.PUBLIC;
    return 'Make '.concat(visibility.split('_').map(word => word.charAt(0).concat(word.slice(1).toLowerCase())).join(' '));
  }

  const getPostText = () => {
    let taggedUser: any = {};
    post.hashtags.forEach(hashtag => {
      if (hashtag.type === PostHashTag.USER) {
        const userTag = hashtag.tag.split('::');
        taggedUser[userTag[0]] = userTag[1];
      }
    });

    if (post.text) {
      let list: string[] = post.text.split(' ');
      const content = list.map((word, index) => {
        if (word.charAt(0) === '@') {
          return (
            <span key={index.toString()}>
              <a href={`/profile/${taggedUser[word]}`} rel='noreferrer'>{word}</a>
              {' '}
            </span>
          );
        } else if (word.charAt(0) === '#') {
          return (
            <span key={index.toString()} style={{ color: 'var(--color-primary)' }}>
              {word}{' '}
            </span>
          );
        } else if (word.startsWith('http')) {
          return (
            <span key={index.toString()}>
              <a href={word} target='_blank' rel='noreferrer'>{word}</a>
              {' '}
            </span>
          );
        }
        return (
          <span key={index.toString()}>
            {word}{' '}
          </span>
        );
      });
      return content;
    }
    return '';
  }

  const getLikedEmoji = () => {
    switch (liked) {
      case PostLike.NONE: return Icons.like;
      case PostLike.LIKE: return Emojis.like;
      case PostLike.LOVE: return Emojis.love;
      case PostLike.YAY: return Emojis.yay;
      case PostLike.WOW: return Emojis.wow;
      case PostLike.HAHA: return Emojis.haha;
      case PostLike.SAD: return Emojis.sad;
      case PostLike.ANGRY: return Emojis.angry;
    }
    return Icons.like;
  }

  const getLikeCount = () => {
    let likeText = `${likesCount} ${likesCount > 1 ? 'likes' : 'like'}`;
    if (liked !== null) {
      switch (likesCount) {
        case 1: likeText = 'You like this'; break;
        case 2: likeText = 'Liked by you and one other'; break;
        default: likeText = `Liked by you and ${likesCount - 1} others`; break;
      }
    }
    return likeText;
  }

  const onLike = (like: string) => {
    if (liked === like) {
      postController.dislike();
      setLike(PostLike.NONE);
      setLikesCount(likesCount - 1);
      dispatch(likePostFeed({index, liked: PostLike.NONE}));
    } else {
      postController.like(like);
      setLike(like);
      if (liked === null) setLikesCount(likesCount + 1);
      dispatch(likePostFeed({index, liked: like}));
    }
  }

  const changePostVisibility = async () => {
    switch (postVisibility) {
      case PostVisibility.PUBLIC:
        (await postController.changeVisibility(PostVisibility.ONLY_FRIENDS)) && setPostVisibility(PostVisibility.ONLY_FRIENDS);
        break;
      case PostVisibility.ONLY_FRIENDS:
        (await postController.changeVisibility(PostVisibility.PRIVATE)) && setPostVisibility(PostVisibility.PRIVATE);
        break;
      case PostVisibility.PRIVATE:
        (await postController.changeVisibility(PostVisibility.PUBLIC)) && setPostVisibility(PostVisibility.PUBLIC);
        break;
    }
  }

  const onCommentTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value);
  }

  const onCommentSend = async () => {
    if (commentText === '') return;
    const comment = await postController.addComment(commentText);
    comment && setComments(comments.concat(comment));
    comment && setCommentsCount(commentsCount + 1);
    comment && setCommentText('');
    if (commentListDiv.current) {
      commentListDiv.current.scroll({
        top: commentListDiv.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  const onCommentDelete = async (commentId: number) => {
    const success = await postController.deleteComment(commentId);
    if (success) {
      dispatch(showAlert({
        message: 'Comment deleted.',
        type: 'info'
      }));
      setCommentsCount(commentsCount - 1);
    } else {
      dispatch(showAlert({
        message: 'Unable to delete this comment.',
        type: 'danger'
      }));
    }
    return success;
  }

  const onPostDelete = async () => {
    await onDelete() && setDeleted(true);
  }

  const playVideo = async () => {
    if (videoPlayer.current) {
      if (isVideoPlaying) {
        videoPlayer.current.pause();
      } else {
        await videoPlayer.current.play();
      }
    }
  }

  const muteVideo = () => {
    if (videoPlayer.current) {
      if (isVideoMuted) {
        videoPlayer.current.muted = false;
        setIsVideoMuted(false);
      } else {
        videoPlayer.current.muted = true;
        setIsVideoMuted(true);
      }
    }
  }

  useEffect(() => {
    if (videoPlayer.current) {
      videoPlayer.current.onplaying = () => {
        setIsVideoPlaying(true);
      }
      videoPlayer.current.onpause = () => {
        setIsVideoPlaying(false);
      }
    }
  });

  useEffect(() => {
    if (videoPlayer.current && !isVideoPlayerInViewPort) {
      videoPlayer.current.pause();
    }
  });

  return (
    <>
      {
        !isDeleted &&
        <div className='post'>
          <div className='post-header'>
            <img className='post-profile-pic' src={Avatar.get(post.user.gender, post.user.photo)} alt="profile_pic" />
            <div className='post-header-middle'>
              <span className='post-profile-name'>{post.user.name}</span>
              <div className='post-time-visibility'>
                <span className='post-time'>{post.posted_on}</span>
                <span>&bull;</span>
                <img className='post-icon-visiblity icon-theme' src={getVisibilityIcon()} alt="visibility" />
              </div>
            </div>
            <div className='post-options'>
              <IconButton icon={Icons.moreHorizontal} showBorder={false} label='options' />
              <div className="post-options-dropdown">
                {
                  isSameUser && 
                  <>
                    <DropdownItem label={getChangeVisibilityText()} onClick={changePostVisibility} />
                    <DropdownItem label='Delete' onClick={onPostDelete} />
                  </>
                }
                <DropdownItem label='Report' />
              </div>
            </div>
          </div>
          <div className='post-body'>
            {/* TEXT AND LINK  */}
            {
              (post.content_type === "TEXT" || post.content_type === "TEXT_PHOTO" || post.content_type === "TEXT_VIDEO") &&
              <>
                {
                  (post.text?.startsWith('http') && post.text.split(' ').length === 1)
                    ?
                    <div className='post-link-preview'>
                      <LinkPreviewCard url={post.text} />
                    </div>
                    :
                    <div className='post-text'>{getPostText()}</div>
                }
              </>
            }
            {/* PHOTO  */}
            {
              (post.content_type === "PHOTO" || post.content_type === "TEXT_PHOTO") &&
              <>
                {
                  post.photos.length === 1 &&
                  <div className='post-photo'>
                    <img src={post.photos[0].url} alt="post_photo" />
                  </div>
                }
                {
                  post.photos.length > 1 &&
                  <div className="post-photo-multiple">
                    {
                      post.photos.map((photo, index) => {
                        const style = photoIndex === index ? { display: 'none' } : {};
                        return <img key={`photo_${index}`} className='post-photo-multiple-img' src={photo.url} alt="post_photo" style={style} />
                      })
                    }
                    <div className="post-photo-multi-switch-btns">
                      <IconButton icon={Icons.arrowBack} label='next' onClick={() => setPhotoIndex(Math.abs(photoIndex - 1) % post.photos.length)} />
                      <IconButton icon={Icons.arrowForward} label='next' onClick={() => setPhotoIndex((photoIndex + 1) % post.photos.length)} />
                    </div>
                    <div className="post-photo-multi-counter">{`${photoIndex + 1} / ${post.photos.length}`}</div>
                  </div>
                }
              </>
            }
            {/* VIDEO  */}
            {
              (post.content_type === "VIDEO" || post.content_type === "TEXT_VIDEO") &&
              <div className='post-video'>
                <video src={post.video?.url} ref={videoPlayer}></video>
                <div className="post-video-player-btns">
                  <IconButton icon={isVideoPlaying ? Icons.pause : Icons.play} label='video_play' onClick={playVideo} />
                  <IconButton icon={isVideoMuted ? Icons.volumeOff : Icons.volumeUp} label='video_mute' onClick={muteVideo} />
                </div>
              </div>
            }
          </div>
          <div className='post-footer'>
            <div className='post-footer-buttons'>
              <div className="post-like-btn-container">
                <IconButton icon={getLikedEmoji()} applyIconTheme={liked === PostLike.NONE} showBorder={false} label='like' />
                <div className="post-like-emoji">
                  <IconButton icon={Emojis.like} applyIconTheme={false} showBorder={liked === PostLike.LIKE} label='like' onClick={() => onLike(PostLike.LIKE)} />
                  <IconButton icon={Emojis.love} applyIconTheme={false} showBorder={liked === PostLike.LOVE} label='love' onClick={() => onLike(PostLike.LOVE)} />
                  <IconButton icon={Emojis.yay} applyIconTheme={false} showBorder={liked === PostLike.YAY} label='yay' onClick={() => onLike(PostLike.YAY)} />
                  <IconButton icon={Emojis.wow} applyIconTheme={false} showBorder={liked === PostLike.WOW} label='wow' onClick={() => onLike(PostLike.WOW)} />
                  <IconButton icon={Emojis.haha} applyIconTheme={false} showBorder={liked === PostLike.HAHA} label='haha' onClick={() => onLike(PostLike.HAHA)} />
                  <IconButton icon={Emojis.sad} applyIconTheme={false} showBorder={liked === PostLike.SAD} label='sad' onClick={() => onLike(PostLike.SAD)} />
                  <IconButton icon={Emojis.angry} applyIconTheme={false} showBorder={liked === PostLike.ANGRY} label='angry' onClick={() => onLike(PostLike.ANGRY)} />
                </div>
              </div>
              <IconButton icon={Icons.comment} showBorder={false} label='comment' onClick={commentController.openModal} />
              <div className='post-footer-middle'></div>
              <IconButton icon={Icons.send} showBorder={false} label='send' />
            </div>
            <div className='post-like-comment-info'>
              <span><strong>{getLikeCount()}</strong></span>
              <span onClick={commentController.openModal}>View all {commentsCount} comments</span>
            </div>
            <div className='post-comment' onClick={commentController.openModal}>
              <img className='post-profile-pic' src={Avatar.get(post.auth_user.gender, post.auth_user.photo)} alt="profile_pic" />
              <div className='post-comment-add'>Drop a comment</div>
            </div>
          </div>
          <CentreModal title={'Post Comment'} controller={commentController}>
            <div className='post-comment-list' ref={commentListDiv}>
              {
                comments.map((comment, index) => {
                  return (
                    <PostComment key={comment.id} index={index} comment={comment} onDelete={() => onCommentDelete(comment.id)} isSameUser={comment.user.uid === post.auth_user.uid} />
                  );
                })
              }
            </div>
            <div className="post-comment-input">
              <img className='post-comment-input-pic' src={Avatar.get(post.auth_user.gender, post.auth_user.photo)} alt="profile_pic" />
              <input type="text" className='input-text' placeholder='Write something...' value={commentText} onChange={onCommentTextChange} />
              <IconButton icon={Icons.send} label='send' onClick={onCommentSend} />
            </div>
          </CentreModal>
        </div>
      }
    </>
  )
}
