import { Check, Minus } from "lucide-react";

type CellValue = { text: string; note?: string } | boolean;

const tiers = [
  { name: "Basic", tagline: "A practical starting point", color: "bg-stone/10 text-stone" },
  { name: "Standard", tagline: "More arranged for the route", color: "bg-river/10 text-river" },
  { name: "Premium", tagline: "More privacy and planning", color: "bg-pine/10 text-pine" },
];

const features: { label: string; values: CellValue[] }[] = [
  {
    label: "Accommodation",
    values: [
      { text: "Standard hotel or guesthouse" },
      { text: "Mid-range hotel" },
      { text: "Higher-end hotel or resort" },
    ],
  },
  {
    label: "Meals",
    values: [
      { text: "Breakfast" },
      { text: "Breakfast and dinner" },
      { text: "All meals included" },
    ],
  },
  {
    label: "Transport",
    values: [
      { text: "Shared or local option" },
      { text: "Private or shared transport" },
      { text: "Private vehicle throughout" },
    ],
  },
  {
    label: "Guide",
    values: [false, { text: "Local guide support" }, { text: "Dedicated local guide" }],
  },
  {
    label: "Itinerary",
    values: [
      false,
      { text: "Curated day-by-day plan" },
      { text: "Fully tailored itinerary" },
    ],
  },
  {
    label: "Activities",
    values: [
      false,
      false,
      { text: "Hiking or activity planning" },
    ],
  },
  {
    label: "Support",
    values: [
      { text: "Booking assistance by call" },
      { text: "Standard support" },
      { text: "Priority support line" },
    ],
  },
];

function CellIcon({ included }: { included: boolean }) {
  return included ? (
    <Check size={16} className="shrink-0 text-river" />
  ) : (
    <Minus size={16} className="shrink-0 text-stone/30" />
  );
}

function CellValue({ value }: { value: CellValue }) {
  if (typeof value === "boolean") return null;
  return (
    <>
      <span className="text-charcoal">{value.text}</span>
      {value.note && (
        <span className="mt-0.5 block text-xs text-stone">{value.note}</span>
      )}
    </>
  );
}

export function PackageComparison() {
  return (
    <section className="mt-8 mb-14 border-t border-border pt-10">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="eyebrow">COMPARE SERVICE LEVELS</div>
          <h2 className="font-display text-3xl font-bold text-pine md:text-4xl">
            Choose the level that fits your trip.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone">
            Exact availability and pricing depend on destination, travel dates,
            and provider confirmation.
          </p>
        </div>

        <div className="mt-8 overflow-x-auto rounded-brand border border-border bg-white">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b-2 border-border bg-mist">
                <th className="w-[180px] px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-stone">
                  Feature
                </th>
                {tiers.map((tier) => (
                  <th
                    key={tier.name}
                    className="px-5 py-4 text-left"
                  >
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wide ${tier.color}`}
                    >
                      {tier.name}
                    </span>
                    <span className="mt-1 block text-xs font-normal text-stone">
                      {tier.tagline}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((row, rowIndex) => (
                <tr
                  key={row.label}
                  className={`border-b border-border last:border-b-0 ${
                    rowIndex % 2 === 0 ? "bg-white" : "bg-snow"
                  }`}
                >
                  <td className="px-5 py-4 text-sm font-semibold text-charcoal">
                    {row.label}
                  </td>
                  {row.values.map((val, i) => (
                    <td key={i} className="px-5 py-4 text-sm">
                      <div className="flex items-start gap-2">
                        <CellIcon included={typeof val === "boolean" ? val : true} />
                        <CellValue value={val} />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
