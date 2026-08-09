import * as React from "react"
import SignatureCanvas from "react-signature-canvas"
import { cn } from "@/lib/utils"

function Corner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={cn("absolute w-3 h-3 text-primary", className)}
    >
      <path d="M0 0 L0 12 M0 0 L12 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

interface SignatureFieldProps {
  label: string
  id?: string
  penColor?: string
  height?: number
  className?: string
  onChange?: (dataUrl: string) => void
}

export default function SignatureField({
  label,
  id,
  penColor = "#78746e",
  height = 80,
  className,
  onChange,
}: SignatureFieldProps) {
  const sigRef = React.useRef<SignatureCanvas>(null)
  const canvasContainerRef = React.useRef<HTMLDivElement>(null)
  const [canvasWidth, setCanvasWidth] = React.useState(0)

  React.useLayoutEffect(() => {
    const container = canvasContainerRef.current
    if (!container) return

    const updateCanvasWidth = () => {
      setCanvasWidth(Math.max(1, Math.floor(container.getBoundingClientRect().width)))
    }

    updateCanvasWidth()
    const observer = new ResizeObserver(updateCanvasWidth)
    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  return (
    <div className={cn("relative", className)}>
      <span className="mb-1 block text-xs font-medium text-foreground">
        {label}
      </span>

      <div className="relative pb-4">
        <Corner className="top-0 left-0" />
        <Corner className="top-0 right-0 rotate-90" />
        <Corner className="bottom-0 left-0 -rotate-90" />
        <Corner className="bottom-0 right-0 rotate-180" />

        <div ref={canvasContainerRef} className="w-full overflow-hidden">
          {canvasWidth > 0 && (
            <SignatureCanvas
              ref={sigRef}
              penColor={penColor}
              canvasProps={{
                width: canvasWidth,
                height,
                className: "block w-full cursor-crosshair touch-none bg-white/50",
                "aria-label": label,
              }}
              onEnd={() => onChange?.(sigRef.current?.toDataURL("image/png") ?? "")}
            />
          )}
        </div>

        {id && (
          <p className="absolute bottom-0.5 left-0 truncate text-[10px] text-muted-foreground">
            {id}
          </p>
        )}
      </div>
    </div>
  )
}
