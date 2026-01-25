// hooks/useBootstrapUser.ts
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/auth/userStore";
import { getProfile } from "@/lib/api/auth";

export function useAuth() {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (user) {
      initialized.current = true;
      return;
    }

    initialized.current = true;

    getProfile()
      .then((me) => {
        setUser(me);
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [user, setUser, router]);
}
