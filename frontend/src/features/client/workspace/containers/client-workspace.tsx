"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Check,
  FileText,
  History,
  Loader2,
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
import { ClientDeliverablesSidebar } from "@/src/features/client/workspace/components/client-deliverables-sidebar";
import { ClientWorkspaceHeader } from "@/src/features/client/workspace/components/client-workspace-header";
import { HistoryOverlay } from "@/src/features/creator/workspace/components/deliverables-submission/history-overlay";
import { useCampaignSetup } from "@/src/features/creator/workspace/hooks/useCampaignSetup";
import { useDeliverableItems } from "@/src/features/client/workspace/hooks/useDeliverableItems";
import {
  useLatestWrittenAsset,
  useLatestMediaAsset,
} from "@/src/features/client/workspace/hooks/useLatestAsset";
import {
  approveWrittenAsset,
  reviseWrittenAsset,
  approveMediaAsset,
  reviseMediaAsset,
  type WrittenAsset,
  type MediaAsset,
} from "@/src/features/client/workspace/services/deliverable-submissions-api";
import {
  getPaymentForCampaign,
  uploadPaymentProof,
} from "@/src/features/client/workspace/services/payments-api";

const STEPS = [
  "Contract Signing",
  "Deliverable Submission",
  "Invoicing",
  "Completion",
] as const;

// ── Progress Bar ───────────────────────────────────────────────────────────────

