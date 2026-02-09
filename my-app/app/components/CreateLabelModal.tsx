'use client';

import { useState } from 'react';

interface CreateLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    name: string;
    colorRgb: string;
  }) => void;
}

export function CreateLabelModal({
  isOpen,
  onClose,
  onCreate,
}: CreateLabelModalProps) {
  const [name, setName] = useState('');
  const [colorRgb, setColorRgb] = useState('#000000');

  if (!isOpen) return null;

  async function handleSubmit() {
    if (!name) {
      alert('Nome obrigatório');
      return;
    }

    onCreate({
      name,
      colorRgb,
    });

    setName('');
    setColorRgb('#000000');
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#2E2E2E] p-8 rounded-3xl w-[400px]">
        <h2 className="text-xl font-semibold mb-6">Criar Etiqueta</h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome da etiqueta"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded-xl border dark:bg-[#1F1F1F]"
          />

          <div className="flex items-center gap-4">
            <label>Cor:</label>
            <input
              type="color"
              value={colorRgb}
              onChange={(e) => setColorRgb(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8 ">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border cursor-pointer"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-xl bg-[#86A1FB] text-white cursor-pointer"
          >
            Criar
          </button>
        </div>
      </div>
    </div>
  );
}
