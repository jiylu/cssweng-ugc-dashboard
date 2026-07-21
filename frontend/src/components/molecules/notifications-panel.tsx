"use client"

import { Bell } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger, PopoverHeader, PopoverTitle } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const notifications = [
  {
    id: "1",
    title: "Campaign Approved",
    message: "Your campaign \"Summer Drop\" has been approved.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    title: "New Comment",
    message: "New comment on your post from @janedoe.",
    time: "15 min ago",
    read: false,
  },
  {
    id: "3",
    title: "Payout Processed",
    message: "Your payout of ₱1,200 has been processed.",
    time: "1 hr ago",
    read: true,
  },
]

const unreadCount = notifications.filter((n) => !n.read).length

export default function NotificationsPanel() {
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
            <Badge variant="secondary" className="text-[10px]">
              {unreadCount} new
            </Badge>
          </div>
        </PopoverHeader>
        <Separator />
        <ul className="max-h-72 overflow-y-auto">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="flex gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground">{n.time}</p>
              </div>
              {!n.read && (
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#6b1fa8]" />
              )}
            </li>
          ))}
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
