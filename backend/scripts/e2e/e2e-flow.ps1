$ErrorActionPreference = 'Stop'

$Base = 'http://localhost:8080/api'
$UgcId = '4382a8ae-e557-45c1-8969-544b50d81488'
$ClientEmail = 'asdsadsa@cckck.com'

$ScriptRoot = $PSScriptRoot
$BackendRoot = Join-Path $ScriptRoot '..\..'
$EnvFile = Join-Path $BackendRoot '.env.development'
$Env:NODE_PATH = Join-Path $BackendRoot 'node_modules'
$Tmp = Join-Path $env:TEMP 'ugc-e2e'
New-Item -ItemType Directory -Force -Path $Tmp | Out-Null

function Request {
    param(
        [string]$Method,
        [string]$Path,
        [string]$BodyFile,
        [hashtable]$Form,
        [string]$Query
    )
    $curlArgs = @('-s', '-f', '-X', $Method)
    if ($BodyFile) { $curlArgs += @('-H', 'Content-Type: application/json', '--data-binary', "@$BodyFile") }
    if ($Form) { foreach ($k in $Form.Keys) { $curlArgs += @('-F', "$k=$($Form[$k])") } }
    $url = $Base + $Path
    if ($Query) { $url += "?$Query" }
    Write-Host ">> $Method $url" -ForegroundColor Cyan
    $out = & curl.exe @curlArgs $url
    if ($LASTEXITCODE -ne 0) { throw "curl failed (exit $LASTEXITCODE): $out" }
    return ($out -join "`n")
}

$png = [Convert]::FromBase64String('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==')
$SigPath = Join-Path $Tmp 'signature.png'
$InitPath = Join-Path $Tmp 'initials.png'
$MediaPath = Join-Path $Tmp 'media.png'
$ProofPath = Join-Path $Tmp 'proof.png'
[IO.File]::WriteAllBytes($SigPath, $png)
[IO.File]::WriteAllBytes($InitPath, $png)
[IO.File]::WriteAllBytes($MediaPath, $png)
[IO.File]::WriteAllBytes($ProofPath, $png)

Write-Host '=== STEP 1: POST /campaign-setup (create campaign + proposal + contract + deliverables)' -ForegroundColor Yellow
$campaignBody = @'
{
  "campaign": {
    "ugcId": "4382a8ae-e557-45c1-8969-544b50d81488",
    "projectName": "E2E Flow Campaign",
    "description": "Campaign created by the e2e curl flow to verify the full campaign lifecycle.",
    "currency": "PHP",
    "tax": 12,
    "platforms": { "Instagram": "@brand" },
    "startDate": "2026-09-01T00:00:00.000Z",
    "endDate": "2026-09-30T00:00:00.000Z"
  },
  "deliverables": [
    {
      "quantity": 1,
      "deliverableType": "UGC",
      "deliverableContent": "60 sec UGC review video",
      "requirements": "One 60-second vertical video reviewing the product in natural lighting, with captions and hashtags highlighting key benefits and a clear call to action.",
      "dueDate": "2026-09-05T00:00:00.000Z",
      "postDate": "2026-09-10T00:00:00.000Z",
      "pricing": 1500
    }
  ],
  "proposal": {
    "clientEmail": "asdsadsa@cckck.com",
    "client_first_name": "E2E",
    "client_last_name": "Client"
  },
  "contract": {
    "revision_policy": {
      "revision_rounds": 2,
      "revision_window_days": 5,
      "auto_approve_after_days": 3
    },
    "usage_rights": {
      "is_exclusive": true,
      "is_transferrable": false,
      "organic_usage": "Brand may use the content organically across all owned social channels for up to twelve months after the original post date.",
      "paid_usage_ads": "Paid social boosting of the content is allowed for up to ninety days from the original post date.",
      "whitelisting_spark_ads": "Spark Ads may be run for sixty days provided the ad copy is pre-approved in writing by the creator.",
      "territory": "Philippines",
      "restrictions": "No use in political, gambling, or adult-content advertisements."
    },
    "posting_requirements": {
      "content_retention_months": 12,
      "partnership_tags": "#ad, @brandhandle"
    },
    "cancellation_period": 7,
    "payment_terms": {
      "payment_schedule": "NET_30",
      "payment_method": "Bank Transfer"
    },
    "invoice_requirements": {
      "name": "Asceoft Marketing Inc.",
      "email": "finance@client.com",
      "campaign_name": "E2E Flow Campaign",
      "tax_number": "TIN-123-456-789-000",
      "payment_details": "Bank details: BPI xxx-xxxx; payable within Net 30 terms."
    },
    "general_terms": {
      "governed_by": "Laws of the Republic of the Philippines",
      "disputes_handled_in": "Makati City courts"
    }
  }
}
'@
$campaignBodyFile = Join-Path $Tmp 'campaign.json'
Set-Content -LiteralPath $campaignBodyFile -Value $campaignBody -Encoding utf8
$setup = Request -Method POST -Path '/campaign-setup' -BodyFile $campaignBodyFile | ConvertFrom-Json
$campaignPublicId = $setup.campaign.public_id
$proposalPublicId = $setup.proposal.public_id
$contractPublicId = $setup.contract.public_id
$deliverablePublicId = $setup.deliverables[0].public_id
Write-Host "   campaign=$campaignPublicId" -ForegroundColor Green
Write-Host "   proposal=$proposalPublicId" -ForegroundColor Green
Write-Host "   contract=$contractPublicId" -ForegroundColor Green
Write-Host "   deliverable=$deliverablePublicId" -ForegroundColor Green

