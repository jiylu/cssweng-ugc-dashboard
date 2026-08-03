import Button from "@/src/components/atoms/button";

export interface CreatorTodoCardInterface {
  campaignName: string;
  message: string;
}

export default function CreatorTodoCard({ campaignName, message }: CreatorTodoCardInterface) {
  return (
    <div className="bg-white rounded-xs shadow-[0_1px_2px_rgba(0,0,0,0.08)] p-5 w-full h-full max-w-xs border border-solid border-[#d8d4cb] border-l-4 border-l-[#6b1fa8]">
      <p className="text-[18px] font-black text-gray-800 mb-1">{campaignName}</p>
      <p className="text-sm text-gray-500 mb-3">{message}</p>
      <Button size="md">
        Follow Up
      </Button>
    </div>
  )
}