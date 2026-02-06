'use client';

import Image from "next/image";
import Link from "next/link";

import logo from "@/public/Logo.svg";
import logoDark from "@/public/LogoDark.svg";

import {
  PanelLeftOpen,
  PanelLeftClose,
  LayoutDashboard,
} from "lucide-react";

import { ThemeToggle } from "../theme-toggle";
import { useState } from "react";

export default function Sidebar() {
  const [aberto, setAberto] = useState(true);

  return (
    <>
      {/* Sidebar */}
      <div
        className={`relative bg-[#F6F6F6] dark:bg-[#242424]
        border-r h-full transition-all duration-300
        ${aberto ? "w-1/5" : "w-0"}`}
      >
        <div
          className={`px-12 py-12 transition-opacity duration-200
          ${aberto ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          {/* Logo */}
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

          {/* Menu */}
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

          </div>
        </div>
      </div>

      {/* Botão abrir */}
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
