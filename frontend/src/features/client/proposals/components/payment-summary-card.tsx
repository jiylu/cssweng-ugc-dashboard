interface PaymentSummaryCardProps {
  paymentMethod: string;
  baseFee: string;
  selectedAddOns: string;
  giftedProducts: string;
  tax: string;
  totalDue: string;
}

export default function PaymentSummaryCard({
  paymentMethod,
  baseFee,
  selectedAddOns,
  giftedProducts,
  tax,
  totalDue,
}: PaymentSummaryCardProps) {
  return (
    <section className="overflow-hidden rounded border border-[#d8d4cb] bg-white">
      <div className="space-y-3 p-5 text-lg text-[#141518]">
        <h2 className="text-[26px] leading-none">Payment Summary</h2>
        <p>Payment Method: {paymentMethod}</p>
        <p>Base Creator Fee: {baseFee}</p>
        <p>Selected Add-Ons: {selectedAddOns}</p>
        <p>Gifted Products: {giftedProducts}</p>
        <p>{tax}</p>
      </div>
      <div className="border-t border-[#d8d4cb] p-5 text-2xl font-bold text-[#141518]">
        Total Due: {totalDue}
      </div>
    </section>
  );
}
