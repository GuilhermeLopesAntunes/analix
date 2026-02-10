'use client';

import { useEffect, useState } from 'react';

import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from '@/app/services/user.service';

import {
  Pencil,
  Trash,
  UserPlus,
} from 'lucide-react';

import CreateUserModal from '@/app/components/CreateUserModal';
import EditUserModal from '@/app/components/EditUserModal';
import DeleteUserModal from '@/app/components/DeleteUserModal';

interface User {
  id: number;
  name: string;
  email: string;
  routePolicies: string;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  async function loadUsers() {
    const data = await listUsers();
    setUsers(data);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function openEdit(user: User) {
    setSelectedUser(user);
    setShowEdit(true);
  }

  function openDelete(user: User) {
    setSelectedUser(user);
    setShowDelete(true);
  }

  return (
    <div className="p-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-semibold">
          Painel Administrativo
        </h1>

        <button
          onClick={() => setShowCreate(true)}
          className="bg-[#86A1FB] px-6 py-3 rounded-2xl
          text-white font-bold flex gap-2"
        >
          <UserPlus />
          Novo Usuário
        </button>

      </div>

      {/* CARD */}
      <div
        className="mt-6 bg-white dark:bg-[#323232]
        p-8 rounded-3xl"
      >
        <p className="text-xl mb-6">Usuários</p>

        {/* TABELA */}
        <table className="w-full text-center">

          <thead
            className="h-14 bg-[#FAFAFA]
            dark:bg-[#161616]"
          >
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Perfil</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>

            {users.map(user => (

              <tr
                key={user.id}
                className="h-14 border-b
                dark:border-[#444]"
              >

                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-xl text-white
                    ${
                      user.routePolicies === 'admin'
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                    }`}
                  >
                    {user.routePolicies}
                  </span>
                </td>

                <td>

                  <button
                    onClick={() => openEdit(user)}
                    className="mr-4"
                  >
                    <Pencil />
                  </button>

                  <button
                    onClick={() => openDelete(user)}
                  >
                    <Trash color="#CF3333" />
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* MODAIS */}

      <CreateUserModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={async data => {
          await createUser(data);
          await loadUsers();
          setShowCreate(false);
        }}
      />

      <EditUserModal
        isOpen={showEdit}
        user={selectedUser}
        onClose={() => {
            setShowEdit(false);
            setSelectedUser(null);
        }}
        onEdit={async data => {
            try {
            const res = await updateUser(selectedUser!.id, data);

            if (!res.ok) {
                const err = await res.json();
                alert(err.message);
                return;
            }

            await loadUsers();
            setShowEdit(false);
            setSelectedUser(null);

            } catch {
            alert('Erro ao atualizar');
            }
        }}
        />

      <DeleteUserModal
        isOpen={showDelete}
        user={selectedUser}
        onClose={() => setShowDelete(false)}
        onConfirm={async () => {
          if (!selectedUser) return;
          await deleteUser(selectedUser.id);
          await loadUsers();
          setShowDelete(false);
        }}
      />

    </div>
  );
}
