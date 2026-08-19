import Link from "next/link";
import Magnetic from "@/components/Magnetic";

const rows = [
  {
    label: "Starting At",
    aerial: "$175",
    cinematic: "$400",
    social: "$350/mo",
  },
  {
    label: "Turnaround",
    aerial: "5 business days",
    cinematic: "7 business days",
    social: "Ongoing monthly",
  },
  {
    label: "Best For",
    aerial: "Real estate & property listings",
    cinematic: "Brand films & event coverage",
    social: "Consistent content & social growth",
  },
];

export default function PackageComparison() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="py-4 pr-4"></th>
            <th scope="col" className="px-4 py-4 align-bottom">
              <span className="font-serif text-lg font-bold text-fg">Aerial Photography</span>
            </th>
            <th scope="col" className="px-4 py-4 align-bottom">
              <span className="font-serif text-lg font-bold text-fg">Cinematic Video</span>
            </th>
            <th scope="col" className="px-4 py-4 align-bottom">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-serif text-lg font-bold text-fg">Social Media Content</span>
                <span className="rounded-full bg-fg px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-bg">
                  Popular
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border">
              <th
                scope="row"
                className="py-4 pr-4 text-xs font-semibold uppercase tracking-wider text-fg-faint"
              >
                {row.label}
              </th>
              <td className="px-4 py-4 text-fg-muted">{row.aerial}</td>
              <td className="px-4 py-4 text-fg-muted">{row.cinematic}</td>
              <td className="px-4 py-4 text-fg-muted">{row.social}</td>
            </tr>
          ))}
          <tr>
            <td className="py-5 pr-4"></td>
            <td className="px-4 py-5">
              <Magnetic>
                <Link
                  href="#aerial"
                  className="inline-block rounded-full border border-fg/30 px-4 py-2 text-xs font-semibold tracking-wide transition-colors hover:border-fg hover:bg-fg hover:text-bg"
                >
                  View Details
                </Link>
              </Magnetic>
            </td>
            <td className="px-4 py-5">
              <Magnetic>
                <Link
                  href="#cinematic"
                  className="inline-block rounded-full border border-fg/30 px-4 py-2 text-xs font-semibold tracking-wide transition-colors hover:border-fg hover:bg-fg hover:text-bg"
                >
                  View Details
                </Link>
              </Magnetic>
            </td>
            <td className="px-4 py-5">
              <Magnetic>
                <Link
                  href="#social-media"
                  className="inline-block rounded-full bg-fg px-4 py-2 text-xs font-semibold tracking-wide text-bg transition-opacity hover:opacity-85"
                >
                  View Details
                </Link>
              </Magnetic>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
