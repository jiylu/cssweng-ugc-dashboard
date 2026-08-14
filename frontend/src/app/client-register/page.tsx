"use client";

import { Suspense } from "react";
import ClientRegister from "@/src/features/auth/containers/client-register";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientRegister />
    </Suspense>
  );
}
