import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { ClipboardListIcon, CheckCircleIcon } from '../icons';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;
  tempPassword: string;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ isOpen, onClose, employeeName, tempPassword }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Reset copied state when modal is reopened for a new user
    if (isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(tempPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Redefinir Senha para ${employeeName}`}>
      <div className="space-y-4 pt-2">
        <p className="text-sm text-gray-600">
          A senha do usuário foi redefinida. Copie a senha temporária abaixo e a forneça ao funcionário de forma segura.
        </p>
        <div className="flex items-center justify-between p-3 bg-gray-100 border border-gray-200 rounded-lg">
          <span className="font-mono text-lg font-semibold tracking-wider text-gray-800">{tempPassword}</span>
          <button
            onClick={handleCopy}
            className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-brand-blue text-white hover:bg-brand-dark-blue'
            }`}
          >
            {copied ? (
              <CheckCircleIcon className="w-4 h-4 mr-1.5" />
            ) : (
              <ClipboardListIcon className="w-4 h-4 mr-1.5" />
            )}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PasswordResetModal;