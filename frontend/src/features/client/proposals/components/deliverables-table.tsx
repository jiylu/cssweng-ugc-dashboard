import type { ProposalDeliverable } from "../types/proposal-review.types";

interface DeliverablesTableProps {
  deliverables: ProposalDeliverable[];
}

export default function DeliverablesTable({
  deliverables,
}: DeliverablesTableProps) {
  return (
    <section className="overflow-hidden rounded border border-[#d8d4cb] bg-white">
      <h2 className="px-4 py-4 text-[26px] leading-none text-[#141518]">
        Deliverables
      </h2>
      <table className="w-full table-fixed border-collapse text-left">
        <thead className="bg-[#d8d4cb] text-base text-[#2f2d2a]">
          <tr>
            <th className="w-[80px] px-6 py-4 font-normal">Qty</th>
            <th className="w-[220px] px-6 py-4 font-normal">Deliverable</th>
            <th className="px-6 py-4 font-normal">Format/Requirements</th>
            <th className="w-[130px] px-6 py-4 font-normal">Due Date</th>
            <th className="w-[130px] px-6 py-4 font-normal">Post Date</th>
            <th className="w-[120px] px-6 py-4 font-normal">Price</th>
          </tr>
        </thead>
        <tbody>
          {deliverables.map((deliverable) => (
            <tr
              key={`${deliverable.deliverable}-${deliverable.quantity}`}
              className="border-t border-[#d8d4cb] text-sm text-[#3f3b36]"
            >
              <td className="px-6 py-4 align-top">{deliverable.quantity}</td>
              <td className="px-6 py-4 align-top">{deliverable.deliverable}</td>
              <td className="px-6 py-4 align-top">
                {deliverable.requirements}
              </td>
              <td className="px-6 py-4 align-top">{deliverable.dueDate}</td>
              <td className="px-6 py-4 align-top">{deliverable.postDate}</td>
              <td className="px-6 py-4 align-top">{deliverable.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
