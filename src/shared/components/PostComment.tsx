import React, { useState } from 'react';
import "../styles/PostComment.css";
import { PostCommentModel } from '../../models/post';
import Avatar from '../utils/avatar';
import IconButton from '../ui/IconButton';
import Icons from '../../settings/constants/icons';
import Emojis from '../../settings/constants/emojis';
import PostCommentController, { CommmentLike } from '../controllers/PostCommentController';
import DropdownItem from '../ui/DropdownItem';

interface PostCommentProps {
  index: number;
  comment: PostCommentModel;
  onDelete: () => Promise<boolean>;
  isSameUser: boolean;
}

export default function PostComment({ index, comment, onDelete, isSameUser }: PostCommentProps) {
  const commentController = PostCommentController.getInstance(comment.id);
  const [liked, setLike] = useState(comment.liked);
  const [likesCount, setLikesCount] = useState(comment.likes_count);
  const [isDeleted, setDeleted] = useState(false);

  const getLikedEmoji = () => {
    switch (liked) {
      case CommmentLike.NONE: return Icons.like;
      case CommmentLike.LIKE: return Emojis.like;
      case CommmentLike.LOVE: return Emojis.love;
      case CommmentLike.YAY: return Emojis.yay;
      case CommmentLike.WOW: return Emojis.wow;
      case CommmentLike.HAHA: return Emojis.haha;
      case CommmentLike.SAD: return Emojis.sad;
      case CommmentLike.ANGRY: return Emojis.angry;
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
      commentController.dislike();
      setLike(CommmentLike.NONE);
      setLikesCount(likesCount - 1);
    } else {
      commentController.like(like);
      setLike(like);
      if (liked === null) setLikesCount(likesCount + 1);
    }
  }

  const onCommentDelete = async () => {
    await onDelete() && setDeleted(true);
  }

  return (
    <>
      {
        !isDeleted &&
        <div className='post-comment-message'>
          <div className="post-comment-message-header">
            <img className='post-comment-message-user-pic' src={Avatar.get(comment.user.gender, comment.user.photo)} alt="profile_pic" />
            <div className='post-comment-message-sender-name'>
              <span>{comment.user.name}</span>
              <span>{comment.commented_on}</span>
            </div>
            <div className="post-comment-options">
              <IconButton icon={Icons.moreHorizontal} label='comment_options' showBorder={false} />
              <div className="post-comment-options-dropdown">
                {
                  isSameUser && <DropdownItem label='Delete' onClick={onCommentDelete}/>
                }
                <DropdownItem label='Report' />
              </div>
            </div>
          </div>
          <div className='post-comment-message-content'>
            {comment.text}
          </div>
          <div className='post-comment-message-footer'>
            <span>{getLikeCount()}</span>
            <IconButton icon={getLikedEmoji()} label='comment_like' showBorder={false} applyIconTheme={liked === CommmentLike.NONE}/>
            <div className="post-comment-like-emoji">
              <IconButton icon={Emojis.like} applyIconTheme={false} showBorder={liked === CommmentLike.LIKE} label='like' onClick={() => onLike(CommmentLike.LIKE)} />
              <IconButton icon={Emojis.love} applyIconTheme={false} showBorder={liked === CommmentLike.LOVE} label='love' onClick={() => onLike(CommmentLike.LOVE)} />
              <IconButton icon={Emojis.yay} applyIconTheme={false} showBorder={liked === CommmentLike.YAY} label='yay' onClick={() => onLike(CommmentLike.YAY)} />
              <IconButton icon={Emojis.wow} applyIconTheme={false} showBorder={liked === CommmentLike.WOW} label='wow' onClick={() => onLike(CommmentLike.WOW)} />
              <IconButton icon={Emojis.haha} applyIconTheme={false} showBorder={liked === CommmentLike.HAHA} label='haha' onClick={() => onLike(CommmentLike.HAHA)} />
              <IconButton icon={Emojis.sad} applyIconTheme={false} showBorder={liked === CommmentLike.SAD} label='sad' onClick={() => onLike(CommmentLike.SAD)} />
              <IconButton icon={Emojis.angry} applyIconTheme={false} showBorder={liked === CommmentLike.ANGRY} label='angry' onClick={() => onLike(CommmentLike.ANGRY)} />
            </div>
          </div>
        </div>
      }
    </>
  )
}
