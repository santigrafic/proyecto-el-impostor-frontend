import type { ReactNode } from "react";

export type ModalContextType = {
  showAlertsModal: (title: string, message: string) => void;
  hideAlertsModal: () => void;
};

export type ModalState = {
  isOpen: boolean;
  title: string;
  message: string;
};

export type Props = {
  children: ReactNode;
};