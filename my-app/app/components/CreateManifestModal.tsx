'use client';

import { useState } from 'react';

interface Label {
  id: number;
  name: string;
  colorRgb: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
  labels?: Label[];
}

export function CreateManifestModal({
  isOpen,
  onClose,
  onCreate,
  labels = [],
}: Props) {
  const [form, setForm] = useState({
    protocolo: '',
    processoSei: '',
    status: 'aguardando',
    dataManifestacao: '',
    idEtiqueta: '',
  });

  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      alert('Selecione um arquivo PDF');
      return;
    }

    onCreate({
      ...form,
      idEtiqueta: Number(form.idEtiqueta),
      file, // 👈 devolve o arquivo
    });
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-[#2e2e2e] rounded-2xl p-6 w-[420px]">
        <h2 className="text-lg font-semibold mb-4">
          Nova Manifestação
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <select
            name="idEtiqueta"
            value={form.idEtiqueta}
            onChange={handleChange}
            className="p-2 rounded-xl border bg-white text-black dark:bg-[#1F1F1F] dark:text-white"
            required
          >
            <option value="">Selecione uma etiqueta</option>
            {labels.map((label) => (
              <option key={label.id} value={label.id}>
                {label.name}
              </option>
            ))}
          </select>

          <input
            name="protocolo"
            placeholder="Protocolo"
            onChange={handleChange}
            className="p-2 rounded-xl border"
            required
          />

          <input
            name="dataManifestacao"
            type="date"
            onChange={handleChange}
            className="p-2 rounded-xl border"
            required
          />

          <input
            name="processoSei"
            placeholder="Link do Processo SEI"
            onChange={handleChange}
            className="p-2 rounded-xl border"
            required
          />

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setFile(e.target.files[0]);
              }
            }}
            className="p-2 rounded-xl border"
            required
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#86A1FB] text-white"
            >
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
