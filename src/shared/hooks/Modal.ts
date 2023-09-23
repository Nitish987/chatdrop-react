import { useState } from "react";

interface IModalController {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

interface IModalInitial {
    openInitial?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
}

/**
 * Modal state hook for opening and closing Modal.
 */

function useModal({ openInitial = false, onOpen, onClose }: IModalInitial): [IModalController] { 
    const [isModalOpen, showModal] = useState(openInitial);
    
    const controller: IModalController = {
        isModalOpen: isModalOpen,
        openModal: () => {
            document.querySelector('nav')!.style.zIndex = '1';
            showModal(true);
            if (onOpen !== undefined) onOpen();
        },
        closeModal: () => {
            document.querySelector('nav')!.style.zIndex = 'var(--nav-z-index)';
            showModal(false);
            if (onClose !== undefined) onClose();
        },
    }

    return [controller];
}

export default useModal;
export type { IModalController };