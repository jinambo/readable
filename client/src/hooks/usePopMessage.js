import { useState, useEffect } from 'react';

const usePopMessage = (timeout = 3000) => {
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (popup.message) {
      setPopup({ show: true, message: popup.message, type: popup.type });
      setTimeout(() => {
        setPopup({ show: false, message: "", type: "" });
      }, timeout);
    }
  }, [popup.message]);

  const show = (msg, type) => {
    setPopup({ show: true, message: msg, type });
  }

  return [popup, show];
}

export default usePopMessage;
