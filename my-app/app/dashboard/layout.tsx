'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/app/components/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setChecked(true);
  }, [router]);

  if (!checked) return null;

  return (
    <div className="flex h-svh bg-[#FAFAFA] dark:bg-[#282828]">

      <Sidebar />

      <main className="flex-1 overflow-auto">
        {children}
      </main>

    </div>
  );
}
