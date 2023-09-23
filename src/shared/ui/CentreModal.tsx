import React, { PropsWithChildren, useEffect, useRef } from 'react';
import Icons from '../../settings/constants/icons';
import Logo from '../../settings/constants/logo';
import { IModalController } from '../hooks/Modal';
import PrimaryTextButton from './PrimaryTextButton';
import IconButton from './IconButton';

interface ModalProps {
  title: string;
  onSave?: () => void;
  onScrollEnd?: () => void;
  controller: IModalController;
}

/**
 * Center Modal a center screen dialog.
 */
export default function CentreModal({ title, onSave, onScrollEnd, controller, children }: PropsWithChildren<ModalProps>) {
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (body.current) {
      body.current.onscroll = e => {
        if (body.current!.scrollTop > body.current!.clientHeight - 50) {
          if (onScrollEnd) {
            onScrollEnd();
          }
        }
      }
    }
  });

  return (
    <>
      {
        controller.isModalOpen &&
        <div className="centre-modal">
          <div className='centre-modal-container'>
            <div className="centre-modal-topbar">
              <div className="centre-modal-topbar-container">
                <div className="centre-modal-topbar-logo">
                  <img src={Logo.chatdrop} alt="chatdrop" />
                  <span className='sub-heading-theme'>{title}</span>
                </div>
                <div className="centre-modal-topbar-tabs">
                  {
                    onSave !== undefined && <PrimaryTextButton label='Save' onClick={onSave} />
                  }
                  <IconButton icon={Icons.close} label='close' onClick={controller.closeModal} />
                </div>
              </div>
            </div>
            <div className="centre-modal-body" ref={body}>
              {children}
            </div>
          </div>
        </div>
      }
    </>
  )
}
