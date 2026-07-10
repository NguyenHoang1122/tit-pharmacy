import React from 'react';
import './Toast.css';

function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div className={`toast ${type}`}>
      <div className="toast-content">
        <span className="toast-icon">
          {type === 'success' ? '✓' : '⚠'}
        </span>
        <p className="toast-message">{message}</p>
      </div>
    </div>
  );
}

export default Toast;
