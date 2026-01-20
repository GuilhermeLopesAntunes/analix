'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/app/services/auth.service';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
    setError(err.message || 'Credenciais inválidas');
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#EEF2FF] to-[#F8FAFF]">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] rounded-3xl bg-white p-10 shadow-xl border border-gray-100"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Bem-vindo ao Analix
        </h1>
        <p className="text-gray-500 mb-8">
          Faça login para acessar o sistema
        </p>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="seu@email.com"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#86A1FB]"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Senha
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#86A1FB]"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#86A1FB] py-3 font-semibold text-white transition hover:bg-[#748CF0] focus:outline-none focus:ring-2 focus:ring-[#86A1FB]"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
