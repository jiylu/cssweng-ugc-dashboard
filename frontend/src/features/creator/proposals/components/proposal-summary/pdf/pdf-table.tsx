import type { ReactNode } from "react"
import { Text, View } from "@react-pdf/renderer"
import { styles } from "./pdf-styles"

export function LabelValueRow({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <View style={styles.textRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  )
}

export const COLUMN_WIDTHS = [95, 120, 40, 80, 95, 107]
export const GIFTED_PRODUCT_COLUMN_WIDTHS = [89, 74, 119, 109, 104]

export function TermsTable({ children }: { children: ReactNode }) {
  return <View style={styles.table}>{children}</View>
}

export function TermsTableRow({
  cells,
  head,
  last,
  widths = COLUMN_WIDTHS,
}: {
  cells: string[]
  head?: boolean
  last?: boolean
  widths?: number[]
}) {
  return (
    <View style={head ? styles.tableHead : last ? styles.tableRowLast : styles.tableRow}>
      {cells.map((cell, i) => (
        <View
          key={i}
          style={[
            styles.tableCell,
            {
              width: widths[i % widths.length],
              flexShrink: 0,
              flexGrow: 0,
              minWidth: 0,
            },
          ]}
        >
          <Text
            hyphenationCallback={(word) =>
              word.length > 15 ? (word.match(/.{1,15}/g) ?? [word]) : [word]
            }
            style={[
              { width: "100%", minWidth: 0 },
              head ? styles.tableHeadCellText : styles.tableCellText,
            ]}
          >
            {cell}
          </Text>
        </View>
      ))}
    </View>
  )
}
