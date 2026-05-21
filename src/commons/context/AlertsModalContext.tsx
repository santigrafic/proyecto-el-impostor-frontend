import { createContext, useContext, useState } from "react";
import type { ModalContextType, ModalState, Props } from "./utils/types";
import Modal from "../components/alertsModal/AlertsModal";

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: Props) {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: "",
    message: "",
  });

  const showAlertsModal = (title: string, message: string) => {
    setModal({
      isOpen: true,
      title,
      message,
    });
  };

  const hideAlertsModal = () => {
    setModal({
      isOpen: false,
      title: "",
      message: "",
    });
  };

  return (
    <ModalContext.Provider value={{ showAlertsModal, hideAlertsModal }}>
      {children}

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onClose={hideAlertsModal}
      />
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal debe usarse dentro de ModalProvider");
  }

  return context;
};