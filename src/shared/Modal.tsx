import  { ReactNode } from 'react';

type TProps={
    isOpen:any,
    onClose:any,
    children:ReactNode
}
const Modal = ({ isOpen, onClose, children }:TProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-[35rem] h-[35rem] " onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;