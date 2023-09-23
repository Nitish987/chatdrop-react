import React, { PropsWithChildren, useCallback, useState } from 'react';
import { IModalController } from '../hooks/Modal';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';
import Modal from './Modal';

interface ModalProps {
  title: string;
  image: string;
  aspectRatio: number;
  onSave: (data: {localUrl: string, blob: Blob} | null) => void;
  controller: IModalController;
}

const createImage = (url: string) => new Promise<HTMLImageElement>((resolve, reject) => {
  const image = new Image();
  image.addEventListener('load', () => resolve(image));
  image.addEventListener('error', (error) => reject(error));
  image.src = url;
});

const getRadianAngle = (degreeValue: number): number => (degreeValue * Math.PI) / 180;

const rotateSize = (width: number, height: number, rotation: number) => {
  const rotRad = getRadianAngle(rotation)
  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

const getCroppedImg = async (imageSrc: string, pixelCrop: Area, rotation = 0, flip = { horizontal: false, vertical: false }) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(data, 0, 0);

  return new Promise<{localUrl: string, blob: Blob}>((resolve, reject) => {
    canvas.toBlob((blob: any) => {
      resolve({ localUrl: URL.createObjectURL(blob), blob: blob });
    }, 'image/jpeg');
  });
}

/**
 * Image Crop Center Modal a center screen dialog for cropping image.
 */
export default function ImageCropModal({ title, onSave, controller, image, aspectRatio, children }: PropsWithChildren<ModalProps>) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({ width: 0, height: 0, x: 0, y: 0 });

  const containerStyle = {
    top: '50px',
  }

  const cropAreaStyle = {
    color: 'transparent',
  }

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const save = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
      onSave(croppedImage);
    } catch (e) {
      onSave(null);
    }
  }

  return (
    <Modal title={title} controller={controller} onSave={save}>
      {
        image &&
        <Cropper image={image} crop={crop} rotation={rotation} zoom={zoom} aspect={aspectRatio} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} onRotationChange={setRotation} style={{ containerStyle: containerStyle, cropAreaStyle: cropAreaStyle }} />
      }
      {children}
    </Modal>
  )
}