function Progress({
  activeStep,
  onChange,
}: {
  activeStep: number;
  onChange: (step: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">Campaign Progress</p>
      <div className="flex items-center">
        {STEPS.map((step, index) => (
          <div
            key={step}
            className={cn(
              "flex items-center",
            )}
          >
            <button
              type="button"
              disabled={index < activeStep}
              className={cn(
                "group flex flex-col items-center gap-1",
                index < activeStep ? "cursor-default" : "cursor-pointer",
              )}
              onClick={() => onChange(index)}
            >
              <span
                className={cn(
                  "size-5 rounded-[3px] border-2 transition-colors",
                  index < activeStep
                    ? "border-[#2d7a3a] bg-[#2d7a3a]"
                    : index === activeStep
                      ? "border-[#6b1fa8] bg-[#6b1fa8]"
                      : "border-border bg-transparent",
                )}
              />
              <span
                className={cn(
                  "whitespace-nowrap text-[11px]",
                  index === activeStep
                    ? "text-[#6b1fa8]"
                    : "text-muted-foreground",
                )}
              >
                {step}
              </span>
            </button>
            {index < STEPS.length - 1 && (
              <span
                className={cn(
                  "mx-1 mb-4 h-px w-24",
                  index < activeStep ? "bg-[#2d7a3a]" : "bg-border",
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Media Preview ──────────────────────────────────────────────────────────────

function MediaPreview({
  onOpen,
  contentUrl,
}: {
  onOpen: () => void;
  contentUrl?: string;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex min-h-[260px] w-full items-center justify-center border border-[#d8d4cb] bg-white"
      aria-label="Preview submitted video"
    >
      {contentUrl ? (
        <video
          src={contentUrl}
          className="max-h-[260px] w-full object-contain"
        />
      ) : (
        <span className="flex size-16 items-center justify-center rounded-full border-[4px] border-[#141518] transition-transform group-hover:scale-105">
          <Play className="ml-1 size-8 fill-[#141518]" />
        </span>
      )}
    </button>
  );
}

// ── Written Asset Panel (Wired) ────────────────────────────────────────────────

const RICH_TEXT_TAGS = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "s", "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "blockquote", "mark", "img",
]);

function getSafeAttribute(attributes: string, name: string) {
  const match = attributes.match(
    new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"),
  );
  return match?.[1] ?? match?.[2] ?? "";
}

function escapeAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function sanitizeRichText(content: string) {
  return content
    .replace(/<(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<\/?([a-z0-9]+)((?:\s[^>]*)?)\s*\/?>/gi, (tag, name: string, attributes: string) => {
      const normalizedName = name.toLowerCase();
      if (!RICH_TEXT_TAGS.has(normalizedName)) return "";
      if (tag.startsWith("</")) return `</${normalizedName}>`;

      if (normalizedName === "img") {
        const src = getSafeAttribute(attributes, "src");
        const isSafeSource =
          /^https?:\/\//i.test(src) ||
          /^data:image\/(?:png|jpe?g|gif|webp);base64,/i.test(src);
        if (!isSafeSource) return "";

        const alt = getSafeAttribute(attributes, "alt");
        return `<img src="${escapeAttribute(src)}" alt="${escapeAttribute(alt)}">`;
      }

      if (["p", "h1", "h2", "h3", "h4"].includes(normalizedName)) {
        const style = getSafeAttribute(attributes, "style");
        const alignment = style.match(/text-align:\s*(left|center|right|justify)/i)?.[1];
        if (alignment) {
          return `<${normalizedName} style="text-align: ${alignment.toLowerCase()}">`;
        }
      }

      if (normalizedName === "ul") return '<ul class="list-disc ml-3">';
      if (normalizedName === "ol") return '<ol class="list-decimal ml-3">';

      return `<${normalizedName}>`;
    });
}

function WrittenAssetPanel({
  asset,
  isLoading,
  onHistory,
}: {
  asset: WrittenAsset | null | undefined;
  isLoading: boolean;
  onHistory: () => void;
}) {
  return (
    <section className="min-h-[410px] min-w-0 flex-1 rounded border border-[#d8d4cb] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-4 border-b border-[#d8d4cb] pb-3">
        <h2 className="text-2xl text-[#141518]">Written Assets</h2>
        <div className="flex items-center gap-3 text-sm text-[#6f6a63]">
          {asset && <span>Version {asset.version_number}</span>}
          <Button
            variant="outline"
            className="h-9 rounded border-[#6b1fa8] px-5 font-normal"
            onClick={onHistory}
          >
            <History className="mr-2 size-4" /> History
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center pt-20">
          <Loader2 className="size-8 animate-spin text-[#6b1fa8]" />
        </div>
      ) : asset ? (
        <div className="pt-5">
          <div
            className="prose prose-sm min-h-[200px] max-w-none rounded border border-[#d8d4cb] p-5 leading-6 text-[#44403b] [&_img]:my-4 [&_img]:max-h-[480px] [&_img]:max-w-full [&_img]:rounded [&_img]:object-contain [&_mark]:bg-yellow-200"
            dangerouslySetInnerHTML={{ __html: sanitizeRichText(asset.content) }}
          />
          {asset.client_comments && (
            <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs font-medium text-amber-800">
                Previous Feedback:
              </p>
              <p className="mt-1 text-sm text-amber-700">
                {asset.client_comments}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="pt-7 text-sm italic leading-6 text-[#77736d]">
          The creator has not submitted a script yet. The latest written draft
          will appear here once it has been submitted for approval.
        </p>
      )}
    </section>
  );
}

// ── Media Asset Panel (Wired) ──────────────────────────────────────────────────

function MediaAssetPanel({
  asset,
  isLoading,
  onHistory,
  onPreview,
}: {
  asset: MediaAsset | null | undefined;
  isLoading: boolean;
  onHistory: () => void;
  onPreview: () => void;
}) {
  return (
    <section className="min-h-[410px] min-w-0 flex-1 rounded border border-[#d8d4cb] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-4 border-b border-[#d8d4cb] pb-3">
        <h2 className="text-2xl text-[#141518]">Video</h2>
        <div className="flex items-center gap-3 text-sm text-[#6f6a63]">
          {asset && <span>Version {asset.version_number}</span>}
          <Button
            variant="outline"
            className="h-9 rounded border-[#6b1fa8] px-5 font-normal"
            onClick={onHistory}
          >
            <History className="mr-2 size-4" /> History
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center pt-20">
          <Loader2 className="size-8 animate-spin text-[#6b1fa8]" />
        </div>
      ) : asset ? (
        <div className="pt-5">
          <MediaPreview onOpen={onPreview} contentUrl={asset.content_url} />
          {asset.client_comments && (
            <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs font-medium text-amber-800">
                Previous Feedback:
              </p>
              <p className="mt-1 text-sm text-amber-700">
                {asset.client_comments}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="pt-7 text-sm italic leading-6 text-[#77736d]">
          The creator has not submitted a video yet. The latest media submission
          will appear here once it has been uploaded for approval.
        </p>
      )}
    </section>
  );
}

// ── Feedback Actions (Wired) ───────────────────────────────────────────────────

function FeedbackActions({
  submissionStep,
  writtenAssetPublicId,
  mediaAssetPublicId,
  writtenAssetAction,
  mediaAssetAction,
  onMutationSuccess,
}: {
  submissionStep: number;
  writtenAssetPublicId: string | undefined;
  mediaAssetPublicId: string | undefined;
  writtenAssetAction: string | undefined;
  mediaAssetAction: string | undefined;
  onMutationSuccess: () => void;
}) {
  const [feedback, setFeedback] = useState("");
  const isWrittenStep = submissionStep === 0;
  const currentAssetPublicId = isWrittenStep
    ? writtenAssetPublicId
    : mediaAssetPublicId;
  const currentAction = isWrittenStep ? writtenAssetAction : mediaAssetAction;
  const isAlreadyApproved = currentAction === "APPROVE";

  const approveMutation = useMutation({
    mutationFn: () => {
      if (!currentAssetPublicId) throw new Error("No asset to approve.");
      return isWrittenStep
        ? approveWrittenAsset(currentAssetPublicId)
        : approveMediaAsset(currentAssetPublicId);
    },
    onSuccess: () => {
      toast.success(
        isWrittenStep
          ? "Script approved successfully."
          : "Video approved successfully.",
      );
      setFeedback("");
      onMutationSuccess();
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "Unable to approve.",
      ),
  });

  const reviseMutation = useMutation({
    mutationFn: () => {
      if (!currentAssetPublicId) throw new Error("No asset to revise.");
      return isWrittenStep
        ? reviseWrittenAsset(currentAssetPublicId, feedback)
        : reviseMediaAsset(currentAssetPublicId, feedback);
    },
    onSuccess: () => {
      toast.success("Revision requested successfully.");
      setFeedback("");
      onMutationSuccess();
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "Unable to request revision.",
      ),
  });

  const isPending = approveMutation.isPending || reviseMutation.isPending;
  const canRevise =
    feedback.trim().length >= 30 && feedback.trim().length <= 500;

  return (
    <aside className="w-[250px] shrink-0 rounded border border-[#d8d4cb] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <h2 className="border-b border-[#d8d4cb] pb-2 text-lg">Feedback</h2>

      {isAlreadyApproved ? (
        <div className="mt-4 flex flex-col items-center gap-2 text-center">
          <Check className="size-8 text-[#1f8a4a]" />
          <p className="text-sm text-[#6f6a63]">
            {isWrittenStep
              ? "Script has been approved."
              : "Video has been approved."}
          </p>
        </div>
      ) : !currentAssetPublicId ? (
        <p className="mt-4 text-sm italic text-[#77736d]">
          Waiting for the creator to submit{" "}
          {isWrittenStep ? "a script" : "a video"} before you can review.
        </p>
      ) : (
        <>
          <Textarea
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            placeholder="Type feedback here ..."
            className="mt-4 min-h-[120px] resize-none rounded border-[#77736d] text-sm focus-visible:ring-[#6b1fa8]"
            disabled={isPending}
          />
          <p
            className={cn(
              "mt-1 text-xs",
              feedback.length > 0 && feedback.length < 30
                ? "text-red-500"
                : "text-[#6f6a63]",
            )}
          >
            {feedback.length}/500{" "}
            {feedback.length > 0 && feedback.length < 30 && "(min 30 chars)"}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              className="rounded bg-[#6b1fa8] font-normal hover:bg-[#551783]"
              onClick={() => approveMutation.mutate()}
              disabled={isPending}
            >
              {approveMutation.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : null}
              Accept
            </Button>
            <Button
              variant="secondary"
              className="rounded font-normal"
              onClick={() => reviseMutation.mutate()}
              disabled={isPending || !canRevise}
            >
              {reviseMutation.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : null}
              Revise
            </Button>
          </div>
        </>
      )}
    </aside>
  );
}

// ── Contract Signing Placeholder ───────────────────────────────────────────────

function ContractSigningPlaceholder() {
  return (
    <section className="flex min-h-[350px] flex-1 flex-col items-center justify-center rounded border border-[#d8d4cb] bg-white p-7 text-center">
      <FileText className="size-12 text-[#6b1fa8]" strokeWidth={1.6} />
      <p className="mt-4 max-w-lg text-sm leading-5 text-[#44403b]">
        The contract for this campaign needs to be reviewed and signed. Please
        check your proposal invitation or visit the contract review page.
      </p>
    </section>
  );
}

// ── Invoice Panel ──────────────────────────────────────────────────────────────

function InvoicePanel({ campaignId }: { campaignId: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const { data: payment, isFetching: isLoadingInvoice, refetch: loadInvoice } =
    useQuery({
      queryKey: ["payment", campaignId],
      queryFn: () => getPaymentForCampaign(campaignId),
      enabled: false,
    });

  const handleViewInvoice = async () => {
    const result = await loadInvoice();
    if (result.error) {
      toast.error(
        result.error instanceof Error ? result.error.message : "Unable to load invoice.",
      );
      return;
    }
    if (!result.data) {
      toast.info("No payment proof has been uploaded yet.");
      return;
    }
    setInvoiceOpen(true);
  };

  const handleProofSelection = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file as proof of payment.");
      return;
    }

    setIsUploading(true);
    try {
      await uploadPaymentProof(campaignId, file);
      toast.success("Proof of payment uploaded successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to upload proof of payment.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="flex min-h-[350px] flex-1 flex-col rounded border border-[#d8d4cb] bg-white p-7">
      <h2 className="border-b border-[#d8d4cb] pb-3 text-2xl">
        Invoice Details
      </h2>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <ReceiptText className="size-12 text-[#6b1fa8]" strokeWidth={1.6} />
        <p className="mt-4 max-w-lg text-sm leading-5 text-[#44403b]">
          The final itemized breakdown of services, fees, and pay-outs is
          available for review. Once payment is confirmed, upload the proof of
          payment here.
        </p>
        <Button
          type="button"
          className="mt-5 rounded bg-[#6b1fa8] font-normal hover:bg-[#551783]"
          onClick={handleViewInvoice}
          disabled={isLoadingInvoice}
        >
          {isLoadingInvoice ? "Loading..." : "View Invoice"}
          <FileText className="ml-2 size-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleProofSelection}
        />
        <Button
          type="button"
          className="mt-3 rounded bg-[#6b1fa8] font-normal hover:bg-[#551783]"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Proof of Payment"}
          <UploadCloud className="ml-2 size-4" />
        </Button>
      </div>

      <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
        <DialogContent className="max-h-[95vh] !max-w-5xl overflow-y-auto border-[#d8d4cb] bg-[#f2f0ea] p-8">
          <DialogTitle className="text-3xl font-normal">Invoice</DialogTitle>
          {payment?.proof_payment_url ? (
            <div className="mt-5 rounded border border-[#d8d4cb] bg-white p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={payment.proof_payment_url}
                alt="Uploaded proof of payment"
                className="max-h-[78vh] w-full object-contain"
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}

// ── Main Client Workspace ──────────────────────────────────────────────────────

export default function ClientWorkspace({
  campaignId,
}: {
  campaignId: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();
  const { data, isLoading: campaignLoading } = useCampaignSetup(campaignId);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [activeSubmissionStep, setActiveSubmissionStep] = useState(0);
  const [activeDeliverable, setActiveDeliverable] = useState(0);
  const [activeDeliverableItem, setActiveDeliverableItem] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const deliverables = useMemo(
    () => data?.deliverables ?? [],
    [data?.deliverables],
  );

  const selectedDeliverable = deliverables[activeDeliverable];

  // Fetch deliverable items for the selected deliverable
  const { data: deliverableItems } = useDeliverableItems(
    selectedDeliverable?.public_id,
  );

  const selectedDeliverableItem = deliverableItems?.[activeDeliverableItem];

  // Fetch the latest written and media assets for the selected deliverable item
  const { data: latestWrittenAsset, isLoading: writtenLoading } =
    useLatestWrittenAsset(selectedDeliverableItem?.public_id);
  const { data: latestMediaAsset, isLoading: mediaLoading } =
    useLatestMediaAsset(selectedDeliverableItem?.public_id);

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

  const handleMutationSuccess = () => {
    // Invalidate all relevant queries to refresh the UI
    queryClient.invalidateQueries({ queryKey: ["latestWrittenAsset"] });
    queryClient.invalidateQueries({ queryKey: ["latestMediaAsset"] });
    queryClient.invalidateQueries({ queryKey: ["deliverableItems"] });
  };

  if (loading || campaignLoading)
    return <LogoLoader label="Loading client workspace" />;
  if (!user) return null;

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#f2f0ea]">
      <ClientSidebar
        isSigningOut={isSigningOut}
        onSignOut={handleSignOut}
        showBackToCampaigns
      />
      <section className="h-screen flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-325 flex-col gap-6 p-8">
          <ClientWorkspaceHeader
            campaignName={data?.campaign?.project_name ?? "Campaign Name"}
            campaignOverview={data?.campaign?.description ?? "Campaign Overview"}
            progress={<Progress activeStep={activeStep} onChange={setActiveStep} />}
          />

          <div className="mt-14 flex items-start justify-center gap-6">
            {activeStep === 1 && (deliverables.length === 0 ? (
              <aside className="w-64 shrink-0">
                <p className="text-2xl text-foreground">Deliverables</p>
                <p className="mt-3 text-sm italic text-[#77736d]">
                  No deliverables found for this campaign.
                </p>
              </aside>
            ) : (
              <ClientDeliverablesSidebar
                deliverables={deliverables}
                items={deliverableItems ?? []}
                activeDeliverable={activeDeliverable}
                activeDeliverableItem={activeDeliverableItem}
                activeStep={activeSubmissionStep}
                onChange={(index) => {
                  setActiveDeliverable(index);
                  setActiveDeliverableItem(0);
                }}
                onItemChange={setActiveDeliverableItem}
                onStepChange={(step) => {
                  setActiveSubmissionStep(step);
                  setActiveStep(1);
                }}
              />
            ))}

          {/* Main Content Area */}
          {activeStep === 0 ? (
            <ContractSigningPlaceholder />
          ) : activeStep === 2 ? (
            <InvoicePanel campaignId={campaignId} />
          ) : activeStep === 1 ? (
            <div className="flex min-w-0 flex-1 gap-6">
              {activeSubmissionStep === 0 ? (
                <WrittenAssetPanel
                  asset={latestWrittenAsset}
                  isLoading={writtenLoading}
                  onHistory={() => setHistoryOpen(true)}
                />
              ) : (
                <MediaAssetPanel
                  asset={latestMediaAsset}
                  isLoading={mediaLoading}
                  onHistory={() => setHistoryOpen(true)}
                  onPreview={() => setPreviewOpen(true)}
                />
              )}
              <FeedbackActions
                submissionStep={activeSubmissionStep}
                writtenAssetPublicId={latestWrittenAsset?.public_id}
                mediaAssetPublicId={latestMediaAsset?.public_id}
                writtenAssetAction={latestWrittenAsset?.written_asset_action}
                mediaAssetAction={latestMediaAsset?.media_asset_action}
                onMutationSuccess={handleMutationSuccess}
              />
            </div>
          ) : (
            <section className="flex min-h-[350px] flex-1 flex-col items-center justify-center rounded border border-[#d8d4cb] bg-white p-7 text-center">
              <Check className="size-12 text-[#2d7a3a]" strokeWidth={1.6} />
              <p className="mt-4 text-sm leading-5 text-[#44403b]">
                This campaign has been completed.
              </p>
            </section>
          )}
          </div>
        </div>
      </section>

      {/* Video Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[90vh] !max-w-4xl overflow-y-auto border-[#d8d4cb] bg-[#f2f0ea] p-8"
        >
          <div className="flex items-center justify-between">
            <DialogTitle className="text-3xl font-normal">Preview</DialogTitle>
            <button onClick={() => setPreviewOpen(false)}>
              <X />
            </button>
          </div>
          <div className="mx-auto mt-5 w-full max-w-3xl rounded border border-[#d8d4cb] bg-white p-5">
            {latestMediaAsset?.content_url ? (
              <video
                src={latestMediaAsset.content_url}
                controls
                className="w-full"
              />
            ) : (
              <p className="text-sm italic text-[#77736d]">
                No video to preview.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <HistoryOverlay
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        deliverableItemPublicId={selectedDeliverableItem?.public_id}
        type={activeSubmissionStep === 0 ? "written" : "media"}
      />
    </main>
  );
}
