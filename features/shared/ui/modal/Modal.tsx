import { Modal as RNModal, ModalProps } from "react-native";
import React from "react";
import { Toaster } from "sonner-native";

type TProps = ModalProps & {
  isOpen: boolean;
  withInput?: boolean;
  isTransparent?: boolean;
};

const Modal = (props: TProps) => {
  ////vars
  const { isOpen, withInput, children, isTransparent = true, ...rest } = props;

  ////tsx
  return (
    <RNModal
      visible={isOpen}
      transparent={isTransparent}
      animationType="slide"
      statusBarTranslucent
      className={isTransparent ? "" : "bg-background"}
      {...rest}
    >
      {children}
      <Toaster position="bottom-center" />
    </RNModal>
  );
};

export default Modal;
