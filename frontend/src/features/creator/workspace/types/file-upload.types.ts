export type UploadStatus = "uploading" | "done"

export interface UploadedFile {
    id: string
    file: File
    filename: string
    status: UploadStatus
    progress: number
    previewUrl: string
}