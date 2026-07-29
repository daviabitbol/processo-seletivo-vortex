import React from 'react';
import './SaveButton.css';

type SaveButtonProps = {
  loading?: boolean;
  label?: string;
  loadingLabel?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export const SaveButton = ({
  loading = false,
  label = 'Salvar Alterações',
  loadingLabel = 'Salvando...',
  onClick,
  className = '',
}: SaveButtonProps) => {
  const combinedClassName = `save-button ${className}`.trim();

  return (
    <button
      type="submit"
      disabled={loading}
      onClick={onClick}
      className={combinedClassName}
    >
      {loading ? loadingLabel : label}
    </button>
  );
};