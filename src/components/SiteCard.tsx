import Link from "next/link";
import type { CampingSite } from "@/lib/data";

function FacilityBadge({ label, value }: { label: string; value: string }) {
  if (!value || value === "no") return null;
  return (
    <span className="badge badge-outline badge-sm gap-1">
      {label}
    </span>
  );
}

export default function SiteCard({ site }: { site: CampingSite }) {
  const typeLabel = site.type === "caravan_park" ? "Caravan Park" : "Campground";
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-300">
      <div className="card-body p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="card-title text-base">
              <Link
                href={`/site/${site.slug}`}
                className="hover:text-primary transition-colors"
              >
                {site.name}
              </Link>
            </h3>
            <p className="text-sm text-base-content/60">
              {typeLabel} · {site.state}
              {site.operator && ` · ${site.operator}`}
            </p>
          </div>
          <span
            className={`badge badge-sm ${
              site.type === "caravan_park" ? "badge-accent" : "badge-primary"
            }`}
          >
            {site.type === "caravan_park" ? "🚐" : "⛺"}
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          <FacilityBadge label="💧 Water" value={site.drinking_water} />
          <FacilityBadge label="🚻 Toilets" value={site.toilets} />
          <FacilityBadge label="🚿 Shower" value={site.shower} />
          <FacilityBadge label="🔌 Power" value={site.power_supply} />
          <FacilityBadge label="🔥 BBQ" value={site.bbq} />
          <FacilityBadge label="🐕 Pets" value={site.pets} />
          {site.fee && site.fee !== "no" && (
            <span className="badge badge-outline badge-sm">
              {site.fee === "yes" ? "💰 Fee" : `💰 ${site.fee}`}
            </span>
          )}
        </div>
        <div className="card-actions justify-end mt-2">
          <Link href={`/site/${site.slug}`} className="btn btn-primary btn-xs">
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
