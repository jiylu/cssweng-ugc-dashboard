interface WrittenAssetPreviewProps {
  content: string
}

export function WrittenAssetPreview({ content }: WrittenAssetPreviewProps) {
  return (
    <div
      className="min-h-[156px] rounded-md border bg-slate-50 py-2 px-3 [&_p]:my-1 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_ul]:list-disc [&_ul]:ml-3 [&_ol]:list-decimal [&_ol]:ml-3 [&_blockquote]:border-l-4 [&_blockquote]:border-muted [&_blockquote]:pl-2 [&_blockquote]:italic [&_code]:bg-muted [&_code]:rounded [&_code]:px-1"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
