import { Bell } from "lucide-react";
import type { AuthUser } from "@/src/features/auth/schemas/auth-user.schema";

interface ClientDashboardHeaderProps {
  user: AuthUser;
}

export default function ClientDashboardHeader({
  user,
}: ClientDashboardHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-8">
      <div>
        <h1 className="text-[64px] font-bold leading-tight text-[#141518]">
          Welcome back, {user.first_name}
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
            <p className="text-base leading-tight text-[#141518]">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-sm text-[#7b7771]">{user.email}</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.profile_picture_url || "/default-profile.png"}
            alt={`${user.first_name} ${user.last_name}`.trim() || "Profile"}
            width={46}
            height={46}
            className="size-[46px] rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
