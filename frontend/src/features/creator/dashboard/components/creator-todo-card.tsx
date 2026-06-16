import Button from "@/src/components/atoms/button";

export interface CreatorTodoCardInterface {
  campaignName: string;
  message: string;
}

export default function CreatorTodoCard({ campaignName, message }: CreatorTodoCardInterface) {
  return (
    <div className="bg-white rounded-xs shadow-[0_1px_2px_rgba(0,0,0,0.08)] p-6 w-full h-full max-w-xs border-l-4 border-l-purple-600">
      <p className="font-semibold text-gray-800 mb-1">{campaignName}</p>
      <p className="text-sm text-gray-500 mb-3">{message}</p>
      <Button size="sm">
        Follow up
      </Button>
    </div>
  )
}