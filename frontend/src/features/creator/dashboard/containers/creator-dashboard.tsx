import CreatorSidebar from "../../../../components/organisms/creator-sidebar";
import Profile from "@/src/components/molecules/profile";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Filter, Megaphone, NotebookPen, TrendingUp } from "lucide-react";
import CreatorAnalyticsCard from "../components/creator-analytics-card";
import CreatorTodoCard from "../components/creator-todo-card";
import Button from "@/src/components/atoms/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import LogoLoader from "@/src/components/molecules/logo-loader";

export default function CreatorDashboard() {
  const { user, loading } = useAuth();
  if (loading) return <LogoLoader label="Loading creator dashboard" />;
  if (!user) return null;

  const creatorDashboardStats = [
    { icon: Megaphone, label: "Active Campaigns", value: 3 },
    { icon: NotebookPen, label: "Pending Proposals", value: 67 },
    { icon: TrendingUp, label: "Revenue Generated", value: "Php 72,500" },
    { icon: CheckCircle, label: "Monthly Completed", value: 5 },
  ];

  const creatorDeliverables = [
    { 
      campaign: "Summer Glow 2026",
      deliverable: "TikTok short",
      type: "UGC",
      deadline: "Jul 22, 2026",
      status: "In progress", 
    },
    { 
      campaign: "Summer Glow 2026",
      deliverable: "Instagram reel",
      type: "Partnership",
      deadline: "Jul 24, 2026",
      status: "In progress",
    },
    {
      campaign: "FitLife Pro Launch",
      deliverable: "YouTube review",
      type: "Partnership",
      deadline: "Jul 30, 2026",
      status: "In Progress",
    }
  ];

  return (
    <main className="flex flex-row w-full min-h-screen overflow-hidden">
      <CreatorSidebar />

      <section className="flex-1 overflow-y-auto h-screen scrollbar-gutter-stable px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="mt-3 mb-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-[56px] font-bold leading-tight text-[#141518]">
                Welcome back, {user?.first_name ?? "User"}
              </h1>
            </div>
            <div className="shrink-0">
              <Profile
                firstName={user.first_name}
                lastName={user.last_name}
                email={user.email}
              />
            </div>
          </div>

          <Separator />

          {/* ANALYTICS */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Urgent / To Do</h2>
          <div className="flex flex-row gap-2 flex-start mb-10">
            <CreatorTodoCard
              campaignName="Summer Glow 2026"
              message="Campaign due in 3 days."
            />
            <CreatorTodoCard
              campaignName="FitLife Pro Launch"
              message="Campaign due in 14 days."
            />
          </div>

          {/* ONGOING DELIVERABLES */}
          <div className="bg-white rounded-xs shadow-[0_1px_2px_rgba(0,0,0,0.08)] p-4 sm:p-6 w-full h-fit">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">Ongoing Deliverables</h2>
              <Button variant="ghost" className="flex items-center gap-1">
                <Filter size={16} /> Filter By
              </Button>
            </div>

            {/* Scrollable table on small screens */}
            <div className="overflow-x-auto">
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
          </div>

        </div>
      </section>
    </main>
  )
}