'use client';

import { useState, useEffect } from 'react';
import { listLabels } from '@/app/services/label.service';

interface Label {
  id: number;
  name: string;
  colorRgb: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
}

export function CreateManifestModal({
  isOpen,
  onClose,
  onCreate,
}: Props) {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    protocolo: '',
    processoSei: '',
    status: 'aguardando',
    dataManifestacao: '',
    desc: '',
    idEtiqueta: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      loadLabels();
      setForm({
        protocolo: '',
        processoSei: '',
        status: 'aguardando',
        dataManifestacao: '',
        desc: '',
        idEtiqueta: '',
      });
      setFile(null);
      setFormErrors({});
    }
  }, [isOpen]);

  async function loadLabels() {
    try {
      setLoading(true);
      const data = await listLabels();
      setLabels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar etiquetas:', error);
      setFormErrors(prev => ({
        ...prev,
        idEtiqueta: 'Erro ao carregar etiquetas'
      }));
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

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
        [e.target.name]: ''
      }));
    }
  }

  function validateForm() {
    const errors: Record<string, string> = {};
    
    if (!form.idEtiqueta) {
      errors.idEtiqueta = 'Selecione uma etiqueta';
    }
    
    if (!form.protocolo.trim()) {
      errors.protocolo = 'Protocolo é obrigatório';
    }
    
    if (!form.processoSei.trim()) {
      errors.processoSei = 'Processo SEI é obrigatório';
    }
    
    if (!form.dataManifestacao) {
      errors.dataManifestacao = 'Data da manifestação é obrigatória';
    }
    
    if (!form.desc.trim()) {
      errors.desc = 'Descrição é obrigatória';
    }
    
    if (!file) {
      errors.file = 'Arquivo PDF é obrigatório';
    }
    
    return errors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const dataToSend = {
      ...form,
      idEtiqueta: Number(form.idEtiqueta), 
      file,
    };

    console.log('Dados a serem enviados:', dataToSend);
    
    onCreate(dataToSend);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-[#2e2e2e] rounded-2xl p-6 w-[420px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">
          Nova Manifestação
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <div>
            <label className="block text-sm mb-1">
              Etiqueta <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="idEtiqueta"
                value={form.idEtiqueta}
                onChange={handleChange}
                className={`w-full p-2 rounded-xl border ${
                  formErrors.idEtiqueta ? 'border-red-500' : ''
                } bg-white text-black dark:bg-[#1F1F1F] dark:text-white appearance-none`}
                disabled={loading}
                required
              >
                <option value="">Selecione uma etiqueta</option>
                {labels.map((label) => (
                  <option key={label.id} value={label.id}>
                    {label.name}
                  </option>
                ))}
              </select>
              {loading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
              )}
              </div>
              {formErrors.idEtiqueta && (
                <p className="text-red-500 text-sm mt-1">{formErrors.idEtiqueta}</p>
              )}
          </div>
          <div>
            <label className="block text-sm mb-1">
              Protocolo <span className="text-red-500">*</span>
            </label>
            <input
              name="protocolo"
              placeholder="Digite o protocolo"
              value={form.protocolo}
              onChange={handleChange}
              className={`w-full p-2 rounded-xl border ${
                formErrors.protocolo ? 'border-red-500' : ''
              }`}
              required
            />
            {formErrors.protocolo && (
              <p className="text-red-500 text-sm mt-1">{formErrors.protocolo}</p>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">
              Data da Manifestação <span className="text-red-500">*</span>
            </label>
            <input
              name="dataManifestacao"
              type="date"
              value={form.dataManifestacao}
              onChange={handleChange}
              className={`w-full p-2 rounded-xl border ${
                formErrors.dataManifestacao ? 'border-red-500' : ''
              }`}
              required
            />
            {formErrors.dataManifestacao && (
              <p className="text-red-500 text-sm mt-1">{formErrors.dataManifestacao}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">
              Link do Processo SEI <span className="text-red-500">*</span>
            </label>
            <input
              name="processoSei"
              placeholder="https://..."
              value={form.processoSei}
              onChange={handleChange}
              className={`w-full p-2 rounded-xl border ${
                formErrors.processoSei ? 'border-red-500' : ''
              }`}
              required
            />
            {formErrors.processoSei && (
              <p className="text-red-500 text-sm mt-1">{formErrors.processoSei}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm mb-1">
              Descrição <span className="text-red-500">*</span>
            </label>
            <input
              name="desc"
              placeholder="Digite a descrição"
              value={form.desc}
              onChange={handleChange}
              className={`w-full p-2 rounded-xl border ${
                formErrors.desc ? 'border-red-500' : ''
              }`}
              required
            />
            {formErrors.desc && (
              <p className="text-red-500 text-sm mt-1">{formErrors.desc}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">
              Arquivo PDF <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFile(e.target.files[0]);
                  if (formErrors.file) {
                    setFormErrors(prev => ({ ...prev, file: '' }));
                  }
                }
              }}
              className={`w-full p-2 rounded-xl border ${
                formErrors.file ? 'border-red-500' : ''
              }`}
              required
            />
            {formErrors.file && (
              <p className="text-red-500 text-sm mt-1">{formErrors.file}</p>
            )}
            {file && (
              <p className="text-green-600 text-sm mt-1">
                Arquivo selecionado: {file.name}
              </p>
            )}
          </div>

          <input
            type="hidden"
            name="status"
            value={form.status}
          />

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#86A1FB] text-white hover:bg-[#6B8DF9] transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Criar Manifestação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}