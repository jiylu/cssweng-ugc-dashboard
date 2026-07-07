import Image from "next/image";

type LogoLoaderProps = {
  label?: string;
};

export default function LogoLoader({ label = "Loading" }: LogoLoaderProps) {
  return (
    <div
      className="flex min-h-screen w-full items-center justify-center"
      role="status"
      aria-label={label}
    >
      <div className="flex size-20 items-center justify-center rounded-full border border-[#8811FF]/15 bg-white shadow-[0_8px_30px_rgba(136,17,255,0.12)]">
        <Image
          src="/Logo-notext-purple.svg"
          alt=""
          width={40}
          height={40}
          className="size-10 animate-spin"
          priority
        />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
