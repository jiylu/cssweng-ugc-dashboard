import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateCampaignRequestDto } from '../dto/create-campaign-request-dto';
import { UpdateCampaignSetupDto } from '../dto/update-campaign-setup.dto';

export function ApiCreateFullCampaign() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create full campaign setup in one transaction',
      description:
        'Creates the complete campaign package from a single request payload using CreateCampaignRequestDto. The endpoint creates campaign, proposal, deliverables, contract, optional add-ons, and optional gifted products inside one database transaction. Campaign pricing is computed server-side from deliverable and gifted product value plus tax (`(sum(deliverables.pricing) + sum(giftedProducts.value)) + tax%`) and should not be sent by clients. If any sub-step fails, all writes are rolled back.',
    }),
    ApiBody({
      type: CreateCampaignRequestDto,
      description:
        'Full campaign setup payload. `campaign`, `deliverables`, `proposal`, and `contract` are required. `addOns` and `giftedProducts` are optional arrays.',
      examples: {
        fullSetup: {
          summary: 'Complete payload with optional add-ons and gifted products',
          value: {
            campaign: {
              ugcId: '550e8400-e29b-41d4-a716-446655440000',
              projectName: 'Summer Glow 2026',
              description: 'Campaign focused on summer skincare content.',
              currency: 'PHP',
              tax: 12,
              platforms: ['Instagram', 'TikTok'],
              startDate: '2026-07-15T00:00:00.000Z',
              endDate: '2026-08-15T00:00:00.000Z',
            },
            deliverables: [
              {
                quantity: 2,
                deliverableType: 'COLLABORATION',
                deliverableContent: 'Instagram Reel + Story sequence',
                requirements:
                  'Include usage demo, before/after shots, and product tag in first 5 seconds.',
                dueDate: '2026-07-22T00:00:00.000Z',
                postDate: '2026-07-24T00:00:00.000Z',
                pricing: 7500,
              },
            ],
            proposal: {
              clientEmail: 'client@example.com',
              client_first_name: 'Jane',
              client_last_name: 'Doe',
            },
            contract: {
              revision_policy: {
                revision_rounds: 2,
                revision_window_days: 5,
                auto_approve_after_days: 3,
              },
              usage_rights: {
                is_exclusive: true,
                is_transferrable: false,
                organic_usage:
                  'Brand may use content organically on its owned channels for twelve months from publish date.',
                paid_usage_ads:
                  'Paid social boosting is permitted for ninety days with prior written approval from creator.',
                whitelisting_spark_ads:
                  'Whitelisting and spark ads are allowed for sixty days on approved creatives only.',
                territory: 'Philippines',
                restrictions:
                  'No edits that change creator claims, and no use in sensitive political or adult contexts.',
              },
              posting_requirements: {
                content_retention_months: 12,
                partnership_tags: '#ad, @brandhandle',
              },
              exclusivity: {
                category: 'Skincare',
                startDate: '2026-07-01T00:00:00.000Z',
                territory: 'Southeast Asia',
                brandlist: 'CompetingBrandA, CompetingBrandB',
                exclusivity_fee: 5000,
              },
              expenses_purchases_terms: {
                reimbursement_period: 30,
                gifted_product_terms:
                  'Pre-approved purchases are reimbursed within thirty days after complete receipt submission.',
              },
              cancellation_period: 7,
              payment_terms: {
                payment_schedule: 'NET_30',
                payment_method: 'Bank Transfer',
              },
              invoice_requirements: {
                name: 'Asceoft Marketing Inc.',
                email: 'finance@client.com',
                campaign_name: 'Summer Glow 2026',
                tax_number: 'TIN-123-456-789-000',
                payment_details:
                  'Send invoice to AP team, payable within Net 30 via bank transfer.',
              },
              general_terms: {
                governed_by: 'Laws of the Republic of the Philippines',
                disputes_handled_in: 'Makati City courts',
              },
              extra_notes: 'Client requires draft review before posting.',
            },
            addOns: [
              {
                addOnName: 'Paid usage rights extension',
                fee: 3000,
                initials: 'PUR',
              },
            ],
            giftedProducts: [
              {
                productName: 'Hydrating Night Cream',
                value: 1800,
                shippingAddress: {
                  delivery_address_line_1: '123 Sample St',
                  delivery_address_line_2: 'Building 2, Unit 4',
                  country: 'Philippines',
                  state_province: 'Metro Manila',
                  city: 'Makati City',
                  zip_code: 1226,
                },
                deliveryInstructions: 'Deliver weekdays, 9AM-5PM.',
                ownershipTerms:
                  'Creator keeps gifted items unless campaign is canceled.',
              },
            ],
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description:
        'Campaign setup created successfully. Response includes campaign, proposal, deliverables, contract, addOns, and giftedProducts.',
    }),
    ApiResponse({
      status: 400,
      description:
        'Invalid request payload (DTO validation failed) or malformed nested object structure.',
    }),
    ApiResponse({
      status: 404,
      description:
        'Referenced resource not found (e.g., UGC creator, campaign relation, or unresolved client email).',
    }),
    ApiResponse({
      status: 409,
      description:
        'Conflict in campaign setup constraints (e.g., client already has active engagement or conflicting proposal state).',
    }),
    ApiResponse({
      status: 500,
      description:
        'Internal server error while processing setup. Transaction is rolled back and no partial records are persisted.',
    }),
  );
}

export function ApiUpdateCampaignSetup() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update full campaign setup in one transaction',
      description:
        'Updates campaign details, contract details, and nested deliverables, add-ons, and gifted products in one database transaction using UpdateCampaignSetupDto. Nested resource groups support create, update, and delete arrays. Deletes are soft deletes for supported resources. If any sub-step fails, all writes are rolled back.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the campaign being updated',
      example: 'x21E9dlf0F',
    }),
    ApiBody({
      type: UpdateCampaignSetupDto,
      required: false,
      description:
        'Partial campaign setup update payload. Include only the sections and operations that should be changed.',
      examples: {
        setupUpdate: {
          summary: 'Update campaign, contract, and nested resources',
          value: {
            campaign: {
              projectName: 'Updated Summer Glow 2026',
              description: 'Updated campaign details.',
              currency: 'PHP',
              tax: 12,
              pricing: 55000,
              platforms: ['Instagram', 'TikTok'],
              startDate: '2026-07-15T00:00:00.000Z',
              endDate: '2026-08-15T00:00:00.000Z',
            },
            contract: {
              contractId: '550e8400-e29b-41d4-a716-446655440010',
              extra_notes: 'Updated notes after client review.',
            },
            deliverables: {
              create: [
                {
                  quantity: 1,
                  deliverableType: 'UGC',
                  deliverableContent: 'TikTok usage video',
                  requirements:
                    'Show product use clearly with captions and brand tag.',
                  dueDate: '2026-07-22T00:00:00.000Z',
                  postDate: '2026-07-24T00:00:00.000Z',
                  pricing: 7500,
                },
              ],
              update: [
                {
                  deliverableId: '550e8400-e29b-41d4-a716-446655440011',
                  pricing: 9000,
                },
              ],
              delete: ['550e8400-e29b-41d4-a716-446655440012'],
            },
            giftedProducts: {
              create: [
                {
                  productName: 'Hydrating Night Cream',
                  value: 1800,
                  shippingAddress: {
                    delivery_address_line_1: '123 Sample St',
                    delivery_address_line_2: 'Building 2, Unit 4',
                    country: 'Philippines',
                    state_province: 'Metro Manila',
                    city: 'Makati City',
                    zip_code: 1226,
                  },
                  deliveryInstructions: 'Deliver weekdays, 9AM-5PM.',
                  ownershipTerms:
                    'Creator keeps gifted items unless campaign is canceled.',
                },
              ],
              update: [
                {
                  giftedProductId: '550e8400-e29b-41d4-a716-446655440013',
                  value: 2000,
                },
              ],
              delete: ['550e8400-e29b-41d4-a716-446655440014'],
            },
            addOns: {
              create: [
                {
                  addOnName: 'Paid usage rights extension',
                  description: 'Extend paid usage rights for three months.',
                  fee: 3000,
                  initials: 'PUR',
                },
              ],
              update: [
                {
                  addOnId: '550e8400-e29b-41d4-a716-446655440015',
                  fee: 3500,
                },
              ],
              delete: ['550e8400-e29b-41d4-a716-446655440016'],
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description:
        'Campaign setup updated successfully. Response groups created, updated, and deleted nested resources.',
    }),
    ApiResponse({
      status: 400,
      description:
        'Invalid request payload (DTO validation failed) or malformed nested object structure.',
    }),
    ApiResponse({
      status: 404,
      description:
        'Campaign or nested resource not found. Transaction is rolled back.',
    }),
    ApiResponse({
      status: 409,
      description:
        'Conflict in update constraints, such as attempting to delete an already deleted resource.',
    }),
    ApiResponse({
      status: 500,
      description:
        'Internal server error while processing update. Transaction is rolled back and no partial records are persisted.',
    }),
  );
}

export function ApiGetFullCampaignDetails() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get full campaign details by campaign ID',
      description:
        'Fetches the complete campaign package for a given campaign ID inside a single read transaction. Returns the campaign, proposal, contract, deliverables, add-ons, and gifted products. Throws 404 if the campaign or any required related resource (proposal, contract) does not exist.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the campaign to retrieve',
      example: 'x21E9dlf0F',
    }),
    ApiResponse({
      status: 200,
      description:
        'Full campaign details retrieved successfully. Response includes campaign, proposal, contract, deliverables, addOns, and giftedProducts.',
    }),
    ApiResponse({
      status: 404,
      description:
        'Campaign not found, or a required related resource (proposal or contract) does not exist for this campaign.',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error while fetching campaign details.',
    }),
  );
}
