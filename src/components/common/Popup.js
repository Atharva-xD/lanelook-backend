import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Popup.css';

const Popup = ({ 
  isOpen, 
  onClose, 
  type = 'success', 
  title, 
  message, 
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showCancel = false,
  autoClose = false,
  autoCloseTime = 3000
}) => {
  useEffect(() => {
    if (autoClose && isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseTime, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="popup-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`popup-content ${type}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="popup-header">
            <h3 className={`popup-title ${type}`}>{title}</h3>
          </div>
          
          <div className="popup-message">
            {message}
          </div>

          <div className="popup-actions">
            {showCancel && (
              <button 
                className="popup-button cancel"
                onClick={onClose}
              >
                {cancelText}
              </button>
            )}
            <button 
              className={`popup-button ${type}`}
              onClick={() => {
                if (onConfirm) {
                  onConfirm();
                }
                onClose();
              }}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Popup; 