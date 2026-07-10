import type { ContractTerm } from "../types/proposal-review.types";

interface ContractTermsSectionProps {
  terms: ContractTerm[];
}

export default function ContractTermsSection({
  terms,
}: ContractTermsSectionProps) {
  return (
    <section>
      <h2 className="border-b border-[#d8d4cb] pb-3 text-[28px] leading-none text-[#141518]">
        Contract Terms
      </h2>
      <div className="mt-4 grid grid-cols-3 gap-8">
        {terms.map((term) => (
          <article
            key={term.title}
            className="min-h-[132px] rounded border border-[#d8d4cb] bg-white px-4 py-5"
          >
            <h3 className="text-lg leading-none text-[#6b1fa8]">
              {term.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-[#6f6a63]">
              {term.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
