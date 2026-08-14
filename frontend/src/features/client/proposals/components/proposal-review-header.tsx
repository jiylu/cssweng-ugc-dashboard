"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ProposalReviewHeader() {
  const router = useRouter();

  return (
    <header className="flex h-[90px] items-center gap-4 rounded border border-[#d8d4cb] bg-white px-5 sm:gap-6 sm:px-9">
      <Image
        src="/Logo-black.svg"
        alt="Asceoft"
        width={140}
        height={40}
        className="h-auto w-[112px] sm:w-[140px]"
        priority
      />
      <div className="h-10 w-px bg-[#d8d4cb]" />
      <p className="text-[27px] leading-none text-[#6b1fa8] sm:text-[36px]">UGC Dashboard</p>
      <Button
        type="button"
        variant="outline"
        onClick={() => router.back()}
        className="ml-auto gap-2 border-[#6b1fa8] text-[#6b1fa8] hover:bg-[#f7f0fc] hover:text-[#5a1a8f]"
      >
        <ArrowLeft className="size-4" />
        Back
      </Button>
    </header>
  );
}
