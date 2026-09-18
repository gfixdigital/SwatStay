import { Check, Minus } from "lucide-react";

const features = [
  { name: "Hotel stay", basic: true, standard: true, premium: true },
  { name: "Breakfast", basic: true, standard: true, premium: true },
  { name: "Dinner", basic: false, standard: true, premium: true },
  { name: "Local transport", basic: true, standard: false, premium: false },
  { name: "Private transport", basic: false, standard: true, premium: true },
  { name: "Guide support", basic: false, standard: true, premium: true },
  { name: "Hiking or activity planning", basic: false, standard: false, premium: true },
  { name: "Better hotel level", basic: false, standard: false, premium: true },
  { name: "Priority support", basic: false, standard: false, premium: true },
];

export function PackageComparison() {
  return (
    <section className="section border-t border-border">
      <div className="container">
        <div className="max-w-2xl">
          <div className="eyebrow">COMPARE SERVICE LEVELS</div>
          <h2 className="font-display text-3xl font-bold text-pine md:text-4xl">
            Choose the level that fits your trip
          </h2>
          <p className="mt-3 text-sm leading-6 text-stone">
            Exact availability and pricing depend on destination, travel dates, and provider confirmation.
          </p>
        </div>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[540px] border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-4 pr-4 text-left text-sm font-semibold text-stone">
                  Feature
                </th>
                <th className="pb-4 px-4 text-center">
                  <span className="inline-block rounded-md border border-border bg-white px-3 py-1.5 font-display text-sm font-bold text-charcoal">
                    Basic
                  </span>
                  <p className="mt-1.5 text-[11px] text-stone">Practical starting point</p>
                </th>
                <th className="pb-4 px-4 text-center">
                  <span className="inline-block rounded-md border border-river/30 bg-[#ebf3f6] px-3 py-1.5 font-display text-sm font-bold text-river">
                    Standard
                  </span>
                  <p className="mt-1.5 text-[11px] text-stone">More arranged for the route</p>
                </th>
                <th className="pb-4 pl-4 text-center">
                  <span className="inline-block rounded-md border border-amber/30 bg-[#faf3e8] px-3 py-1.5 font-display text-sm font-bold text-amber">
                    Premium
                  </span>
                  <p className="mt-1.5 text-[11px] text-stone">More privacy and planning</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature.name} className="border-b border-border/60 last:border-0">
                  <td className="py-3.5 pr-4 text-sm font-medium text-charcoal">
                    {feature.name}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {feature.basic ? (
                      <Check size={18} className="mx-auto text-pine" />
                    ) : (
                      <Minus size={18} className="mx-auto text-border" />
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {feature.standard ? (
                      <Check size={18} className="mx-auto text-river" />
                    ) : (
                      <Minus size={18} className="mx-auto text-border" />
                    )}
                  </td>
                  <td className="py-3.5 pl-4 text-center">
                    {feature.premium ? (
                      <Check size={18} className="mx-auto text-amber" />
                    ) : (
                      <Minus size={18} className="mx-auto text-border" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-center text-xs text-stone">
          All tiers include call-confirmed booking support. Final details are confirmed by phone before providers are booked.
        </p>
      </div>
    </section>
  );
}
