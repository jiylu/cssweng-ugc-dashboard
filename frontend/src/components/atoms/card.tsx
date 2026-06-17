import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white border border-border rounded p-5.5 flex flex-col gap-6 transition-[border-color,box-shadow] duration-300", className)}>
      {children}
    </div>
  )
}