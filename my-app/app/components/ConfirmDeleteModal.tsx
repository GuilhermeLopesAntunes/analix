'use client';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-[#2e2e2e] rounded-2xl p-6 w-[360px] shadow-lg">
        <h2 className="text-lg font-semibold mb-3">
          Confirmar exclusão
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Tem certeza que deseja excluir esta manifestação?
          Essa ação não pode ser desfeita.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="cursor-pointer px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-600"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="cursor-pointer px-4 py-2 rounded-xl bg-red-600 text-white"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