Write-Host '=== STEP 2: PATCH /proposals/revise/:publicId (ask revisions)' -ForegroundColor Yellow
$reviseProposalBody = @'
{ "comment": "Thank you for the proposal. Please adjust the campaign timeline and resubmit the updated version." }
'@
$reviseProposalFile = Join-Path $Tmp 'revise-proposal.json'
Set-Content -LiteralPath $reviseProposalFile -Value $reviseProposalBody -Encoding utf8
Request -Method PATCH -Path "/proposals/revise/$proposalPublicId" -BodyFile $reviseProposalFile | Out-Null
Write-Host '   proposal revision requested' -ForegroundColor Green

Write-Host '=== STEP 3: PATCH /campaign-setup/:publicId (creator revises)' -ForegroundColor Yellow
$creatorReviseBody = @'
{ "campaign": { "description": "Campaign description updated by the creator after the client asked for revisions." } }
'@
$creatorReviseFile = Join-Path $Tmp 'creator-revise.json'
Set-Content -LiteralPath $creatorReviseFile -Value $creatorReviseBody -Encoding utf8
Request -Method PATCH -Path "/campaign-setup/$campaignPublicId" -BodyFile $creatorReviseFile | Out-Null
Write-Host '   campaign updated by creator' -ForegroundColor Green

Write-Host '=== STEP 4: PATCH /proposals/accept/:publicId (approve proposal)' -ForegroundColor Yellow
Request -Method PATCH -Path "/proposals/accept/$proposalPublicId" | Out-Null
Write-Host '   proposal accepted' -ForegroundColor Green

Write-Host '=== STEP 5: POST /contracts/sign/:publicId (client signs)' -ForegroundColor Yellow
$form = @{
    'signature'  = "@$($SigPath -replace '\\', '/');type=image/png"
    'initials'   = "@$($InitPath -replace '\\', '/');type=image/png"
    'signerRole' = 'CLIENT'
}
Request -Method POST -Path "/contracts/sign/$contractPublicId" -Form $form | Out-Null
Write-Host '   contract signed by client' -ForegroundColor Green

Write-Host '=== STEP 6: POST /contracts/sign/:publicId (creator signs)' -ForegroundColor Yellow
$form = @{
    'signature'  = "@$($SigPath -replace '\\', '/');type=image/png"
    'initials'   = "@$($InitPath -replace '\\', '/');type=image/png"
    'signerRole' = 'CREATOR'
}
Request -Method POST -Path "/contracts/sign/$contractPublicId" -Form $form | Out-Null
Write-Host '   contract signed by creator' -ForegroundColor Green

Write-Host '=== STEP 7: POST /deliverable-submissions/written-assets (submit written asset)' -ForegroundColor Yellow
$Env:DLVR_CAMPAIGN_PUBLIC = $campaignPublicId
$deliverableItemPublicId = & node --env-file=$EnvFile -e 'const{Client}=require("pg");(async()=>{const c=new Client({connectionString:process.env.DATABASE_URL});await c.connect();const r=await c.query("SELECT di.public_id FROM \"DeliverableItems\" di JOIN \"Deliverables\" d ON d.deliverable_id=di.deliverable_id JOIN \"Campaigns\" c ON c.campaign_id=d.campaign_id WHERE c.public_id=$1 ORDER BY di.deliverable_index LIMIT 1",[process.env.DLVR_CAMPAIGN_PUBLIC]);await c.end();process.stdout.write(r.rows.length?r.rows[0].public_id:"")})().catch(e=>{console.error(e.message);process.exit(1)})'
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($deliverableItemPublicId)) { throw 'Could not resolve deliverable_item_public_id from database.' }
Write-Host "   deliverableItemPublicId=$deliverableItemPublicId" -ForegroundColor Green
$wa1Body = @"
{ "deliverableItemPublicId": "$deliverableItemPublicId", "content": "Draft caption and hashtags for the 60-second UGC video review of the product." }
"@
$wa1File = Join-Path $Tmp 'written-asset-1.json'
Set-Content -LiteralPath $wa1File -Value $wa1Body -Encoding utf8
$wa1 = Request -Method POST -Path '/deliverable-submissions/written-assets' -BodyFile $wa1File | ConvertFrom-Json
$wa1PublicId = $wa1.public_id
Write-Host "   written asset v$($wa1.version_number) = $wa1PublicId" -ForegroundColor Green

