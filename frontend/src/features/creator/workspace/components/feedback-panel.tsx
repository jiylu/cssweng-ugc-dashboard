import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/src/components/atoms/card"
import { Separator } from "@/components/ui/separator"

const MOCK_FEEDBACK = [
  {
    id: 1,
    name: "Client Name",
    comment: "text comment text comment text comment text comment text comment"
  }
]

export function FeedbackPanel() {
  return (
    <div className="w-64 shrink-0 flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {MOCK_FEEDBACK.map((feedback) => (
          <Card key={feedback.id} className="flex flex-col gap-2 p-4">
            <h2 className="text-xl font-normal text-foreground">Feedback</h2>
            <Separator />
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs bg-muted">CB</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">{feedback.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">{feedback.comment}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}