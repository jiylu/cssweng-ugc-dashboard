"use client";

import NotificationsPanel from "./notifications-panel";
import { useAuth } from "@/src/features/auth/hooks/useAuth";

type ProfileProps = {
  firstName: string;
  lastName: string;
  email: string;
};

export default function Profile({ firstName, lastName, email }: ProfileProps) {
  const { user } = useAuth(false);
  const displayedFirstName = user?.first_name ?? firstName;
  const displayedLastName = user?.last_name ?? lastName;
  const displayedEmail = user?.email ?? email;

  return (
    <div className="flex items-center gap-8 pt-2">
      <NotificationsPanel />
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="inline-flex items-center justify-center text-xs font-medium text-[#6b1fa8] bg-[#6b1fa8]/10 px-2.5 py-1 rounded-full translate-y-[-2px]">
              <span className="-mb-[3px]">
                {user?.role === "CLIENT" ? "Client" : "Creator"}
              </span>
            </span>
            <p className="text-base leading-tight text-[#141518]">
              {displayedFirstName} {displayedLastName}
            </p>
          </div>
          <p className="text-sm text-[#7b7771]">{displayedEmail}</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user?.profile_picture_url || "/default-profile.png"}
          alt={`${displayedFirstName} ${displayedLastName}`.trim() || "Profile"}
          className="size-[46px] rounded-full object-cover"
          width={46}
          height={46}
        />
      </div>
    </div>
  );
}
