export interface ProposalDeliverable {
  quantity: number;
  deliverable: string;
  requirements: string;
  dueDate: string;
  postDate: string;
  price: string;
}

export interface ContractTerm {
  title: string;
  description: string;
}

export interface ProposalAddOn {
  id: string;
  name: string;
  description: string;
  price: string;
  selected: boolean;
}
