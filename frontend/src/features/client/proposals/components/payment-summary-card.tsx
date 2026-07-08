export default function PaymentSummaryCard() {
  return (
    <section className="overflow-hidden rounded border border-[#d8d4cb] bg-white">
      <div className="space-y-3 p-5 text-lg text-[#141518]">
        <h2 className="text-[26px] leading-none">Payment Summary</h2>
        <p>Payment Method: [Payment Method]</p>
        <p>Base Creator Fee: $2,500.00</p>
        <p>Selected Add-Ons: $150.00</p>
        <p>Tax (10%): $330.00</p>
      </div>
      <div className="border-t border-[#d8d4cb] p-5 text-2xl font-bold text-[#141518]">
        Total Due: $3,630.00
      </div>
    </section>
  );
}
