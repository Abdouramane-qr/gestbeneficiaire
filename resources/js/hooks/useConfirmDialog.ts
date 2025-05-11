// resources/js/hooks/useConfirmDialog.ts
import { useState } from 'react';
import { router } from '@inertiajs/react';

export type ConfirmActionType = {
  url: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  data?: Record<string, any>;
  onSuccess?: () => void;
  onError?: (error: any) => void;
};

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('Confirmer l\'action');
  const [message, setMessage] = useState('Êtes-vous sûr de vouloir effectuer cette action ?');
  const [confirmLabel, setConfirmLabel] = useState('Confirmer');
  const [cancelLabel, setCancelLabel] = useState('Annuler');
  const [isDestructive, setIsDestructive] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmActionType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const openConfirmDialog = ({
    title: dialogTitle = 'Confirmer l\'action',
    message: dialogMessage = 'Êtes-vous sûr de vouloir effectuer cette action ?',
    confirmLabel: dialogConfirmLabel = 'Confirmer',
    cancelLabel: dialogCancelLabel = 'Annuler',
    isDestructive: dialogIsDestructive = false,
    action,
  }: {
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
    action: ConfirmActionType;
  }) => {
    setTitle(dialogTitle);
    setMessage(dialogMessage);
    setConfirmLabel(dialogConfirmLabel);
    setCancelLabel(dialogCancelLabel);
    setIsDestructive(dialogIsDestructive);
    setConfirmAction(action);
    setIsOpen(true);
  };

  const closeConfirmDialog = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    if (!confirmAction) return;

    setIsProcessing(true);

    router[confirmAction.method](confirmAction.url, confirmAction.data || {}, {
      onSuccess: () => {
        closeConfirmDialog();
        if (confirmAction.onSuccess) {
          confirmAction.onSuccess();
        }
        setIsProcessing(false);
      },
      onError: (errors) => {
        if (confirmAction.onError) {
          confirmAction.onError(errors);
        }
        setIsProcessing(false);
      },
      onFinish: () => {
        setIsProcessing(false);
      },
    });
  };

  // Fonctions d'aide pour les cas d'utilisation courants
  const confirmDelete = (url: string, onSuccess?: () => void) => {
    openConfirmDialog({
      title: 'Confirmer la suppression',
      message: 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.',
      confirmLabel: 'Supprimer',
      isDestructive: true,
      action: {
        url,
        method: 'delete',
        onSuccess,
      },
    });
  };

  return {
    isOpen,
    title,
    message,
    confirmLabel,
    cancelLabel,
    isDestructive,
    isProcessing,
    openConfirmDialog,
    closeConfirmDialog,
    handleConfirm,
    confirmDelete,
  };
}
