import { PDFViewer } from "@react-pdf/renderer"
import { ProposalSummaryData } from "../../types/proposal-summary.types"
import { styles } from "./pdf/pdf-styles"
import { ContractAgreementDocument } from "./pdf/contract-agreement-document"
import { SignatureImages } from "./pdf/sections/signatures-section"

export { ContractAgreementDocument }

interface ContractAgreementPreviewProps {
  summary: ProposalSummaryData
  signatures?: SignatureImages
}

export function ContractAgreementPreview({ summary, signatures }: ContractAgreementPreviewProps) {
  return (
    <PDFViewer style={styles.viewer}>
      <ContractAgreementDocument summary={summary} signatures={signatures} />
    </PDFViewer>
  )
}
