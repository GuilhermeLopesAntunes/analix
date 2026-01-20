'use client';

import logo from "@/public/Logo.svg";
import logoDark from "@/public/LogoDark.svg";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  PanelLeftOpen,
  PanelLeftClose,
  Pencil,
  Trash,
  FileText,
  CirclePlus,
  LayoutDashboard,
  Tag,
  LogOut
} from "lucide-react";

import { ThemeToggle } from "../theme-toggle";
import { SearchBar } from "../components/SearchBar";
import { SearchResultsList } from "../components/SearchResultsList";
import { PrincipalCardNumber } from "../components/PrincipalCardNumber";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { CreateManifestModal } from "../components/CreateManifestModal";
import { CreateLabelModal } from "../components/CreateLabelModal";

import {
  listManifest,
  createManifest,
  updateStatus,
  removeManifest,
  updateManifestLabel,
  uploadManifestFile,
} from "@/app/services/manifest.service";

import {
  listLabels,
  createLabel,
} from "@/app/services/label.service";
import { logout } from "../services/auth.service";
import { SucessAction } from "../components/sucessfulAction";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Label {
  id: number;
  name: string;
  colorRgb: string;
}

interface Responsavel {
  id: number;
    name: string;
    email: string;
}

export interface Manifestacao {
  id: number;
  protocolo: string;
  responsavel?: Responsavel
  dataManifestacao: Date | string;
  periodo: number;
  processoSei: string;
  status: string;
  arquivo: string;
  label?: Label;
}

export default function Painel() {
    const router = useRouter();
    const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem('access_token');

  if (!token) {
    router.replace('/login');
    return;
  }

  setAuthChecked(true);
}, [router]);

  const [labels, setLabels] = useState<Label[]>([]);
  const [manifestacoes, setManifestacoes] = useState<Manifestacao[]>([]);
  const [labelSelectorOpen, setLabelSelectorOpen] = useState<number | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [manifestIdToDelete, setManifestIdToDelete] = useState<number | null>(null);

  const [filter, setFilter] = useState<'todas' | 'andamento' | 'concluidas'>('todas');
  const [results, setResults] = useState<User[]>([]);
  const [aberto, setAberto] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const [action, setAction] = useState<'Etiqueta'|'Manifestação'| 'ação'>('ação');

  const todasRef = useRef<HTMLButtonElement>(null);
  const andamentoRef = useRef<HTMLButtonElement>(null);
  const concluidasRef = useRef<HTMLButtonElement>(null);
  const [underlineLeft, setUnderlineLeft] = useState(0);
  const [underlineWidth, setUnderlineWidth] = useState(0);

  
  useEffect(() => {
  const ref =
    filter === 'todas'
      ? todasRef.current
      : filter === 'andamento'
      ? andamentoRef.current
      : concluidasRef.current;

  if (ref) {
    requestAnimationFrame(() => {
      setUnderlineLeft(ref.offsetLeft);
      setUnderlineWidth(ref.offsetWidth);
    });
  }
}, [filter]);


  async function loadLabels() {
  const data = await listLabels();
  setLabels(Array.isArray(data) ? data : []);
}

  async function loadManifestacoes() {
  const data = await listManifest();
  setManifestacoes(Array.isArray(data) ? data : []);
}

  useEffect(() => {
    loadLabels();
    loadManifestacoes();
  }, []);



