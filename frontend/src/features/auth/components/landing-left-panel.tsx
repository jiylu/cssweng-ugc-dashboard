import Image from "next/image";

export default function LandingLeftPanel() {
  return (
    <div className="flex flex-1 flex-col justify-center p-10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[linear-gradient(#141518_1px,transparent_1px),linear-gradient(90deg,#141518_1px,transparent_1px)] bg-size-[48px_48px]" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-90 w-90 rounded-full bg-[radial-gradient(circle,#6B1FA8_-50%,transparent_50%)]" />
      <div className="pointer-events-none absolute -left-5 bottom-5 h-55 w-55 rounded-full bg-[radial-gradient(circle,#22d34c_-50%,transparent_50%)]" />

      <Image
        src="/Logo.svg"
        alt="Logo"
        className="w-50 mb-10"
        width={30}
        height={30}
      />

      {/* hero section */}
      <div className="z-1">
        <h2 className="text-[64px] font-extralight text-[#141518] leading-tight m-0 mb-3 tracking-[-0.5px]">
          Everything you need, <br />
          <span className="text-[#8811FF]">in one place.</span>
        </h2>
        <p>Manage your content, track analytics,<br />and collaborate with clients.</p>

      </div>

    </div>
  )
}