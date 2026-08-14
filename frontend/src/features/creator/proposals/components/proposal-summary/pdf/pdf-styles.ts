import { StyleSheet } from "@react-pdf/renderer"

export const BRAND_COLOR = "#6b1fa8"
export const MUTED_COLOR = "#78746e"
export const BORDER_COLOR = "#d8d4cb"

export const styles = StyleSheet.create({
  viewer: {
    width: "100%",
    height: "100%",
    border: "none",
  },
  page: {
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 48,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#2f2d2a",
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: BRAND_COLOR,
    paddingBottom: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: BRAND_COLOR,
  },
  subtitle: {
    fontSize: 10,
    color: MUTED_COLOR,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: BRAND_COLOR,
    marginBottom: 8,
  },
  section: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
  },
  label: {
    width: 130,
    color: MUTED_COLOR,
  },
  value: {
    flex: 1,
  },
  textRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  table: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  tableRowLast: {
    flexDirection: "row",
  },
  tableHead: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    backgroundColor: "#faf9f6",
  },
  tableCell: {
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  tableCellText: {},
  tableHeadCellText: {
    fontWeight: "bold",
    color: "#5f5a53",
  },
  tableFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 6,
  },
  tableFooterText: {
    fontSize: 10,
    fontWeight: "bold",
    marginRight: 8,
  },
  tableFooterTotal: {
    fontSize: 10,
    fontWeight: "bold",
  },
  termBlock: {
    marginBottom: 5,
  },
  termTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  clauseTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 1,
  },
  termBody: {
    lineHeight: 1.5,
  },
  termBullet: {
    lineHeight: 1.25,
    marginBottom: 1,
    paddingLeft: 9,
    textIndent: -9,
  },
  signatureRow: {
    flexDirection: "row",
    marginTop: 28,
  },
  signatureCol: {
    flex: 1,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#2f2d2a",
    marginTop: 8,
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 8,
    color: MUTED_COLOR,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
    paddingTop: 8,
    fontSize: 8,
    color: MUTED_COLOR,
  },
})
