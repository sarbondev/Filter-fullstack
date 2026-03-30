import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
  variant?: 'danger' | 'primary';
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, loading, variant = 'danger', confirmText, cancelText }: ConfirmDialogProps) {
  const { t } = useTranslation();
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="rounded-full bg-red-100 p-3">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <p className="text-center text-sm text-slate-600">{message}</p>
      </div>
      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
        <Button variant="secondary" onClick={onClose} disabled={loading}>{cancelText ?? t('common.cancel')}</Button>
        <Button variant={variant} onClick={onConfirm} loading={loading}>{confirmText ?? t('common.confirm')}</Button>
      </div>
    </Modal>
  );
}
