// commons/components/modal/Modal.jsx

import type { AlertsModalProps } from "./utils/types";

import "./AlertsModal.css";

export default function AlertsModal({ isOpen, title, message, onClose }: AlertsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
  <div className="modal-container">

    <div className="modal-scanline"></div>

    <h2>&gt; {title}</h2>

    <p>{message}</p>

    <button onClick={onClose}>
      ACEPTAR
    </button>

  </div>
</div>

    
  );
}