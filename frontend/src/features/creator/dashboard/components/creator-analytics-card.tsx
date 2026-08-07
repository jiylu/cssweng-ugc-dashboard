import { type LucideIcon } from "lucide-react";

export interface CreatorAnalyticsCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
}

export default function CreatorAnalyticsCard({ icon: Icon, label, value }: CreatorAnalyticsCardProps) {
  return (
    <div key={label} className="bg-white rounded-xs shadow-[0_1px_2px_rgba(0,0,0,0.08)] p-5 w-full h-full border border-solid border-[#d8d4cb]">
      <Icon size={28} className="text-gray-400" />
      <p className="text-[12px] text-gray-500 font-semibold tracking-widest mt-3 mb-1">{label}</p>
      <p className="text-2xl font-black text-gray-800">{value}</p>
    </div>
  )
}