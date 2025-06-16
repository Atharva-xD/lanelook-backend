import React, { createContext, useContext, useState } from 'react';
import Popup from '../components/common/Popup';

const PopupContext = createContext();

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

export const PopupProvider = ({ children }) => {
  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    showCancel: false,
    autoClose: false,
    autoCloseTime: 3000
  });

  const showPopup = ({
    type = 'success',
    title,
    message,
    onConfirm = null,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    showCancel = false,
    autoClose = false,
    autoCloseTime = 3000
  }) => {
    setPopup({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
      confirmText,
      cancelText,
      showCancel,
      autoClose,
      autoCloseTime
    });
  };

  const hidePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  const showSuccess = (message, title = 'Success') => {
    showPopup({
      type: 'success',
      title,
      message,
      autoClose: true
    });
  };

  const showError = (message, title = 'Error') => {
    showPopup({
      type: 'error',
      title,
      message
    });
  };

  const showWarning = (message, title = 'Warning') => {
    showPopup({
      type: 'warning',
      title,
      message
    });
  };

  const showConfirm = ({
    message,
    title = 'Confirm',
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  }) => {
    showPopup({
      type: 'warning',
      title,
      message,
      onConfirm,
      confirmText,
      cancelText,
      showCancel: true
    });
  };

  return (
    <PopupContext.Provider
      value={{
        showPopup,
        hidePopup,
        showSuccess,
        showError,
        showWarning,
        showConfirm
      }}
    >
      {children}
      <Popup
        isOpen={popup.isOpen}
        onClose={hidePopup}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onConfirm={popup.onConfirm}
        confirmText={popup.confirmText}
        cancelText={popup.cancelText}
        showCancel={popup.showCancel}
        autoClose={popup.autoClose}
        autoCloseTime={popup.autoCloseTime}
      />
    </PopupContext.Provider>
  );
}; 