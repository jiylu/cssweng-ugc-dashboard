"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { UploadedFile } from "../types/file-upload.types"

// TODO: swap the setInterval simulation for a real upload call once the
// backend endpoint exists — the public API of this hook (files, addFiles,
// removeFile) shouldn't need to change when that happens.
export function useFileUploads() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const intervalsRef = useRef<Map<string, ReturnType<typeof setInterval>>>(
    new Map()
  )

  // clean up any running "upload" intervals if the component unmounts
  useEffect(() => {
    return () => {
      intervalsRef.current.forEach((interval) => clearInterval(interval))
      intervalsRef.current.clear()
    }
  }, [])

  const simulateUpload = useCallback((id: string) => {
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.id !== id || f.status === "done") return f

          const nextProgress = Math.min(
            f.progress + Math.random() * 20 + 10,
            100
          )
          const isDone = nextProgress >= 100

          if (isDone) {
            const existingInterval = intervalsRef.current.get(id)
            if (existingInterval) {
              clearInterval(existingInterval)
              intervalsRef.current.delete(id)
            }
          }

          return {
            ...f,
            progress: nextProgress,
            status: isDone ? "done" : "uploading",
          }
        })
      )
    }, 400)

    intervalsRef.current.set(id, interval)
  }, [])

  const addFiles = useCallback(
    (fileList: FileList | File[]) => {
      const newFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
        id: crypto.randomUUID(),
        file,
        filename: file.name,
        status: "uploading",
        progress: 0,
        previewUrl: URL.createObjectURL(file),
      }))

      setFiles((prev) => [...prev, ...newFiles])
      newFiles.forEach((f) => simulateUpload(f.id))
    },
    [simulateUpload]
  )

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id)
      if (target) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((f) => f.id !== id)
    })

    const interval = intervalsRef.current.get(id)
    if (interval) {
      clearInterval(interval)
      intervalsRef.current.delete(id)
    }
  }, [])

  const clearFiles = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((f) => URL.revokeObjectURL(f.previewUrl))
      return []
    })
    intervalsRef.current.forEach((interval) => clearInterval(interval))
    intervalsRef.current.clear()
  }, [])

  return { files, addFiles, removeFile, clearFiles }
}