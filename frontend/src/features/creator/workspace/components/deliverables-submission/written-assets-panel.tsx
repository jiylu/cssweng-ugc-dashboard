import { Button } from "@/components/ui/button"
import { Card } from "@/src/components/atoms/card"
import { Separator } from "@/components/ui/separator"
import { useWrittenAssetsPanel } from "@/src/features/creator/workspace/hooks/useWrittenAssetsPanel"
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Textarea } from "@/components/ui/textarea"

interface WrittenAssetsPanelProps {
  version: number
  onSaveDraft: () => void
  onSubmit: (content: string) => void
  onHistory: () => void
}

export function WrittenAssetsPanel({ version, onSaveDraft, onSubmit, onHistory }: WrittenAssetsPanelProps) {
  const { content, errors, updateContent, validateAndSave } = useWrittenAssetsPanel()

  return (
    <Card className="flex-1 border border-[#6b1fa8] p-5 flex flex-col gap-4 min-w-0">
      <div className="flex items-center justify-between">
        <h2 className="text-xl text-foreground">Written Assets</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Version {version}</span>
          <Button variant="outline" className="rounded-[3px]" size="sm" onClick={onHistory}>History</Button>
        </div>
      </div>

      <Separator />

      <RichTextEditor content={content} onChange={updateContent} />

      <p className="text-xs mt-1 text-[#ff6467] min-h-[16px]">{errors.content ?? ""}</p>

      {/* <Textarea
        placeholder="Type here..."
        className="flex-1 min-h-[300px] resize-none border border-[#6b1fa8] rounded-[3px] bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-0 p-4"
      /> */}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onSaveDraft}>Save Draft</Button>
        <Button onClick={() => validateAndSave(onSubmit)} className="bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white">Submit</Button>
      </div>
    </Card>
  )
}