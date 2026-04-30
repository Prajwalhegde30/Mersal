"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  const { isAuthenticated } = useSettings();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/mersal");
    }
  }, [isAuthenticated, router]);

  return <LandingPage />;
}
