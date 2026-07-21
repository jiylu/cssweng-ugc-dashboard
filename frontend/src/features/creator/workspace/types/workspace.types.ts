export type DeliverableType = 'COLLABORATION' | 'UGC';

export interface Deliverable {
  deliverable_id: string;
  public_id: string;
  campaign_id: string;
  quantity: number;
  deliverable_type: DeliverableType;
  deliverable_content: string;
  requirements: string;
  due_date: string;
  post_date: string;
  pricing: number;
  is_deleted: boolean;
}
