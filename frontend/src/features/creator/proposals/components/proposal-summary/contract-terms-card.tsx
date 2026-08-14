import { Card } from "@/src/components/atoms/card"
import { Separator } from "@/components/ui/separator"
import { CheckSquare } from "lucide-react"

interface ContractTerm {
    title: string
    description: string
}

interface ContractTermsSummaryCardProps {
    terms: ContractTerm[]
}

export function ContractTermsSummaryCard({ terms }: ContractTermsSummaryCardProps) {
    return (
        <Card className="flex flex-col gap-4 p-6">
            <h2 className="text-2xl font-normal text-foreground">Contract Terms Summary</h2>
            <Separator />

            <div className="flex flex-col gap-4">
            {terms.map((term, i) => (
                <div key={i} className="flex items-start gap-3">
                    <CheckSquare size={18} className="text-[#6b1fa8] shrink-0" />
                    <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-bold text-foreground">{term.title}</p>
                        <p className="text-sm text-muted-foreground">{term.description}</p>
                    </div>
                    </div>
            ))}
            </div>
        </Card>
    )
}