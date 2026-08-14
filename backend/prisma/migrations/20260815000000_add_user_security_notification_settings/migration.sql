ALTER TABLE "User"
ADD COLUMN "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "email_proposal_updates" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "email_contract_updates" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "email_deliverable_updates" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "email_payment_updates" BOOLEAN NOT NULL DEFAULT true;
