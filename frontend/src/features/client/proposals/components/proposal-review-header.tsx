import Image from "next/image";

export default function ProposalReviewHeader() {
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
    </header>
  );
}
