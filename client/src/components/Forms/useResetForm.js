import { useRef, useEffect } from "react";
// reset form fields when modal is form, closed
const useResetFormOnCloseModal = ({ form, visible }) => {
  const prevVisibleRef = useRef();
  useEffect(() => {
    prevVisibleRef.current = visible;
  }, [visible]); // eslint-disable-next-line
  const prevVisible = prevVisibleRef.current;
  useEffect(() => {
    if (!visible && prevVisible) { // eslint-disable-next-line 
      form.resetFields(); // eslint-disable-next-line
    }
  }, [visible]); // eslint-disable-next-line
};

export default useResetFormOnCloseModal;
