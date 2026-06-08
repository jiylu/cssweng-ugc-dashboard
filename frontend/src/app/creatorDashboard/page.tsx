"use client"
// Local
import logo from './../public/Logo-black.svg'
import styles from './../ui/dashboardStyles/dashboard.module.css';

// React
import Image from 'next/image';

// Shadecn
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { LayoutPanelTop } from "lucide-react"
import { Megaphone } from "lucide-react"
import { NotebookPen } from "lucide-react"
import { Calendar } from "lucide-react"
import { Settings } from "lucide-react"
import { LogOut } from "lucide-react"

export default function Dashboard() {
  return (
    <>
      <main>
        {/* LEFT PANEL */}
        <section className={styles.leftpanel}>
          <Image src={logo} alt="Logo" className="w-[150px] mt-10 mb-10"/>
          <Separator />

          {/* NAVIGATION */}
          <div className={styles.navbtn}>
            <Button type="button" className="cursor-pointer w-57 h-[50px] mt-10 mb-6 text-lg">
              + New Campaign
            </Button>
            <div className="flex flex-col justify-start items-start">
              <Button variant="ghostactive" className="justify-start items-center cursor-pointer w-57 h-[50px] text-lg">
                <LayoutPanelTop />Dashboard
              </Button>
              <Button variant="ghost" className="justify-start items-center cursor-pointer w-57 h-[50px] text-lg">
                <Megaphone />Campaigns
              </Button>
              <Button variant="ghost" className="justify-start items-center cursor-pointer w-57 h-[50px] text-lg">
                <NotebookPen />Proposals
              </Button>
              <Button variant="ghost" className="justify-start items-center cursor-pointer w-57 h-[50px] text-lg">
                <Calendar />Calendar
              </Button>
              <Button variant="ghost" className="justify-start items-center cursor-pointer w-57 h-[50px] text-lg">
                <Settings />Settings
              </Button>
            </div>
          </div>

          {/* SIGN OUT */}
          <div className="mt-auto mb-5 flex flex-col">
            <Separator />
            <Button variant="ghost" className="justify-start items-center cursor-pointer w-57 h-[50px] text-lg">
              <LogOut />Sign Out
            </Button>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className={styles.rightpanel}>
          <div className={styles.header}>

          </div>
          <div className={styles.mainbody}>

          </div>
        </section>
      </main>
    </>
  )
}