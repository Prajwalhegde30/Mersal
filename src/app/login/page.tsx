"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";
import Login from "@/components/Login";

export default function LoginPage() {
  const { isAuthenticated } = useSettings();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/mersal");
    }
  }, [isAuthenticated, router]);

  return <Login />;
}
