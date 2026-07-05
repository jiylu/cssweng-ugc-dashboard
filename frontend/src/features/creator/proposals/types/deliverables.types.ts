export interface Deliverable {
  id: number;
  deliverable_title: string;
  description: string;
  deliverable_type: string;
  deadline: string;
  pricing: string;
  quantity?: string;
  content_type?: string;
  post_date?: string;
}