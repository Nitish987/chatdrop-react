import React, { useEffect, useState } from 'react';
import '../styles/LinkPreview.css';
import LinkPreview from '../../models/linkpreview';
import LinkPreviewController from '../controllers/LinkPreviewController';

interface Props {
  url: string;
}

export default function LinkPreviewCard({ url }: Props) {
  const controller = LinkPreviewController.getInstance(url);
  const [preview, setPreview] = useState<LinkPreview | null>(null);

  useEffect(() => {
    if (preview === null) {
      controller.linkPreview().then(setPreview);
    }
  }, [preview, controller, setPreview]);

  return (
    <div className='link-preview'>
      {

        preview &&
        <>
          <img className='link-preview-image' src={preview.image} alt='preview_image' />
          <div className='link-preview-content'>
            <span className='sub-heading-theme'>{preview.title}</span>
            <span>{preview.description}</span>
            <a href={preview.url} target='_blank' rel='noreferrer'>Visit Site</a>
          </div>
        </>
      }
    </div>
  )
}
