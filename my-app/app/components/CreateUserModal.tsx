'use client';

import { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Shield,
  X,
  Plus,
} from 'lucide-react';

export default function CreateUserModal({
  isOpen,
  onClose,
  onCreate,
}: any) {

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    routePolicies: 'user',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

      <div className="bg-white dark:bg-[#222]
        p-6 rounded-2xl w-[440px]
        shadow-xl animate-fadeIn"
      >

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Plus size={20} />
            Criar Usuário
          </h2>

          <button onClick={onClose}>
            <X className="text-gray-400 hover:text-gray-600" />
          </button>

        </div>


        {/* FORM */}
        <div className="flex flex-col gap-4">

          {/* Nome */}
          <div className="relative">

            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              placeholder="Nome completo"
              className="input pl-10"
              onChange={e =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>


          {/* Email */}
          <div className="relative">

            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              placeholder="Email"
              className="input pl-10"
              onChange={e =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>


          {/* Senha */}
          <div className="relative">

            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="password"
              placeholder="Senha"
              className="input pl-10"
              onChange={e =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>


          {/* Perfil */}
          <div className="relative">

            <Shield
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              className="input pl-10"
              onChange={e =>
                setForm({
                  ...form,
                  routePolicies: e.target.value,
                })
              }
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>

          </div>

        </div>


        {/* FOOTER */}
        <div className="flex justify-end gap-3 mt-8 pt-4 border-t">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border
            hover:bg-gray-100 dark:hover:bg-[#333]"
          >
            Cancelar
          </button>

          <button
            onClick={() => onCreate(form)}
            className="flex items-center gap-2
            bg-[#86A1FB] px-5 py-2 text-white
            rounded-xl font-semibold hover:opacity-90"
          >
            <Plus size={18} />
            Criar
          </button>

        </div>

      </div>
    </div>
  );
}
