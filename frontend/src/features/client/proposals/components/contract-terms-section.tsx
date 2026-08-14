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
      <div className="mt-4 grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
        {terms.map((term) => (
          <article
            key={term.title}
            className="rounded border border-[#d8d4cb] bg-white p-4 shadow-[0_1px_2px_rgba(20,21,24,0.04)]"
          >
            <h3 className="text-lg leading-none text-[#6b1fa8]">
              {term.title}
            </h3>
            <dl className="mt-3 space-y-2">
              {term.items.map((item) => (
                <div
                  key={item.label}
                  className="text-sm leading-5 text-[#6f6a63]"
                >
                  <dt className="inline text-[#4f4b45]">{item.label}: </dt>
                  <dd className="inline break-words">{item.value}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
