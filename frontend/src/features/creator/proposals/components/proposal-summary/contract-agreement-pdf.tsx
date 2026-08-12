import { PDFViewer } from "@react-pdf/renderer"
import { ProposalSummaryData } from "../../types/proposal-summary.types"
import { styles } from "./pdf/pdf-styles"
import { ContractAgreementDocument } from "./pdf/contract-agreement-document"

export { ContractAgreementDocument }

interface ContractAgreementPreviewProps {
  summary: ProposalSummaryData
}

export function ContractAgreementPreview({ summary }: ContractAgreementPreviewProps) {
  return (
    <PDFViewer style={styles.viewer}>
      <ContractAgreementDocument summary={summary} />
    </PDFViewer>
  )
}
