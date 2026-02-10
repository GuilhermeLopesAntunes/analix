'use client';

import Image from "next/image";
import Link from "next/link";

import logo from "@/public/Logo.svg";
import logoDark from "@/public/LogoDark.svg";

import {
  PanelLeftOpen,
  PanelLeftClose,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

import { ThemeToggle } from "../theme-toggle";
import { useEffect, useState } from "react";

import { getUserRoutePolicies } from "@/app/services/auth.service"; 

export default function Sidebar() {
  const [aberto, setAberto] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const policy = getUserRoutePolicies();
    setRole(policy);
  }, []);

  return (
    <>
      <div
        className={`relative bg-[#F6F6F6] dark:bg-[#242424]
        border-r h-full transition-all duration-300
        ${aberto ? "w-1/5" : "w-0"}`}
      >
        <div
          className={`px-12 py-12 transition-opacity duration-200
          ${aberto ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
  
          <div className="flex justify-between items-center">
            <Link href="/dashboard">
              <Image
                src={logo}
                alt="Logo"
                className="w-[140px] dark:hidden"
              />

              <Image
                src={logoDark}
                alt="Logo Dark"
                className="w-[140px] hidden dark:block"
              />
            </Link>

            <button onClick={() => setAberto(false)}>
              <PanelLeftOpen className="text-gray-500" />
            </button>
          </div>

    
          <div className="mt-16 flex flex-col gap-3">

            <ThemeToggle />

            <span className="mt-10 font-bold text-gray-400">
              PRINCIPAL
            </span>


            <Link
              href="/dashboard"
              className="flex gap-3 p-3 bg-[#EEEEEE]
              dark:bg-[#86A1FB] rounded-2xl"
            >
              <LayoutDashboard />
              Painel Principal
            </Link>

            {role === 'admin' && (
              <>
                <span className="mt-6 font-bold text-gray-400">
                  ADMIN
                </span>

                <Link
                  href="/dashboard/admin"
                  className="flex gap-3 p-3 bg-[#FFE6E6]
                  dark:bg-[#4C1D1D] rounded-2xl text-red-600"
                >
                  <ShieldCheck />
                  Painel Admin
                </Link>
              </>
            )}

          </div>
        </div>
      </div>

      {!aberto && (
        <button
          onClick={() => setAberto(true)}
          className="absolute top-6 left-2 z-50
          dark:bg-black p-2 rounded-md border"
        >
          <PanelLeftClose />
        </button>
      )}
    </>
  );
}
