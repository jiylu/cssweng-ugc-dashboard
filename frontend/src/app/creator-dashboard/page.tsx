"use client"
// Local
import { useAuth } from "../hooks/useAuth";
// Shadecn
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import CreatorDashboard from '@/src/features/creator/dashboard/containers/creator-dashboard';

export default function Dashboard() {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex mt-5 justify-center">
      <Badge variant="outline">
        <Spinner data-icon="inline-start" />
        Loading...
      </Badge>
    </div>
  );

  if (!user) return null;

  return (
    <CreatorDashboard />
  )
}