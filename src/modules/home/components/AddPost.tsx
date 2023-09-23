import React, { useRef, useState } from 'react'
import IconTextButton from '../../../shared/ui/IconTextButton'
import Icons from '../../../settings/constants/icons'
import '../styles/AddPost.css'
import { useAppSelector } from '../../../redux/hooks'
import Avatar from '../../../shared/utils/avatar'
import Divider from '../../../shared/ui/Divider'
import AddPostController, { FilePicked, PostVisibility } from '../controllers/AddPostController'
import useModal from '../../../shared/hooks/Modal'
import CentreModal from '../../../shared/ui/CentreModal'
import { readFileAsDataUrl } from '../../../infra/utils'
import IconButton from '../../../shared/ui/IconButton'
import { useDispatch } from 'react-redux'
import { showAlert } from '../../../features/alert/alertSlice'
import PostModel from '../../../models/post'
import { addNewPostedTimelineFeed } from '../../../features/timeline/timelineSlice'

export default function AddPost() {
  const addPostController = AddPostController.getInstance();
  const dispatch = useDispatch();
  const photoInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const profile = useAppSelector(state => state.content.profile);
  const [text, setText] = useState('');
  const [textRow, setTextRow] = useState(1);
  const [photos, setPhotos] = useState<FilePicked[]>([]);
  const [video, setVideo] = useState<FilePicked>();
  const [visibility, setVisibiltiy] = useState(PostVisibility.PUBLIC);
  const [isLink, setIsLink] = useState(false);
  const [controller] = useModal({
    onClose: () => {
      setText('');
      setTextRow(1);
      setPhotos([]);
      setVideo(undefined);
      setIsLink(false);
    }
  });

  const onPhotoClick = () => photoInput.current?.click();
  const onVideoClick = () => videoInput.current?.click();
  const onLinkClick = () => {
    setIsLink(true);
    controller.openModal();
  }

  const onVisibilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVisibiltiy(e.target.value);
  }

  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextRow(e.target.value.split('\n').length);
    setText(e.target.value);
  }

  const onPhotoPicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;

    const photoList: FilePicked[] = [];
    for (let i = 0; i < e.target.files.length; i++) photoList.push({
      file: e.target.files[i],
      data: await readFileAsDataUrl(e.target.files[i]),
    });
    setPhotos(photoList);
    controller.openModal();
  }

  const onPhotoRemove = (indexToRemove: number) => {
    setPhotos(photos.filter((photo, index) => {
      return index !== indexToRemove;
    }));
  }

  const onVideoPicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;

    setVideo({
      file: e.target.files[0],
      data: await readFileAsDataUrl(e.target.files[0]),
    });
    controller.openModal();
  }

  const onVideoRemove = () => {
    setVideo(undefined);
  }

  const onPost = async () => {
    const addPost = addPostController.add();
    const isText = text !== '';
    const isPhoto = photos.length > 0;
    const isVideo = video !== undefined;

    const hashtags = AddPostController.extractHashTags(text);
    
    let post: PostModel | null = null;

    if (isText && isPhoto) {
      const [photoList, photoAspectRatios] = AddPostController.createUploadablePhotos(photos);
      post = await addPost.textWithPhoto(visibility, hashtags, text, photoList, photoAspectRatios);
    } else if (isText && isVideo) {
      const [videoo, videoAspectRatio, thumbnail] = await AddPostController.createUploadableVideo(video);
      if (thumbnail) {
        post = await addPost.textWithVideo(visibility, hashtags, text, videoo, videoAspectRatio, thumbnail);
      }
    } else if (isPhoto) {
      const [photoList, photoAspectRatios] = AddPostController.createUploadablePhotos(photos);
      post = await addPost.photo(visibility, hashtags, photoList, photoAspectRatios);
    } else if (isVideo) {
      const [videoo, videoAspectRatio, thumbnail] = await AddPostController.createUploadableVideo(video);
      if (thumbnail) {
        post = await addPost.video(visibility, hashtags, videoo, videoAspectRatio, thumbnail);
      }
    } else if (isText) {
      post = await addPost.text(visibility, hashtags, text);
    }

    if (post) {
      dispatch(addNewPostedTimelineFeed(post));
      dispatch(showAlert({
        message: 'Posted Successfully.',
        type: 'info',
      }));
      controller.closeModal();
    } else {
      dispatch(showAlert({
        message: 'Unable to post.',
        type: 'info',
      }));
    }
  }

  return (
    <>
      <div className='add-post'>
        <div className='add-post-header'>
          <img src={Avatar.get(profile?.profile.gender!, profile?.profile.photo!)} alt='profile_pic' />
          <div className='add-post-headline' onClick={controller.openModal}>
            what's on your mind...
          </div>
        </div>
        <Divider sizeDistance={20} />
        <div className='add-post-footer'>
          <input type='file' ref={photoInput} style={{ display: 'none' }} accept='image/*' multiple={true} onChange={onPhotoPicked} />
          <input type='file' ref={videoInput} style={{ display: 'none' }} accept='video/*' onChange={onVideoPicked} />
          <IconTextButton icon={Icons.addPhoto} label='Photo' onClick={onPhotoClick} />
          <IconTextButton icon={Icons.addVideo} label='Video' onClick={onVideoClick} />
          <IconTextButton icon={Icons.addlink} label='Link' onClick={onLinkClick} />
        </div>
      </div>
      <CentreModal title='Add Post' controller={controller} onSave={onPost}>
        <div className="add-post-view">
          <div>
            <select className='input-text' name="visibility" onChange={onVisibilityChange}>
              <option value={PostVisibility.PUBLIC}>Public</option>
              <option value={PostVisibility.ONLY_FRIENDS}>Only Friends</option>
              <option value={PostVisibility.PRIVATE}>Private</option>
            </select>
          </div>
          <div className="add-post-text">
            {
              isLink && <span className='instruction'>Link Preview will be shown when you post a link.</span>
            }
            <textarea className="input-text add-post-text-input" placeholder="What's on your mind..." rows={textRow} value={text} onChange={onTextChange}></textarea>
          </div>
          <div className="add-post-photos">
            {
              photos.length > 0 &&
              photos.map((pickedFile, index) => {
                return (
                  <div key={`picked_${index}`} className="add-post-picked-photo">
                    <img src={pickedFile.data} alt="post_photo" />
                    <IconButton className='add-post-picked-photo-remove' icon={Icons.close} label='remove' onClick={() => onPhotoRemove(index)} />
                  </div>
                );
              })
            }
          </div>
          <div className="add-post-video">
            {
              video &&
              <div className="add-post-picked-video">
                <video className='add-post-picked-video' src={video.data}></video>
                <IconButton className='add-post-picked-video-remove' icon={Icons.close} label='remove' onClick={onVideoRemove} />
              </div>
            }
          </div>
        </div>
        {
          (photos.length === 0 && video === undefined && !isLink) &&
          <div className="add-post-view-btns">
            <IconButton icon={Icons.addPhoto} label='Photo' onClick={onPhotoClick} />
            <IconButton icon={Icons.addVideo} label='Video' onClick={onVideoClick} />
          </div>
        }
      </CentreModal>
    </>
  )
}
