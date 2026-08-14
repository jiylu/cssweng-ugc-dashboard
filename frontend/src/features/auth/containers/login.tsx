import Image from "next/image";
import LoginCard from "../components/login-card";
import { useLogin } from "../hooks/useLogin";
import LandingLeftPanel from "../components/landing-left-panel";

export default function Login() {
  const loginForm = useLogin();

  return (
    <main>
      <section className="flex justify-end">
        <LandingLeftPanel />

        {/* right panel */}
        <div className="bg-white w-[40%] h-screen px-10 flex flex-col justify-center gap-5.5 shadow-[-20px_0_60px_rgba(107,31,168,0.08)]">
          <Image
            src="/Logo-notext-purple.svg"
            alt="Logo2"
            className="w-30"
            width={30}
            height={30}
          />

          <h1 className="text-[64px] text-[#141518] leading-tight tracking-[-0.5px]">
            Welcome back
          </h1>

          <LoginCard
            loginForm={loginForm}
          />
        </div>
      </section>
    </main>
  )
}