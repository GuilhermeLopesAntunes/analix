'use client';

import { useEffect, useState } from 'react';

import {
  User,
  Mail,
  Lock,
  Shield,
  X,
  Save,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  user: any;
  onClose: () => void;
  onEdit: (data: any) => void;
}

export default function EditUserModal({
  isOpen,
  user,
  onClose,
  onEdit,
}: Props) {

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    routePolicies: 'user',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        routePolicies: user.routePolicies || 'user',
      });

      setError('');
    }
  }, [user]);


  if (!isOpen || !user) return null;


  function handleChange(e: any) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }


  function handleSubmit() {

    if (!form.name || !form.email) {
      setError('Nome e email são obrigatórios');
      return;
    }

    if (form.password) {
      if (form.password.length < 6) {
        setError('Senha mínima: 6 caracteres');
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError('Senhas não conferem');
        return;
      }
    }

    const payload: any = {
      name: form.name,
      email: form.email,
      routePolicies: form.routePolicies,
    };

    if (form.password) {
      payload.password = form.password;
    }

    onEdit(payload);
  }


  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

      <div className="bg-white dark:bg-[#222]
        p-6 rounded-2xl w-[440px]
        shadow-xl animate-fadeIn"
      >

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Save size={20} />
            Editar Usuário
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
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nome"
              className="input pl-10"
            />
          </div>


          {/* Email */}
          <div className="relative">

            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="input pl-10"
            />
          </div>


          {/* Perfil */}
          <div className="relative">

            <Shield
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              name="routePolicies"
              value={form.routePolicies}
              onChange={handleChange}
              className="input pl-10"
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>

          </div>


          {/* Divider */}
          <hr className="my-2" />

          <p className="text-sm text-gray-500">
            Alterar senha (opcional)
          </p>


          {/* Senha */}
          <div className="relative">

            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Nova senha"
              className="input pl-10"
            />
          </div>


          {/* Confirmar */}
          <div className="relative">

            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmar senha"
              className="input pl-10"
            />
          </div>


          {/* Error */}
          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

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
            onClick={handleSubmit}
            className="flex items-center gap-2
            bg-[#86A1FB] px-5 py-2 text-white
            rounded-xl font-semibold hover:opacity-90"
          >
            <Save size={18} />
            Salvar
          </button>

        </div>

      </div>
    </div>
  );
}