Write-Host '=== STEP 8: PATCH /deliverable-submissions/written-assets/:publicId/revise (ask revision)' -ForegroundColor Yellow
$reviseWaBody = @'
{ "comment": "Please adjust the caption tone to be more enthusiastic and highlight the key benefits more clearly." }
'@
$reviseWaFile = Join-Path $Tmp 'revise-written-asset.json'
Set-Content -LiteralPath $reviseWaFile -Value $reviseWaBody -Encoding utf8
Request -Method PATCH -Path "/deliverable-submissions/written-assets/$wa1PublicId/revise" -BodyFile $reviseWaFile | Out-Null
Write-Host '   written asset revision requested' -ForegroundColor Green

Write-Host '=== STEP 9: POST /deliverable-submissions/written-assets (resubmit written asset)' -ForegroundColor Yellow
$wa2Body = @"
{ "deliverableItemPublicId": "$deliverableItemPublicId", "content": "Updated caption with a more enthusiastic tone, a stronger call to action, and the agreed hashtags." }
"@
$wa2File = Join-Path $Tmp 'written-asset-2.json'
Set-Content -LiteralPath $wa2File -Value $wa2Body -Encoding utf8
$wa2 = Request -Method POST -Path '/deliverable-submissions/written-assets' -BodyFile $wa2File | ConvertFrom-Json
$wa2PublicId = $wa2.public_id
Write-Host "   written asset v$($wa2.version_number) = $wa2PublicId" -ForegroundColor Green

Write-Host '=== STEP 10: PATCH /deliverable-submissions/written-assets/:publicId/approve' -ForegroundColor Yellow
Request -Method PATCH -Path "/deliverable-submissions/written-assets/$wa2PublicId/approve" | Out-Null
Write-Host '   written asset approved' -ForegroundColor Green

Write-Host '=== STEP 11: POST /deliverable-submissions/media-assets (submit media asset)' -ForegroundColor Yellow
$form = @{
    'deliverableItemPublicId' = $deliverableItemPublicId
    'file'                    = "@$($MediaPath -replace '\\', '/');type=image/png"
}
$media = Request -Method POST -Path '/deliverable-submissions/media-assets' -Form $form | ConvertFrom-Json
$mediaPublicId = $media.public_id
Write-Host "   media asset v$($media.version_number) = $mediaPublicId" -ForegroundColor Green

Write-Host '=== STEP 12: PATCH /deliverable-submissions/media-assets/:publicId/approve' -ForegroundColor Yellow
Request -Method PATCH -Path "/deliverable-submissions/media-assets/$mediaPublicId/approve" | Out-Null
Write-Host '   media asset approved' -ForegroundColor Green

Write-Host '=== STEP 13: POST /payments/pay (create payment)' -ForegroundColor Yellow
$form = @{
    'file' = "@$($ProofPath -replace '\\', '/');type=image/png"
}
$payment = Request -Method POST -Path '/payments/pay' -Query "campaignPublic=$campaignPublicId" -Form $form | ConvertFrom-Json
Write-Host "   payment = $($payment.public_id)" -ForegroundColor Green

Write-Host '=== STEP 14: PATCH /payments/validate/:publicId (verify payment)' -ForegroundColor Yellow
$validatedPayment = Request -Method PATCH -Path "/payments/validate/$($payment.public_id)" | ConvertFrom-Json
Write-Host "   payment verified=$($validatedPayment.is_payment_verified)" -ForegroundColor Green

Write-Host '=== STEP 15: GET /deliverable-items/deliverable/:publicId (list items for deliverable)' -ForegroundColor Yellow
$items = @(Request -Method GET -Path "/deliverable-items/deliverable/$deliverablePublicId" | ConvertFrom-Json)
if ($items.Count -eq 0) { throw 'No deliverable items returned for the deliverable.' }
$deliverableItemPublicId = $items[0].public_id
Write-Host "   deliverableItemPublicId=$deliverableItemPublicId" -ForegroundColor Green

Write-Host '=== STEP 16: GET /deliverable-items/item/:publicId (get single deliverable item)' -ForegroundColor Yellow
$item = Request -Method GET -Path "/deliverable-items/item/$deliverableItemPublicId" | ConvertFrom-Json
Write-Host "   deliverable item index=$($item.deliverable_index) status=$($item.deliverable_item_status)" -ForegroundColor Green

Write-Host "`nE2E FLOW COMPLETED" -ForegroundColor Green
Write-Host "campaign: $campaignPublicId" -ForegroundColor Green
Write-Host "proposal: $proposalPublicId" -ForegroundColor Green
Write-Host "contract: $contractPublicId" -ForegroundColor Green
Write-Host "deliverable: $deliverablePublicId" -ForegroundColor Green
Write-Host "deliverableItemPublic: $deliverableItemPublicId" -ForegroundColor Green
Write-Host "payment: $($payment.public_id)" -ForegroundColor Green
