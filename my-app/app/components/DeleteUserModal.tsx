'use client';

export default function DeleteUserModal({
  isOpen,
  user,
  onClose,
  onConfirm,
}: any) {

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white dark:bg-[#222] p-6 rounded-2xl w-[400px]">

        <h2 className="text-xl mb-4 text-red-500">
          Excluir Usuário
        </h2>

        <p>
          Deseja excluir <b>{user.name}</b>?
        </p>

        <div className="flex justify-end gap-4 mt-6">

          <button onClick={onClose}>
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="bg-red-500 px-4 py-2 text-white rounded-xl"
          >
            Excluir
          </button>

        </div>

      </div>
    </div>
  );
}
