import Image from "next/image";
import LandingLeftPanel from "../components/landing-left-panel";
import RegisterCard from "../components/register-card";
import { useRegister } from "../hooks/useRegister";

export default function CreatorRegister() {
  const registerForm = useRegister();

  return (
    <main>
      <section className="flex justify-end">
        <LandingLeftPanel />

        <div className="bg-white w-[40%] h-screen px-10 flex flex-col justify-center gap-5.5 shadow-[-20px_0_60px_rgba(107,31,168,0.08)]">
          <Image
            src="/Logo-notext-purple.svg"
            alt="Logo2"
            className="w-30"
            width={30}
            height={30}
          />

          <h1 className="text-[64px] text-[#141518] leading-tight tracking-[-0.5px]">
            Become a Creator
          </h1>


          <RegisterCard 
            registerForm={registerForm}
          />
        </div>

      </section>


    </main>
  )
}