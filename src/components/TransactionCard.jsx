// // Props:
// //   amount   — number  — transaction amount in RM
// //   category — string  — category id (matches CATEGORIES)
// //   date     — string  — ISO date string
// //   note     — string  — optional free-text note from voice input
// //
// // TODO: Card displaying one expense entry. Include CategoryBadge, formatted
// // amount (RM X.XX), human-readable date, and note. Accessible with role="article".
// export default function TransactionCard({ amount, category, date, note }) {
//   return (
//     <article
//       aria-label={`Transaction: RM${amount} on ${category}`}
//       className="bg-surface rounded-xl p-4 w-full flex flex-col gap-1"
//     >
//       <div className="flex justify-between items-center">
//         <span className="font-semibold">{category}</span>
//         <span className="text-accent font-bold">RM {amount}</span>
//       </div>
//       <span className="text-sm text-gray-400">{date}</span>
//       {note && <span className="text-sm">{note}</span>}
//     </article>
//   )
// }
