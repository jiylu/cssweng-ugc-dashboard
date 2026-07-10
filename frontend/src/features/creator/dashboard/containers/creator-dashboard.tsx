import CreatorSidebar from "../../../../components/organisms/creator-sidebar";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Bell, CheckCircle, Filter, Megaphone, NotebookPen, TrendingUp } from "lucide-react";
import CreatorAnalyticsCard from "../components/creator-analytics-card";
import CreatorTodoCard from "../components/creator-todo-card";
import Button from "@/src/components/atoms/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import LogoLoader from "@/src/components/molecules/logo-loader";

// TODO: Make CreatorDashboardProps interface para dynamic


export default function CreatorDashboard() {
  const { user, loading } = useAuth();
  if (loading) return <LogoLoader label="Loading creator dashboard" />;

  if (!user) return null;

  // TODO: Remove this if container is dynamic
  // template lang to
  const creatorDashboardStats = [
    {
      icon: Megaphone,
      label: "Active Campaigns",
      value: 3,
    },
    {
      icon: NotebookPen,
      label: "Pending Proposals",
      value: 67,
    },
    {
      icon: TrendingUp,
      label: "Revenue Generated",
      value: "Php 72,500",
    },
    {
      icon: CheckCircle,
      label: "Monthly Completed",
      value: 5,
    },
  ];

  const creatorDeliverables = [
    {
      campaign: "Product X Review",
      deliverable: "Script",
      type: "Partnership",
      deadline: "May 20, 2025",
      status: "In Progress",
    },
    {
      campaign: "Product X Review",
      deliverable: "Script",
      type: "Partnership",
      deadline: "May 20, 2025",
      status: "In Progress",
    },
  ];

  return (
    <main className="flex flex-row w-full h-screen overflow-hidden">
      <CreatorSidebar />

      <section className="flex-1 ml-8 my-8 overflow-y-auto pr-8 h-screen scrollbar-gutter-stable">
        {/* HEADER */}
        <div className="mb-5 flex items-start justify-between gap-8">
          <div>
            <h1 className="text-[64px] font-bold leading-tight text-[#141518]">
              Welcome back, {user?.first_name ?? "User"}
            </h1>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <button
              type="button"
              className="text-[#77736d] transition hover:text-[#141518]"
              aria-label="Notifications"
            >
              <Bell className="size-8" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="inline-flex items-centertext-xs font-medium text-[#6b1fa8] bg-[#6b1fa8]/10 px-3 py-1 rounded-full">
                  Creator
                </span>
                <p className="text-base leading-tight text-[#141518]">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-sm text-[#7b7771]">{user.email}</p>
              </div>
              <Image
                src="/default-profile.png"
                alt=""
                className="size-[46px] rounded-full"
                width={46}
                height={46}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* ANALYTICS */}
        <div className="mt-8 grid grid-cols-4 gap-4 mb-10">
          {creatorDashboardStats.map((stat) => (
            <CreatorAnalyticsCard
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
            />
          ))}
        </div>

        {/* TODOS */}
        {/* // TODO: Make this support arrays (para may multiple todos) */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Urgent / To Do</h2>
          <CreatorTodoCard
            campaignName="Test Campaign"
            message="Campaign due in 3 days."
          />
        </div>

        {/* ONGOING DELIVERABLES */}
        <div className="bg-white rounded-xs shadow-[0_1px_2px_rgba(0,0,0,0.08)] p-6 w-full h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Ongoing Deliverables</h2>
            <Button variant="ghost" className="flex items-center gap-1">
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
              {creatorDeliverables.map((row, i) => (
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
  )
}
