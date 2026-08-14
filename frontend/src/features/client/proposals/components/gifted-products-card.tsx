import { Gift, MapPin } from "lucide-react";
import type { ProposalGiftedProduct } from "../types/proposal-review.types";

interface GiftedProductsCardProps {
  products: ProposalGiftedProduct[];
}

export default function GiftedProductsCard({ products }: GiftedProductsCardProps) {
  if (products.length === 0) return null;

  return (
    <section className="overflow-hidden rounded border border-[#a9a59e] bg-white">
      <div className="flex items-center gap-3 px-6 py-5">
        <Gift className="size-6 text-[#6b1fa8]" aria-hidden="true" />
        <h2 className="text-[28px] leading-none text-[#141518]">
          Gifted Products
        </h2>
      </div>

      <div className="grid gap-4 border-t border-[#d8d4cb] p-5 sm:p-6">
        {products.map((product) => (
          <article
            key={product.id}
            className="grid gap-5 rounded border border-[#d8d4cb] bg-[#faf9f6] p-5 md:grid-cols-[minmax(0,1fr)_minmax(240px,0.8fr)]"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-xl text-[#141518]">{product.productName}</h3>
                <span className="rounded bg-[#eee5f5] px-3 py-1 text-base font-medium text-[#6b1fa8]">
                  {product.value}
                </span>
              </div>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="uppercase tracking-wide text-[#7b7771]">Ownership Terms</dt>
                  <dd className="mt-1 whitespace-pre-wrap leading-relaxed text-[#2f2d2a]">{product.ownershipTerms}</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-wide text-[#7b7771]">Delivery Instructions</dt>
                  <dd className="mt-1 whitespace-pre-wrap leading-relaxed text-[#2f2d2a]">{product.deliveryInstructions}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded border border-[#d8d4cb] bg-white p-4">
              <p className="flex items-center gap-2 text-sm uppercase tracking-wide text-[#7b7771]">
                <MapPin className="size-4 text-[#6b1fa8]" aria-hidden="true" />
                Shipping Address
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#2f2d2a]">
                {product.shippingAddress}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
