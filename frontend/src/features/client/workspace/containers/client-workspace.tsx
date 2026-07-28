"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  History,
  Play,
  ReceiptText,
  UploadCloud,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import LogoLoader from "@/src/components/molecules/logo-loader";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { logoutUser } from "@/src/features/auth/services/auth-session";
import ClientSidebar from "@/src/features/client/dashboard/components/client-sidebar";
import { useCampaignSetup } from "@/src/features/creator/workspace/hooks/useCampaignSetup";

const STEPS = [
  "Contract Signing",
  "Script Drafting",
  "Video Submission",
  "Invoicing",
  "Completion",
] as const;

const FALLBACK_DELIVERABLES = [
  { deliverable_id: "instagram-reel", deliverable_content: "Instagram Reel", due_date: "2026-07-02" },
  { deliverable_id: "ugc-video", deliverable_content: "UGC Video", due_date: "2026-07-05" },
];

function formatDueDate(value?: string) {
  if (!value) return "Date to be confirmed";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function Progress({ activeStep, onChange }: { activeStep: number; onChange: (step: number) => void }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="mb-5 text-lg text-[#141518]">Campaign Progress</p>
      <div className="flex items-start">
        {STEPS.map((step, index) => (
          <div key={step} className={cn("flex items-start", index < STEPS.length - 1 && "flex-1")}>
            <button type="button" className="group flex shrink-0 flex-col items-center gap-2" onClick={() => onChange(index)}>
              <span
                className={cn(
                  "size-5 rounded-[4px] border-2 transition-transform group-hover:scale-110",
                  index < activeStep && "border-[#1f8a4a] bg-[#1f8a4a]",
                  index === activeStep && "border-[#6b1fa8] bg-[#6b1fa8]",
                  index > activeStep && "border-[#bcb9b2] bg-[#bcb9b2]",
                )}
              />
              <span className={cn("whitespace-nowrap text-[10px] text-[#6f6a63]", index === activeStep && "text-[#6b1fa8]")}>{step}</span>
            </button>
            {index < STEPS.length - 1 && (
              <span className={cn("mt-[9px] h-[2px] min-w-8 flex-1 bg-[#bcb9b2]", index < activeStep && "bg-[#1f8a4a]")} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MediaPreview({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex min-h-[260px] w-full items-center justify-center border border-[#d8d4cb] bg-white"
      aria-label="Preview submitted video"
    >
      <span className="flex size-16 items-center justify-center rounded-full border-[4px] border-[#141518] transition-transform group-hover:scale-105">
        <Play className="ml-1 size-8 fill-[#141518]" />
      </span>
    </button>
  );
}

function AssetPanel({ activeStep, onHistory, onPreview }: { activeStep: number; onHistory: () => void; onPreview: () => void }) {
  const isWritten = activeStep <= 1;

  return (
    <section className="min-h-[410px] min-w-0 flex-1 rounded border border-[#d8d4cb] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-4 border-b border-[#d8d4cb] pb-3">
        <h2 className="text-2xl text-[#141518]">{isWritten ? "Written Assets" : "Video"}</h2>
        <div className="flex items-center gap-3 text-sm text-[#6f6a63]">
          <span>Version 2</span>
          <Button variant="outline" className="h-9 rounded border-[#6b1fa8] px-5 font-normal" onClick={onHistory}>
            <History className="mr-2 size-4" /> History
          </Button>
        </div>
      </div>
      {isWritten ? (
        <p className="pt-7 text-sm italic leading-6 text-[#77736d]">
          Review the creator&apos;s submitted script here. The latest written draft will appear in this area once it has been submitted for approval.
        </p>
      ) : (
        <div className="pt-5"><MediaPreview onOpen={onPreview} /></div>
      )}
    </section>
  );
}

function FeedbackActions() {
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<"accepted" | "revision" | null>(null);

  return (
    <aside className="w-[250px] shrink-0 rounded border border-[#d8d4cb] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <h2 className="border-b border-[#d8d4cb] pb-2 text-lg">Feedback</h2>
      <Textarea
        value={feedback}
        onChange={(event) => setFeedback(event.target.value)}
        placeholder="Type feedback here ..."
        className="mt-4 min-h-[120px] resize-none rounded border-[#77736d] text-sm focus-visible:ring-[#6b1fa8]"
      />
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button className="rounded bg-[#6b1fa8] font-normal hover:bg-[#551783]" onClick={() => setStatus("accepted")}>
          Accept
        </Button>
        <Button variant="secondary" className="rounded font-normal" onClick={() => setStatus("revision")}>
          Revise
        </Button>
      </div>
      {status && (
        <p className="mt-4 flex items-center gap-2 text-xs text-[#6f6a63]" role="status">
          <Check className="size-4 text-[#1f8a4a]" />
          {status === "accepted" ? "Deliverable accepted." : "Revision requested."}
        </p>
      )}
    </aside>
  );
}

function InvoicePanel() {
  return (
    <section className="flex min-h-[350px] flex-1 flex-col rounded border border-[#d8d4cb] bg-white p-7">
      <h2 className="border-b border-[#d8d4cb] pb-3 text-2xl">Invoice Details</h2>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <ReceiptText className="size-12 text-[#6b1fa8]" strokeWidth={1.6} />
        <p className="mt-4 max-w-lg text-sm leading-5 text-[#44403b]">
          The final itemized breakdown of services, fees, and pay-outs is available for review. Once payment is confirmed, upload the proof of payment here.
        </p>
        <Button className="mt-5 rounded bg-[#6b1fa8] font-normal hover:bg-[#551783]">
          View Invoice <FileText className="ml-2 size-4" />
        </Button>
        <Button className="mt-3 rounded bg-[#6b1fa8] font-normal hover:bg-[#551783]">
          Upload Proof of Payment <UploadCloud className="ml-2 size-4" />
        </Button>
      </div>
    </section>
  );
}

export default function ClientWorkspace({ campaignId }: { campaignId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();
  const { data, isLoading: campaignLoading } = useCampaignSetup(campaignId);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [activeDeliverable, setActiveDeliverable] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const deliverables = useMemo(
    () => (data?.deliverables?.length ? data.deliverables : FALLBACK_DELIVERABLES),
    [data?.deliverables],
  );

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await logoutUser();
      queryClient.setQueryData(["auth-user"], null);
      router.replace("/login");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  };

  if (loading || campaignLoading) return <LogoLoader label="Loading client workspace" />;
  if (!user) return null;

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#f2f0ea]">
      <ClientSidebar isSigningOut={isSigningOut} onSignOut={handleSignOut} />
      <section className="flex-1 overflow-y-auto px-8 py-8">
        <header className="flex items-center justify-between border-b border-[#d8d4cb] pb-3">
          <h1 className="text-[52px] font-normal leading-none text-[#141518]">Workspace</h1>
          <div className="flex items-center gap-5">
            <button type="button" aria-label="Notifications"><Bell className="size-8 text-[#77736d]" /></button>
            <Image src="/default-profile.png" alt="" width={46} height={46} className="size-[46px] rounded-full" />
          </div>
        </header>

        <div className="mt-4 flex gap-12">
          <div className="w-44 shrink-0">
            <h2 className="text-lg text-[#141518]">{data?.campaign?.project_name ?? "Campaign Name"}</h2>
            <p className="mt-3 text-sm text-[#44403b]">{data?.campaign?.description ?? "Campaign Overview"}</p>
          </div>
          <Progress activeStep={activeStep} onChange={setActiveStep} />
        </div>

        <div className="mt-20 flex items-start gap-10">
          <aside className="w-[250px] shrink-0">
            <h2 className="border-b border-[#d8d4cb] pb-2 text-2xl">Deliverables</h2>
            <div className="mt-3 space-y-5">
              {deliverables.map((deliverable, index) => (
                <button
                  key={deliverable.deliverable_id}
                  type="button"
                  onClick={() => setActiveDeliverable(index)}
                  className={cn(
                    "w-full rounded border border-transparent bg-white p-4 text-left transition-colors",
                    activeDeliverable === index && "bg-[#6b1fa8] text-white",
                  )}
                >
                  <span className="flex items-start justify-between gap-2">
                    <strong className="text-base">{deliverable.deliverable_content}</strong>
                    <span className={cn("rounded bg-[#6b1fa8] px-2 py-1 text-[8px] text-white", activeDeliverable === index && "bg-white/20")}>{activeStep < 2 ? "SCRIPT DRAFTING" : "VIDEO DRAFTING"}</span>
                  </span>
                  <span className="mt-3 block text-sm">Due: {formatDueDate(deliverable.due_date)}</span>
                </button>
              ))}
            </div>
          </aside>

          {activeStep === 3 ? (
            <InvoicePanel />
          ) : (
            <div className="flex min-w-0 flex-1 gap-6">
              <AssetPanel activeStep={activeStep} onHistory={() => setHistoryOpen(true)} onPreview={() => setPreviewOpen(true)} />
              <FeedbackActions />
            </div>
          )}
        </div>
      </section>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent showCloseButton={false} className="max-h-[90vh] !max-w-4xl overflow-y-auto border-[#d8d4cb] bg-[#f2f0ea] p-8">
          <div className="flex items-center justify-between"><DialogTitle className="text-3xl font-normal">Preview</DialogTitle><button onClick={() => setPreviewOpen(false)}><X /></button></div>
          <div className="mx-auto mt-5 w-full max-w-3xl rounded border border-[#d8d4cb] bg-white p-5">
            <p className="mb-3 text-xl">file.mp4</p><MediaPreview onOpen={() => undefined} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent showCloseButton={false} className="max-h-[90vh] !max-w-5xl overflow-y-auto border-[#d8d4cb] bg-[#f2f0ea] p-8">
          <div className="flex items-center justify-between"><div className="flex items-baseline gap-8"><DialogTitle className="text-3xl font-normal">Version 2</DialogTitle><span className="text-sm text-[#6f6a63]">DD/MM/YYYY HH:MM</span></div><button onClick={() => setHistoryOpen(false)}><X /></button></div>
          <div className="mt-5 grid grid-cols-[1.35fr_1fr] gap-7">
            <section className="rounded border border-[#d8d4cb] bg-white p-6"><h3 className="border-b pb-3 text-2xl">{activeStep <= 1 ? "Written Assets" : "Media Assets"}</h3>{activeStep <= 1 ? <div className="mt-5 min-h-[320px] rounded border p-5 text-sm">Draft submission</div> : <div className="mt-5"><MediaPreview onOpen={() => undefined} /><div className="mt-4 flex items-center justify-between border p-3"><ChevronLeft className="size-5" /><span>file.mp4</span><ChevronRight className="size-5" /></div></div>}</section>
            <section className="rounded border border-[#d8d4cb] bg-white p-6"><h3 className="border-b pb-3 text-2xl">Feedback</h3><div className="mt-5 rounded border p-5"><p className="font-medium">Client Name</p><p className="mt-1 text-xs text-[#77736d]">4:38 PM June 30, 2026</p><p className="mt-5 text-sm leading-6">Feedback for this version will appear here.</p></div></section>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
