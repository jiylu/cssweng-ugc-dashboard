"use client"

import { Bell } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger, PopoverHeader, PopoverTitle } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { useNotifications, useMarkNotificationRead } from "@/src/features/notifications/hooks/useNotifications"

const NOTIFICATION_LIMIT = 10

export default function NotificationsPanel() {
  const { data: notifications, isLoading } = useNotifications(NOTIFICATION_LIMIT)
  const markRead = useMarkNotificationRead()

  const unreadCount = notifications?.filter((n) => !n.is_read).length ?? 0

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative text-[#77736d] transition hover:text-[#141518]"
          aria-label="Notifications"
        >
          <Bell className="size-8" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#6b1fa8] text-[10px] font-medium text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        <PopoverHeader className="px-4 py-3">
          <div className="flex items-center justify-between">
            <PopoverTitle className="text-sm">Notifications</PopoverTitle>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px]">
                {unreadCount} new
              </Badge>
            )}
          </div>
        </PopoverHeader>
        <Separator />
        <ul className="max-h-72 overflow-y-auto">
          {isLoading ? (
            <li className="flex items-center justify-center py-8">
              <Spinner />
            </li>
          ) : notifications && notifications.length > 0 ? (
            notifications.map((n) => (
              <li
                key={n.public_id}
                className="flex gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{n.title}</p>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(n.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {!n.is_read && (
                  <button
                    type="button"
                    className="mt-1.5 size-2 shrink-0 rounded-full bg-[#6b1fa8] hover:ring-2 hover:ring-[#6b1fa8]/30"
                    aria-label="Mark as read"
                    onClick={() => markRead.mutate(n.public_id)}
                  />
                )}
              </li>
            ))
          ) : (
            <li className="py-8 text-center text-sm text-muted-foreground">
              No notifications yet.
            </li>
          )}
        </ul>
        <Separator />
        <div className="px-4 py-2 text-center">
          <button
            type="button"
            className="text-xs font-medium text-[#6b1fa8] hover:underline"
          >
            View all notifications
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
