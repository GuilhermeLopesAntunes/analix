'use client';

import { useState, useEffect } from 'react';
import { listLabels } from '@/app/services/label.service';

interface Label {
  id: number;
  name: string;
  colorRgb: string;
}

interface Manifestacao {
  id: number;
  protocolo: string;
  processoSei: string;
  status: string;
  dataManifestacao: string;
  desc?: string;
  label?: Label;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (data: any) => void;
  manifest: Manifestacao | null;
}

export function EditManifestModal({
  isOpen,
  onClose,
  onEdit,
  manifest,
}: Props) {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    protocolo: '',
    processoSei: '',
    status: 'aguardando',
    dataManifestacao: '',
    desc: '',
  });

  const [file, setFile] = useState<File | null>(null);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && manifest) {
      loadLabels();

      setForm({
        protocolo: manifest.protocolo,
        processoSei: manifest.processoSei,
        status: manifest.status,
        dataManifestacao: manifest.dataManifestacao.split('T')[0],
        desc: manifest.desc || '',
        
      });

      setFile(null);
      setFormErrors({});
    }
  }, [isOpen, manifest]);

  async function loadLabels() {
    try {
      setLoading(true);

      const data = await listLabels();

      setLabels(Array.isArray(data) ? data : []);
    } catch {
      console.error('Erro ao carregar etiquetas');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen || !manifest) return null;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (formErrors[e.target.name]) {
      setFormErrors(prev => ({
        ...prev,
        [e.target.name]: '',
      }));
    }
  }

  function validateForm() {
    const errors: Record<string, string> = {};
    if (!form.protocolo.trim()) errors.protocolo = 'Obrigatório';
    if (!form.processoSei.trim()) errors.processoSei = 'Obrigatório';
    if (!form.dataManifestacao) errors.dataManifestacao = 'Obrigatório';
    if (!form.desc.trim()) errors.desc = 'Obrigatório';

    return errors;
  }

  function handleSubmit(e: React.FormEvent) {
    console.log(manifest?.id)
    e.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onEdit({
      id: manifest?.id,
      ...form,
      idEtiqueta: Number(form.idEtiqueta),
      file,
    });
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-[#2e2e2e] rounded-2xl p-6 w-[420px] max-h-[90vh] overflow-y-auto">

        <h2 className="text-lg font-semibold mb-4">
          Editar Manifestação
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <div>
            <label className="block text-sm mb-1">
              Protocolo *
            </label>

            <input
              name="protocolo"
              value={form.protocolo}
              onChange={handleChange}
              className="w-full p-2 rounded-xl border"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Data *
            </label>

            <input
              type="date"
              name="dataManifestacao"
              value={form.dataManifestacao}
              onChange={handleChange}
              className="w-full p-2 rounded-xl border"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Processo SEI *
            </label>

            <input
              name="processoSei"
              value={form.processoSei}
              onChange={handleChange}
              className="w-full p-2 rounded-xl border"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Descrição *
            </label>

            <input
              name="desc"
              value={form.desc}
              onChange={handleChange}
              className="w-full p-2 rounded-xl border"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Novo PDF (opcional)
            </label>

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFile(e.target.files[0]);
                }
              }}
              className="w-full p-2 rounded-xl border"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t">

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
              Salvar
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}
