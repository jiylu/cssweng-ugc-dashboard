CREATE TABLE "RegistrationOtp" (
    "otp_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRoles" NOT NULL,
    "otp_hash" TEXT NOT NULL,
    "verification_token_hash" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "verified_at" TIMESTAMP(3),
    "consumed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RegistrationOtp_pkey" PRIMARY KEY ("otp_id")
);

CREATE UNIQUE INDEX "RegistrationOtp_verification_token_hash_key"
ON "RegistrationOtp"("verification_token_hash");
CREATE INDEX "RegistrationOtp_email_role_created_at_idx"
ON "RegistrationOtp"("email", "role", "created_at");