const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);
async function handleCreateLabel(data: { name: string; colorRgb: string }) {
  try {
    const result = await createLabel(data);

    if (result.status === 201) {
      setAction('Etiqueta');
      setShowSuccess(true);

      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }

      successTimeoutRef.current = setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
    }

    await loadLabels();
    setShowLabelModal(false);

  } catch (error) {
    console.log(error);
  }
}


  async function handleCreateManifest(data: any) {
    try{
      const upload = await uploadManifestFile(data.file);

      const result = await createManifest({
        protocolo: data.protocolo,
        processoSei: data.processoSei,
        dataManifestacao: data.dataManifestacao,
        status: data.status,
        idEtiqueta: data.idEtiqueta,
        arquivo: upload.path,
      });

      if (result.status === 201) {
        setAction("Manifestação")
        setShowSuccess(true);

      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }

      successTimeoutRef.current = setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
    }

      await loadManifestacoes(); 
      setShowCreateModal(false);


    } catch(error) { console.log(error)}
      
}

 async function handleSelectLabel(manifestId: number, labelId: number) {
  const updated = await updateManifestLabel(manifestId, labelId);
  

  setManifestacoes(prev =>
    prev.map(m => m.id === manifestId ? updated : m)
  );
  await loadManifestacoes()
  setLabelSelectorOpen(null);
}


  async function handleUpdateStatus(id: number, status: string) {
    const updated = await updateStatus(id, status);
    setManifestacoes(prev =>
      prev.map(m => m.id === id ? { ...m, status: updated.status } : m)
    );
  }

  async function handleConfirmDelete() {
    if (!manifestIdToDelete) return;
    await removeManifest(manifestIdToDelete);
    setManifestacoes(prev => prev.filter(m => m.id !== manifestIdToDelete));
    setShowDeleteModal(false);
    setManifestIdToDelete(null);
  }

  function handleOpenDeleteModal(id: number) {
  setManifestIdToDelete(id);
  setShowDeleteModal(true);
}


  const manifestacoesFiltradas = manifestacoes.filter(m => {
    if (filter === 'andamento') return m.status === 'aguardando';
    if (filter === 'concluidas') return m.status === 'completo';
    return true;
  });

  const total = manifestacoes.length;
  const andamento = manifestacoes.filter(m => m.status === 'aguardando').length;
  const concluido = manifestacoes.filter(m => m.status === 'completo').length;
  if (!authChecked) {
    return null; 
  }
  return (
     

    
    <div className="flex h-svh bg-[#FAFAFA] dark:bg-[#282828] transition-all duration-300 relative">
     
      <div
        className={`relative bg-[#F6F6F6] dark:bg-[#242424] dark:border-[#000000] border-[#DBDBDB] border-r h-full transition-all duration-300 ${aberto ? "w-1/2" : "w-0"}`}
      >
    
        <div
          className={`px-12 py-12  transition-opacity duration-200 
            ${aberto ? "opacity-100" : "opacity-0 pointer-events-none "}`}
        >
          <div className="flex justify-between items-center ">
            <Link href={"/dashboard"}>
             
                <Image
                  src={logo}
                  alt="Logo"
                  loading="eager"
                  className="w-[140px] h-auto dark:hidden"
                />

       
                <Image
                  src={logoDark}
                  alt="Logo Dark"
                  loading="eager"
                  className="w-[140px] h-auto hidden dark:block"
                />
              </Link>

       
            <button onClick={() => setAberto(false)}>
              <PanelLeftOpen className="text-[#7E7E7E] dark:text-[#ffff]" />
            </button>
          </div>

          
          <div className="mt-16 flex flex-col gap-3">
            <div>
              <ThemeToggle />
            </div>
            
            <span className="text-[#8B8B8B] font-bold dark:text-[#FFFFFF] mt-10 transition-all duration-300">PRINCIPAL</span>
            <Link href={"/dashboard"} className="flex gap-3 p-3 bg-[#EEEEEE] dark:bg-[#86A1FB] rounded-2xl transition-all duration-300"><LayoutDashboard className="text-[#8B8B8B] dark:text-[#FFFF]"/> <span className="text-[#8B8B8B] dark:text-[#FFFF]">Painel Principal</span></Link>
            
          </div>

          <div>
            
          </div>
        </div>
      </div>


      {!aberto && (
        <button
          onClick={() => setAberto(true)}
          className="text-[#FFFF] absolute top-6 left-2 z-50 dark:bg-[#000000] p-2 rounded-md shadow border border-[#DBDBDB] "
        >
          <PanelLeftClose className="text-[#7E7E7E] dark:text-[#FFFF]" />
        </button>
      )}

    
      <div className="w-full mx-15 my-10">
         {showSuccess && <SucessAction action= {action} />}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Denúncias</h1>

          <div className="flex gap-10">
            <div >
              <SearchBar setResults={setResults} />
              <SearchResultsList results={results} />
            </div>
            <button onClick={logout} className="flex px-10 rounded-2xl items-center gap-3 py-3 font-bold cursor-pointer bg-red-400 text-white">
              <LogOut />
              Sair
            </button>
          </div>
          
        </div>

        <div className="mt-2 bg-white dark:bg-[#323232] h-auto p-10 rounded-3xl">
          
          <div className="flex justify-between items-center">
            
            <p className="text-xl">Manifestações</p>
            <div className="flex gap-10">
                <button
                  onClick={() => setShowLabelModal(true)}
                  className="cursor-pointer bg-[#86A1FB] px-8 py-3 text-white font-bold rounded-2xl flex gap-3"
                >
                 <Tag /> Criar Etiqueta
                </button>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="cursor-pointer bg-[#4C4C4C] dark:bg-[#86A1FB] px-6 py-3 text-white font-bold rounded-2xl flex gap-2"
                  >
                    <CirclePlus /> Adicionar Manifestação
                  </button>

            </div>
            
            
          </div>

          <div className="flex gap-10 mt-10">
            <PrincipalCardNumber phrase="Total de Manifestações" color="bg-[#6A5ABB]" value={total} />
            <PrincipalCardNumber phrase="Manifestações em andamento" color="bg-[#FBCA86]" value={andamento} />
            <PrincipalCardNumber phrase="Manifestações concluídas" color="bg-[#90FB86]" value={concluido} />
          </div>

          <div className="relative flex gap-10 mt-12">
            <button
              onClick={() => setFilter('todas')}
              className="px-2"
              ref={todasRef}
            >
              Todas
            </button>

            <button
              onClick={() => setFilter('andamento')}
              className="px-2"
              ref={andamentoRef}
            >
              Em Andamento
            </button>

            <button
              onClick={() => setFilter('concluidas')}
              className="px-2"
              ref={concluidasRef}
            >
              Concluídas
            </button>

            {/* underline animado */}
            <span
              className="absolute bottom-0 h-[3px] bg-[#86A1FB] transition-all duration-300"
              style={{
                width: `${underlineWidth}px`,
                left: `${underlineLeft}px`,
              }}
            />
          </div>
          

          <hr className="text-[#989898]" />
          

          <table className="mt-6 table-auto w-full text-[#808080]">
            <thead className="h-16 dark:text-[#FFFFFF]  bg-[#FAFAFA] dark:bg-[#161616] transition-all duration-300">
              <tr>
                <th>Etiqueta</th>
                <th>Protocolo</th>
                <th>Responsável</th>
                <th>Data da Manifestação</th>
                <th>Período</th>
                <th>Processo SEI</th>
                <th>Status</th>
                <th>Arquivo</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
  {manifestacoesFiltradas.map((m) => (
    <tr
      key={m.id}
      className="text-center h-14 dark:border-[#494848] border-[#EAEAEA] border dark:text-white"
    >
      <td className="relative text-center">
        <button
          onClick={() =>
            setLabelSelectorOpen(
              labelSelectorOpen === m.id ? null : m.id
            )
          }
          className="px-3 py-1 rounded-full text-white text-sm font-medium cursor-pointer"
          style={{
            backgroundColor: m.label?.colorRgb || '#D1D5DB',
            color: m.label ? '#fff' : '#374151',
          }}
        >
          {m.label?.name || 'Sem etiqueta'}
        </button>

        {labelSelectorOpen === m.id && (
          <div className="absolute z-50 mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-[#2f2f2f] shadow-lg rounded-xl p-2 min-w-[160px] ">
            {labels.map((label) => (
              <button
                key={label.id}
                onClick={() => handleSelectLabel(m.id, label.id)}
                className="w-full text-left px-3 py-2 rounded-md text-sm mb-1 cursor-pointer"
                style={{ backgroundColor: label.colorRgb, color: '#fff' }}
              >
                {label.name}
              </button>
            ))}
          </div>
        )}
      </td>

      <td>{m.protocolo}</td>

      <td>{m.responsavel?.name}</td>

      <td>{new Date(m.dataManifestacao).toLocaleDateString()}</td>

      <td>{m.periodo} dias</td>

      <td>
        <a
          className="text-blue-400"
          target="_blank"
          href={m.processoSei}
        >
          Processo SEI
        </a>
      </td>

      <td>
        {m.status === "aguardando" ? (
          <button
            onClick={() => handleUpdateStatus(m.id, 'completo')}
            className="p-2 cursor-pointer bg-[#FFE6BB] text-[#F4B474] dark:bg-[#F4B474] dark:text-white rounded-3xl"
          >
            Aguardando
          </button>
        ) : (
          <button
            onClick={() => handleUpdateStatus(m.id, 'aguardando')}
            className="p-2 cursor-pointer bg-[#E2F8DF] text-[#96AF90] dark:bg-[#96AF90] dark:text-white rounded-3xl"
          >
            Completo
          </button>
        )}
      </td>


      <td className="text-center">
        <a
         href={`http://localhost:3001${m.arquivo}`}
         target="_blank" 
         className="cursor-pointer inline-flex items-center justify-center gap-2 bg-[#90AFF0] dark:bg-[#7399eb] px-3 py-2 rounded-3xl">
          <FileText color="#FFF" className="w-5" />
          <span className="text-white">Abrir</span>
        </a>
      </td>

      <td>
        <div>
          <button className="mr-4 cursor-pointer">
            <Pencil className="text-[#1C1B1F] dark:text-white"/>
          </button>

          <button
            className="cursor-pointer"
            onClick={() => handleOpenDeleteModal(m.id)}
          >
            <Trash color="#CF3333" />
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>
          </table>

        </div>

      </div>
      <CreateManifestModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateManifest}
        labels={labels} 
      />

      <CreateLabelModal
        isOpen={showLabelModal}
        onClose={() => setShowLabelModal(false)}
        onCreate={handleCreateLabel}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
  
}
