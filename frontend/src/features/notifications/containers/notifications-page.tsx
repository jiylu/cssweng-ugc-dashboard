"use client"

import { useState } from "react"
import { Bell, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import CreatorSidebar from "@/src/components/organisms/creator-sidebar"
import ClientSidebar from "@/src/features/client/dashboard/components/client-sidebar"
import Profile from "@/src/components/molecules/profile"
import { useAuth } from "@/src/features/auth/hooks/useAuth"
import { logoutUser } from "@/src/features/auth/services/auth-session"
import {
  useMarkNotificationRead,
  useNotifications,
} from "@/src/features/notifications/hooks/useNotifications"
import { getNotificationDestination } from "@/src/features/notifications/utils/notification-navigation"

export default function NotificationsPageContainer() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: notifications, isLoading } = useNotifications()
  const markRead = useMarkNotificationRead()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    if (isSigningOut) return
    setIsSigningOut(true)
    try {
      await logoutUser()
      queryClient.setQueryData(["auth-user"], null)
      queryClient.removeQueries({ queryKey: ["auth-user"] })
      router.replace("/login")
      router.refresh()
    } finally {
      setIsSigningOut(false)
    }
  }

  const handleOpen = async (
    notificationId: string,
    title: string,
    isRead: boolean,
  ) => {
    if (!isRead) await markRead.mutateAsync(notificationId)
    router.push(getNotificationDestination(title, user?.role === "CLIENT"))
  }

  if (loading || !user) return null

  const unreadCount = notifications?.filter((item) => !item.is_read).length ?? 0

  return (
    <main className="flex min-h-screen w-full overflow-hidden bg-[#f7f5ef]">
      {user.role === "CLIENT" ? (
        <ClientSidebar isSigningOut={isSigningOut} onSignOut={handleSignOut} />
      ) : (
        <CreatorSidebar />
      )}

      <section className="h-screen flex-1 overflow-y-auto px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 flex items-start justify-between gap-6 border-b border-[#d8d4cb] pb-6">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <Bell className="size-7 text-[#6b1fa8]" />
                <h1 className="text-4xl font-normal text-[#141518]">
                  Notifications
                </h1>
              </div>
              <p className="text-sm text-[#6f6b65]">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                  : "You’re all caught up."}
              </p>
            </div>
            <Profile
              firstName={user.first_name}
              lastName={user.last_name}
              email={user.email}
            />
          </header>

          <div className="overflow-hidden rounded-md border border-[#d8d4cb] bg-white">
            {isLoading ? (
              <div className="flex min-h-48 items-center justify-center">
                <Loader2 className="size-7 animate-spin text-[#6b1fa8]" />
              </div>
            ) : notifications && notifications.length > 0 ? (
              <ul className="divide-y divide-[#e3dfd7]">
                {notifications.map((notification) => (
                  <li key={notification.public_id}>
                    <button
                      type="button"
                      disabled={markRead.isPending}
                      onClick={() =>
                        handleOpen(
                          notification.public_id,
                          notification.title,
                          notification.is_read,
                        )
                      }
                      className={`flex w-full cursor-pointer items-start gap-4 px-6 py-5 text-left transition-colors hover:bg-[#f7f0fc] disabled:cursor-wait ${
                        notification.is_read ? "bg-white" : "bg-[#fbf8fd]"
                      }`}
                    >
                      <span
                        className={`mt-2 size-2.5 shrink-0 rounded-full ${
                          notification.is_read ? "bg-transparent" : "bg-[#6b1fa8]"
                        }`}
                        aria-label={notification.is_read ? "Read" : "Unread"}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-base font-medium text-[#141518]">
                          {notification.title}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-[#6f6b65]">
                          {notification.message}
                        </span>
                        <time className="mt-2 block text-xs text-[#8a857e]">
                          {new Date(notification.created_at).toLocaleString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </time>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                <Bell className="mb-3 size-10 text-[#aaa59d]" />
                <h2 className="text-lg font-medium text-[#141518]">
                  No notifications yet
                </h2>
                <p className="mt-1 text-sm text-[#6f6b65]">
                  Updates about proposals, campaigns, and deliverables will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
