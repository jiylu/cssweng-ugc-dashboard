import { AddOnItem } from "@/src/features/creator/proposals/types/add-on.types"

export const DEFAULT_ADD_ONS: AddOnItem[] = [
  {
    id: "whitelisting",
    title: "Whitelisting / Spark Ads",
    desc: "Creator will provide Meta Partnership Ad permission and/or TikTok Spark Code for [_ months].",
    fee: 0,
    isPermanent: true,
    isEnabled: true,
  },
  {
    id: "raw_footage",
    title: "Raw footage",
    desc: "Creator will provide unedited raw clips. Brand may use only within the approved usage scope.",
    fee: 0,
    isPermanent: true,
    isEnabled: true,
  },
  {
    id: "additional_ugc",
    title: "Additional UGC video",
    desc: "One additional edited vertical video, [30–60 seconds], delivered to Brand.",
    fee: 0,
    isPermanent: true,
    isEnabled: true,
  },
  {
    id: "additional_reel",
    title: "Additional posted Reel/TikTok",
    desc: "One additional post on Creator's channel, including caption, tag, and disclosure.",
    fee: 0,
    isPermanent: true,
    isEnabled: true,
  },
  {
    id: "additional_revision",
    title: "Additional revision/reshoot",
    desc: "Additional revision round, reshoot, new hook, new CTA, or major creative change outside the included revision.",
    fee: 0,
    isPermanent: true,
    isEnabled: true,
  },
]