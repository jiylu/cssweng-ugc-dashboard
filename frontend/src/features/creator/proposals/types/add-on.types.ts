export interface AddOnItem {
  id: string
  dbId?: string
  title: string
  desc: string
  fee: number
  isPermanent?: boolean
  isEnabled?: boolean
}