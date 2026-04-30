"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";
import Dashboard from "@/components/Dashboard";

export default function MersalPage() {
  const { isAuthenticated } = useSettings();
  const router = useRouter();

  useEffect(() => {
    // Basic protection
    const isAuth = localStorage.getItem("mersal_auth") === "true";
    if (!isAuth && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null; // Wait for redirect or context sync

  return <Dashboard />;
}
