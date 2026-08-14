ALTER TABLE "Payments"
ALTER COLUMN "proof_payment_url" DROP NOT NULL,
ADD COLUMN "invoice_sent_at" TIMESTAMP(3);

-- Existing payment records necessarily came from a client proof upload, so
-- preserve them as invoices that had already been sent.
UPDATE "Payments"
SET "invoice_sent_at" = "created_at"
WHERE "invoice_sent_at" IS NULL;
