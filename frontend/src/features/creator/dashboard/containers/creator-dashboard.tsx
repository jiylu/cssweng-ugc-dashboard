import CreatorSidebar from "../../../../components/organisms/creator-sidebar";
import Profile from "@/src/components/molecules/profile";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Filter, Megaphone, NotebookPen, TrendingUp } from "lucide-react";
import CreatorAnalyticsCard from "../components/creator-analytics-card";
import CreatorTodoCard from "../components/creator-todo-card";
import Button from "@/src/components/atoms/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { useAnalytics } from "../hooks/useAnalytics";
import { useCampaigns } from "@/src/features/creator/campaigns/hooks/useCampaign";
import { useCampaignDeliverables } from "../hooks/useCampaignDeliverables";
import { buildDeliverableRows, buildUpcomingTodos, formatDueIn } from "../utils/dashboard-rows";
import { DashboardDeliverable } from "../types/dashboard-deliverable.types";
import { useRouter } from "next/navigation";
import LogoLoader from "@/src/components/molecules/logo-loader";

export default function CreatorDashboard() {
  const { user, loading } = useAuth();
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns(user?.user_id ?? "", 1, 100);
  const { deliverablesByCampaign, isLoading: deliverablesLoading } = useCampaignDeliverables(campaigns);
  const router = useRouter();

  if (loading || analyticsLoading || campaignsLoading || deliverablesLoading) return <LogoLoader label="Loading creator dashboard" />;
  if (!user) return null;

  const deliverableRows = buildDeliverableRows(campaigns, deliverablesByCampaign);
  const todos = buildUpcomingTodos(campaigns, deliverablesByCampaign);

  const deliverableTypeLabel = (type: DashboardDeliverable["deliverable_type"]) =>
    type === "UGC" ? "UGC" : "Partnership";

  const deliverableStatusLabel = (status: DashboardDeliverable["deliverable_status"]) =>
    status === "PENDING" ? "Pending" : status === "IN_PROGRESS" ? "In progress" : "Approved";

  const creatorDashboardStats = [
    { icon: Megaphone, label: "Active Campaigns", value: analytics?.active_campaigns ?? 0 },
    { icon: NotebookPen, label: "Pending Proposals", value: analytics?.pending_proposals ?? 0 },
    { icon: TrendingUp, label: "Revenue Generated", value: `Php ${(analytics?.revenue_generated ?? 0).toLocaleString()}` },
    { icon: CheckCircle, label: "Monthly Completed", value: analytics?.monthly_completed ?? 0 },
  ];

  return (
    <main className="flex flex-row w-full min-h-screen overflow-hidden">
      <CreatorSidebar />

      <section className="flex-1 overflow-y-auto h-screen scrollbar-gutter-stable px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="mt-2 mb-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-lg sm:text-3xl lg:text-[56px] font-bold leading-tight text-[#141518]">
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
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Urgent / To Do</h2>
          <div className="flex flex-row flex-wrap gap-4 mb-10">
            {todos.length > 0 ? (
              todos.map((todo) => (
                <CreatorTodoCard
                  key={`${todo.campaignName}-${todo.message}`}
                  campaignName={todo.campaignName}
                  message={todo.message}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500">No upcoming deadlines.</p>
            )}
          </div>

          {/* ONGOING DELIVERABLES */}
          <div className="bg-white rounded-xs shadow-[0_1px_2px_rgba(0,0,0,0.08)] p-4 sm:p-6 w-full h-fit border border-solid border-[#d8d4cb]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">Ongoing Deliverables</h2>
              <Button variant="ghost" className="flex items-center gap-1">
                <Filter size={16} className="-mt-[5px] mr-1" /> Filter By
              </Button>
            </div>

            {/* Scrollable table on small screens */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="text-[13px] font-semibold text-gray-600 uppercase tracking-wide bg-[#e8e4dc]">
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Deliverable</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliverableRows.length > 0 ? (
                    deliverableRows.map((row) => (
                      <TableRow key={row.deliverable.public_id} className="text-sm">
                        <TableCell>
                          <button
                            type="button"
                            className="text-left underline-offset-2 hover:underline cursor-pointer"
                            onClick={() => router.push(`/workspace/${row.campaignPublicId}`)}
                          >
                            {row.campaignName}
                          </button>
                        </TableCell>
                        <TableCell>{row.deliverable.deliverable_content}</TableCell>
                        <TableCell>{deliverableTypeLabel(row.deliverable.deliverable_type)}</TableCell>
                        <TableCell>{formatDueIn(row.deliverable.due_date)}</TableCell>
                        <TableCell>
                          <span className="text-purple-700 bg-purple-50 px-2 py-1 rounded text-xs font-medium">
                            {deliverableStatusLabel(row.deliverable.deliverable_status)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-6">
                        No ongoing deliverables.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}