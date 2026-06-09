"use client"
// Local
import logo from './../public/Logo-black.svg'
import defaultprofile from './../public/default-profile.png'
import styles from './../ui/dashboardStyles/dashboard.module.css';
import { useAuth } from "./../hooks/useAuth";

// React
import Image from 'next/image';
import { useRouter } from 'next/navigation'

// Shadecn
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"


// Lucide
import { LayoutPanelTop } from "lucide-react"
import { Megaphone } from "lucide-react"
import { NotebookPen } from "lucide-react"
import { Calendar } from "lucide-react"
import { Settings } from "lucide-react"
import { LogOut } from "lucide-react"
import { Search } from "lucide-react"
import { TrendingUp, 
         CheckCircle, 
         Filter 
       } from "lucide-react"

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return (
      <div className="flex mt-5 justify-center">
        <Badge variant="outline">
          <Spinner data-icon="inline-start" />
          Loading...
        </Badge>
      </div>
  );
  if (!user) return null;

  const handleSignout = () => {
    // SIGN OUT LOGIC (e.g. CLEAR COOKIES, etc.)
    router.push('/login');
  };

  return (
    <>
      <main className="flex flex-row w-full h-screen overflow-hidden">
        {/* LEFT PANEL */}
        <section className={styles.leftpanel}>
          <Image src={logo} alt="Logo" className="w-[150px] mt-10 mb-10"/>
          <Separator />

          {/* NAVIGATION */}
          <div className={styles.navbtn}>
            <Button type="button" onClick={() => router.push('/createCampaign')} className="cursor-pointer w-57 h-[50px] mt-10 mb-6 text-lg">
              + New Campaign
            </Button>
            <div className="flex flex-col justify-start items-start">
              <Button variant="ghostactive" className="justify-start items-center cursor-pointer w-57 h-[50px] text-lg">
                <LayoutPanelTop />Dashboard
              </Button>
              <Button variant="ghost" className="justify-start items-center cursor-pointer w-57 h-[50px] text-lg">
                <Megaphone />Campaigns
              </Button>
              <Button variant="ghost" onClick={() => router.push('/createCampaign')} className="justify-start items-center cursor-pointer w-57 h-[50px] text-lg">
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
            <Button variant="ghost" onClick={handleSignout} className="justify-start items-center cursor-pointer w-57 h-[50px] text-lg">
              <LogOut />Sign Out
            </Button>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className={styles.rightpanel}>
          {/* HEADER */}
          <div className={styles.header}>
            <div className="flex flex-row items-center gap-2">
              <InputGroup className="w-100 h-10 border-[#837f7b]-600">
                <InputGroupInput placeholder="Search..."/>
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
              </InputGroup>
              <Button className="h-10">Search</Button>
            </div>
              <Image src={defaultprofile} alt="default" className="w-[40px] mr-5 rounded-full"/>
          </div>
          <Separator />

          {/* BODY */}
          <div className={styles.mainbody}>
            <h1 className={`${styles.h1text} mb-8`}>Welcome Back, User</h1>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-10">
            {[
              { icon: <Megaphone size={28} className="text-gray-400" />, label: "ACTIVE CAMPAIGNS", value: "7" },
              { icon: <NotebookPen size={28} className="text-gray-400" />, label: "PENDING PROPOSALS", value: "3" },
              { icon: <TrendingUp size={28} className="text-gray-400" />, label: "REVENUE GENERATED", value: "Php 72,000" },
              { icon: <CheckCircle size={28} className="text-gray-400" />, label: "MONTHLY COMPLETED", value: "7" },
            ].map((stat) => (
              <div key={stat.label} className={styles.card}>
                {stat.icon}
                <p className="text-[11px] text-gray-500 font-semibold tracking-widest mt-3 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* URGENT / TO DO */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Urgent / To Do</h2>
            <div className={`${styles.card} max-w-xs border-l-4 border-l-purple-600`}>
              <p className="font-semibold text-gray-800 mb-1">[Campaign Name]</p>
              <p className="text-sm text-gray-500 mb-3">Proposal was sent 3 days ago.</p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white text-sm h-8 px-4">
                Follow up
              </Button>
            </div>
          </div>

          {/* ONGOING DELIVERABLES */}
          <div className={`${styles.card} mb-10`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Ongoing Deliverables</h2>
              <Button variant="ghost" className="text-sm text-gray-500 gap-1">
                <Filter size={16} /> Filter By
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Deliverable</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { campaign: "Product X Review", deliverable: "Script", type: "Partnership", deadline: "May 20, 2025", status: "In Progress" },
                  { campaign: "Product X Review", deliverable: "Script", type: "Partnership", deadline: "May 20, 2025", status: "In Progress" },
                ].map((row, i) => (
                  <TableRow key={i} className="text-sm text-gray-700">
                    <TableCell>{row.campaign}</TableCell>
                    <TableCell>{row.deliverable}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.deadline}</TableCell>
                    <TableCell>
                      <span className="text-purple-700 bg-purple-50 px-2 py-1 rounded text-xs font-medium">
                        {row.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </main>
    </>
  )
}