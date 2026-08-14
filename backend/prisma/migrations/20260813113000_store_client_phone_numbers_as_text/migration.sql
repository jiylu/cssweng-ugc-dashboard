ALTER TABLE "Clients"
ALTER COLUMN "company_contact_no" TYPE TEXT USING "company_contact_no"::TEXT,
ALTER COLUMN "contact_person_contact_no" TYPE TEXT USING "contact_person_contact_no"::TEXT;
