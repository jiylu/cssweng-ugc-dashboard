"use client"
import { useRef } from "react"

interface FileDropzoneProps {
  onFileDrop: (files: FileList) => void
  accept?: string
  multiple?: boolean
}

export function FileDropzone({ onFileDrop, accept, multiple = true }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    if (e.dataTransfer.files.length) onFileDrop(e.dataTransfer.files)
  }

  function handleClick() {
    inputRef.current?.click()
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) onFileDrop(e.target.files)
    e.target.value = "" // allow re-selecting the same file later
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      className="border border-border rounded-[3px] flex flex-col items-center justify-center gap-2 py-10 cursor-pointer hover:bg-muted/30 transition-colors"
    >
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        className="hidden"
        onChange={handleInputChange}
      />
      <p className="text-sm text-muted-foreground">Choose a File</p>
      <p className="text-sm text-muted-foreground">or Drag a File here</p>
    </div>
  )
}