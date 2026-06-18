import Image from "next/image";
import LoginCard from "../components/login-card";
import { useLogin } from "../hooks/useLogin";

export default function Login() {
  const loginForm = useLogin();

  return (
    <main>
      <section className="flex justify-end">
        {/* left panel */}
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
          </div>

        </div>


        <div className="bg-white w-[40%] h-screen px-10 flex flex-col justify-center gap-5.5 shadow-[-20px_0_60px_rgba(107,31,168,0.08)]">
          <Image
            src="/Logo-notext-purple.svg"
            alt="Logo2"
            className="w-30"
            width={30}
            height={30}
          />

          <h1 className="text-[64px] text-[#141518] leading-tight tracking-[-0.5px]">
            Welcome Back
          </h1>

          <LoginCard 
            loginForm={loginForm}
          />
        </div>
      </section>
    </main>
  )
}