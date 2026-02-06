'use client';

import { useEffect, useState, useRef } from 'react';
import { listLabels } from '@/app/services/label.service';
import { updateManifestLabel } from '@/app/services/manifest.service';

interface Label {
  id: number;
  name: string;
  colorRgb: string;
}

interface Props {
  manifestId: number;
  currentLabel?: Label;
  reloadManifestacoes: () => void;
}

export default function SelectLabel({
  manifestId,
  currentLabel,
  reloadManifestacoes,
}: Props) {
  const [open, setOpen] = useState(false);
  const [labels, setLabels] = useState<Label[]>([]);

  // 👉 Ref do componente inteiro
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const data = await listLabels();
      setLabels(data);
    }

    load();
  }, []);

  // 👉 CLICK FORA
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  async function handleSelect(labelId: number) {
    await updateManifestLabel(manifestId, labelId);

    await reloadManifestacoes();

    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative inline-block">

      {/* Botão */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="px-3 py-1 rounded-full text-white text-sm font-medium"
        style={{
          backgroundColor: currentLabel?.colorRgb || '#D1D5DB',
          color: currentLabel ? '#fff' : '#374151',
        }}
      >
        {currentLabel?.name || 'Sem etiqueta'}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute z-50 mt-2 left-1/2 -translate-x-1/2
            bg-white dark:bg-[#2f2f2f]
            shadow-lg rounded-xl p-2 min-w-[160px]

            max-h-60
            overflow-y-auto
          "
        >
          {labels.map(label => (
            <button
              key={label.id}
              onClick={() => handleSelect(label.id)}
              className="w-full text-left px-3 py-2 rounded-md text-sm mb-1"
              style={{
                backgroundColor: label.colorRgb,
                color: '#fff',
              }}
            >
              {label.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
