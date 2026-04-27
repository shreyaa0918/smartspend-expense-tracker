import React from "react";

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Yes", cancelText = "Cancel" }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            {cancelText}
          </button>
          <button type="button" className="btn btn--danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
