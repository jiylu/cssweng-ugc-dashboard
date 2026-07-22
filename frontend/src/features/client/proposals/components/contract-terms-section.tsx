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
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {terms.map((term) => (
          <article
            key={term.title}
            className="overflow-hidden rounded-lg border border-[#d8d4cb] bg-white shadow-[0_1px_2px_rgba(20,21,24,0.04)]"
          >
            <h3 className="border-b border-[#e8e4dc] bg-[#faf9f6] px-5 py-4 text-lg font-medium leading-none text-[#6b1fa8]">
              {term.title}
            </h3>
            <dl className="divide-y divide-[#eeeae3] px-5">
              {term.items.map((item) => (
                <div
                  key={item.label}
                  className="grid gap-1 py-3 sm:grid-cols-[minmax(130px,0.38fr)_minmax(0,1fr)] sm:gap-5"
                >
                  <dt className="text-sm font-medium text-[#5f5a53]">
                    {item.label}
                  </dt>
                  <dd className="min-w-0 break-words text-[15px] leading-6 text-[#2f2d2a]">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
