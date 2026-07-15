interface FileDropzoneProps {
  onFileDrop?: (files: FileList) => void
}

export function FileDropzone({ onFileDrop }: FileDropzoneProps) {
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    if (onFileDrop) onFileDrop(e.dataTransfer.files)
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="border border-border rounded-[3px] flex flex-col items-center justify-center gap-2 py-10 cursor-pointer hover:bg-muted/30 transition-colors"
    >
      <p className="text-sm text-muted-foreground">Choose a File</p>
      <p className="text-sm text-muted-foreground">or Drag a File here</p>
    </div>
  )
}