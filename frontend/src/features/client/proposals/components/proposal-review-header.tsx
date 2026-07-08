import Image from "next/image";

export default function ProposalReviewHeader() {
  return (
    <header className="flex h-[90px] items-center gap-6 rounded border border-[#d8d4cb] bg-white px-9">
      <Image
        src="/Logo-black.svg"
        alt="Asceoft"
        width={140}
        height={40}
        className="h-auto w-[140px]"
        priority
      />
      <div className="h-10 w-px bg-[#d8d4cb]" />
      <p className="text-[36px] leading-none text-[#6b1fa8]">UGC Dashboard</p>
    </header>
  );
}
