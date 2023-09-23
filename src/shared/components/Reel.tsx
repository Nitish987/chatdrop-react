import React, { useEffect, useRef, useState } from 'react';
import '../styles/Reel.css';
import ReelModel, { ReelCommentModel } from '../../models/reel';
import Avatar from '../utils/avatar';
import PrimaryTextButton from '../ui/PrimaryTextButton';
import IconButton from '../ui/IconButton';
import Icons from '../../settings/constants/icons';
import Emojis from '../../settings/constants/emojis';
import ReelController, { ReelLike, ReelVisibility } from '../controllers/ReelController';
import CentreModal from '../ui/CentreModal';
import useModal from '../hooks/Modal';
import { useAppDispatch } from '../../redux/hooks';
import { showAlert } from '../../features/alert/alertSlice';
import ReelComment from './ReelComment';
import DropdownItem from '../ui/DropdownItem';
import { changeReelVisibility, likeReelFeed, setReelCommentCount } from '../../features/reelline/reellineSlice';

interface ReelProps {
  index: number;
  reel: ReelModel;
  isSameUser: boolean;
}

export default function Reel({ index, reel, isSameUser }: ReelProps) {
  const reelController = ReelController.getInstance(reel.id);
  const dispatch = useAppDispatch();
  const videoPlayer = useRef<HTMLVideoElement>(null);
  const [isPlaying, setPlaying] = useState(false);
  const [liked, setLike] = useState<string | null>(reel.liked);
  const [likesCount, setLikesCount] = useState(reel.likes_count);
  const [commentsCount, setCommentsCount] = useState(reel.comments_count);
  const [reelVisibility, setReelVisibility] = useState(reel.visibility);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<ReelCommentModel[]>([]);
  const commentListDiv = useRef<HTMLDivElement | null>(null);
  const [commentController] = useModal({
    onOpen: async () => {
      reelPlay();
      const comments = await reelController.listComment();
      comments && setComments(comments);
      if (commentListDiv.current) {
        commentListDiv.current.scroll({
          top: commentListDiv.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    },
    onClose: () => {
      reelPlay();
    }
  });

  const reelPlay = async () => {
    if (videoPlayer.current) {
      if (isPlaying) videoPlayer.current.pause();
      else await videoPlayer.current.play();
    }
  }

  const getVisibilityIcon = () => {
    if (reelVisibility === ReelVisibility.PUBLIC) return Icons.public;
    if (reelVisibility === ReelVisibility.ONLY_FRIENDS) return Icons.friends;
    if (reelVisibility === ReelVisibility.PRIVATE) return Icons.private;
    return Icons.public;
  }

  const getChangeVisibilityText = () => {
    let visibility = '';
    if (reelVisibility === ReelVisibility.PUBLIC) visibility = ReelVisibility.ONLY_FRIENDS;
    if (reelVisibility === ReelVisibility.ONLY_FRIENDS) visibility = ReelVisibility.PRIVATE;
    if (reelVisibility === ReelVisibility.PRIVATE) visibility = ReelVisibility.PUBLIC;
    return 'Make '.concat(visibility.split('_').map(word => word.charAt(0).concat(word.slice(1).toLowerCase())).join(' '));
  }

  const getLikedEmoji = () => {
    switch (liked) {
      case ReelLike.NONE: return Icons.like;
      case ReelLike.LIKE: return Emojis.like;
      case ReelLike.LOVE: return Emojis.love;
      case ReelLike.YAY: return Emojis.yay;
      case ReelLike.WOW: return Emojis.wow;
      case ReelLike.HAHA: return Emojis.haha;
      case ReelLike.SAD: return Emojis.sad;
      case ReelLike.ANGRY: return Emojis.angry;
    }
    return Icons.like;
  }

  const onLike = (like: string) => {
    if (liked === like) {
      reelController.dislike();
      setLike(ReelLike.NONE);
      setLikesCount(likesCount - 1);
      dispatch(likeReelFeed({ index, liked: ReelLike.NONE }));
    } else {
      reelController.like(like);
      setLike(like);
      if (liked === null) setLikesCount(likesCount + 1);
      dispatch(likeReelFeed({ index, liked: like }));
    }
  }

  const onCommentTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value);
  }

  const changePostVisibility = async () => {
    switch (reelVisibility) {
      case ReelVisibility.PUBLIC:
        if (await reelController.changeVisibility(ReelVisibility.ONLY_FRIENDS)) {
          setReelVisibility(ReelVisibility.ONLY_FRIENDS);
          dispatch(changeReelVisibility({ index, visibility: ReelVisibility.ONLY_FRIENDS }));
        }
        break;
      case ReelVisibility.ONLY_FRIENDS:
        if (await reelController.changeVisibility(ReelVisibility.PRIVATE)) {
          setReelVisibility(ReelVisibility.PRIVATE);
          dispatch(changeReelVisibility({ index, visibility: ReelVisibility.PRIVATE }));
        }
        break;
      case ReelVisibility.PRIVATE:
        if (await reelController.changeVisibility(ReelVisibility.PUBLIC)) {
          setReelVisibility(ReelVisibility.PUBLIC);
          dispatch(changeReelVisibility({ index, visibility: ReelVisibility.PUBLIC }));
        }
        break;
    }
  }

  const onCommentSend = async () => {
    if (commentText === '') return;
    const comment = await reelController.addComment(commentText);
    comment && setComments(comments.concat(comment));
    comment && setCommentsCount(commentsCount + 1);
    comment && dispatch(setReelCommentCount({ index, count: commentsCount + 1 }));
    comment && setCommentText('');
    if (commentListDiv.current) {
      commentListDiv.current.scroll({
        top: commentListDiv.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  const onCommentDelete = async (commentId: number) => {
    const success = await reelController.deleteComment(commentId);
    if (success) {
      dispatch(showAlert({
        message: 'Comment deleted.',
        type: 'info'
      }));
      setCommentsCount(commentsCount - 1);
      dispatch(setReelCommentCount({ index, count: commentsCount - 1 }));
    } else {
      dispatch(showAlert({
        message: 'Unable to delete this comment.',
        type: 'danger'
      }));
    }
    return success;
  }

  useEffect(() => {
    setLike(reel.liked);
  }, [setLike, reel.liked]);

  useEffect(() => {
    setReelVisibility(reel.visibility);
  }, [setReelVisibility, reel.visibility]);

  useEffect(() => {
    setLikesCount(reel.likes_count);
  }, [setLikesCount, reel.likes_count]);

  useEffect(() => {
    setCommentsCount(reel.comments_count);
  }, [setCommentsCount, reel.comments_count]);

  useEffect(() => {
    if (videoPlayer.current) {
      videoPlayer.current.onplaying = () => {
        setPlaying(true);
      }
      videoPlayer.current.onpause = () => {
        setPlaying(false);
      }
    }
  });

  return (
    <>
      <div className='reel'>
        <video src={reel.video?.url} ref={videoPlayer} autoPlay={true}></video>
        <div className='reel-options'>
          <IconButton icon={Icons.moreHorizontal} showBorder={false} label='options' />
          <div className="reel-options-dropdown">
            {
              isSameUser &&
              <>
                <DropdownItem label={getChangeVisibilityText()} onClick={changePostVisibility} />
                {/* <DropdownItem label='Delete' onClick={onReelDelete} /> */}
              </>
            }
            <DropdownItem label='Report' />
          </div>
        </div>
        <div className="reel-user">
          <img src={Avatar.get(reel.user.gender, reel.user.photo)} alt="profile_pic" />
          <div className="reel-user-names">
            <span>{reel.user.name}</span>
            <span>{reel.user.username}</span>
          </div>
          <PrimaryTextButton label='Follow' />
        </div>
        <div className="reel-buttons">
          <div className="reel-like-emoji-holder">
            <IconButton className='reel-lcsv-btn' icon={getLikedEmoji()} label='like' showBorder={false} applyIconTheme={liked === ReelLike.NONE} />
            <div className="reel-like-emoji">
              <IconButton icon={Emojis.like} applyIconTheme={false} showBorder={liked === ReelLike.LIKE} label='like' onClick={() => onLike(ReelLike.LIKE)} />
              <IconButton icon={Emojis.love} applyIconTheme={false} showBorder={liked === ReelLike.LOVE} label='love' onClick={() => onLike(ReelLike.LOVE)} />
              <IconButton icon={Emojis.yay} applyIconTheme={false} showBorder={liked === ReelLike.YAY} label='yay' onClick={() => onLike(ReelLike.YAY)} />
              <IconButton icon={Emojis.wow} applyIconTheme={false} showBorder={liked === ReelLike.WOW} label='wow' onClick={() => onLike(ReelLike.WOW)} />
              <IconButton icon={Emojis.haha} applyIconTheme={false} showBorder={liked === ReelLike.HAHA} label='haha' onClick={() => onLike(ReelLike.HAHA)} />
              <IconButton icon={Emojis.sad} applyIconTheme={false} showBorder={liked === ReelLike.SAD} label='sad' onClick={() => onLike(ReelLike.SAD)} />
              <IconButton icon={Emojis.angry} applyIconTheme={false} showBorder={liked === ReelLike.ANGRY} label='angry' onClick={() => onLike(ReelLike.ANGRY)} />
            </div>
          </div>
          <span>{likesCount}</span>
          <IconButton className='reel-lcsv-btn' icon={Icons.comment} label='comment' showBorder={false} onClick={commentController.openModal} />
          <span>{commentsCount}</span>
          <IconButton className='reel-lcsv-btn' icon={Icons.send} label='share' showBorder={false} />
          <IconButton className='reel-lcsv-btn' icon={getVisibilityIcon()} label='visibility' showBorder={false} />
          <IconButton className='reel-lcsv-btn' icon={isPlaying ? Icons.pause : Icons.play} label='play' showBorder={false} onClick={reelPlay} />
        </div>
      </div>
      <CentreModal title={'Reel Comment'} controller={commentController}>
        <div className='reel-comment-list' ref={commentListDiv}>
          {
            comments.map((comment, index) => {
              return (
                <ReelComment key={comment.id} index={index} comment={comment} onDelete={() => onCommentDelete(comment.id)} isSameUser={comment.user.uid === reel.auth_user.uid} />
              );
            })
          }
        </div>
        <div className="reel-comment-input">
          <img className='reel-comment-input-pic' src={Avatar.get(reel.auth_user.gender, reel.auth_user.photo)} alt="profile_pic" />
          <input type="text" className='input-text' placeholder='Write something...' value={commentText} onChange={onCommentTextChange} />
          <IconButton icon={Icons.send} label='send' onClick={onCommentSend} />
        </div>
      </CentreModal>
    </>
  )
}
