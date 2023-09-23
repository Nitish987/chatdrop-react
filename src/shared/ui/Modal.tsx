import React, { PropsWithChildren } from 'react';
import Icons from '../../settings/constants/icons';
import Logo from '../../settings/constants/logo';
import { IModalController } from '../hooks/Modal';
import PrimaryTextButton from './PrimaryTextButton';
import IconTextButton from './IconTextButton';
import IconButton from './IconButton';

interface ModalProps {
  title: string;
  onSave?: () => void;
  controller: IModalController;
}

/**
 * Modal a full screen dialog.
 */
export default function Modal({ title, onSave, controller, children }: PropsWithChildren<ModalProps>) {
  return (
    <>
      {
        controller.isModalOpen &&
        <div className='modal'>
          <div className="modal-topbar">
            <div className="modal-topbar-container">
              <div className="modal-topbar-logo">
                <img src={Logo.chatdrop} alt="chatdrop" />
                <span className='sub-heading-theme'>{title}</span>
              </div>
              <div className="modal-topbar-tabs">
                {
                  onSave !== undefined && <PrimaryTextButton className='modal-save-btn' label='Save' onClick={onSave}/>
                }
                {
                  <IconTextButton className='modal-close-btn' icon={Icons.close} label='close' onClick={controller.closeModal}/>
                }
                {
                  <IconButton className='modal-close-btn-mobile' icon={Icons.close} label='close' onClick={controller.closeModal}/>
                }
              </div>
            </div>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      }
    </>
  )
}
