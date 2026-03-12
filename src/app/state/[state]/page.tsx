import { Metadata } from "next";
import Link from "next/link";
import { getSitesByState, STATES } from "@/lib/data";
import SiteCard from "@/components/SiteCard";
import MapView from "@/components/MapView";

interface Props {
  params: Promise<{ state: string }>;
}

export async function generateStaticParams() {
  return Object.keys(STATES).map((s) => ({ state: s.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const code = state.toUpperCase();
  const name = STATES[code] || code;
  const sites = getSitesByState(code);
  return {
    title: `${name} Camping & Caravan Parks (${sites.length})`,
    description: `Browse ${sites.length} camping grounds and caravan parks in ${name}, Australia. Free directory with map and facility details.`,
  };
}

export default async function StatePage({ params }: Props) {
  const { state } = await params;
  const code = state.toUpperCase();
  const name = STATES[code] || code;
  const sites = getSitesByState(code);
  const campgrounds = sites.filter((s) => s.type === "campground").length;
  const caravanParks = sites.length - campgrounds;

  // For map, limit markers to 500 for performance
  const mapMarkers = sites.slice(0, 500).map((s) => ({
    lat: s.lat,
    lng: s.lon,
    label: s.name,
    popup: `${s.type === "caravan_park" ? "🚐 Caravan Park" : "⛺ Campground"}${s.operator ? ` · ${s.operator}` : ""}`,
    href: `/site/${s.slug}`,
  }));

  return (
    <div className="space-y-8">
      <div className="breadcrumbs text-sm">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li>{name}</li>
        </ul>
      </div>

      <h1 className="text-3xl font-bold">
        {name} — {sites.length.toLocaleString()} Camping & Caravan Sites
      </h1>

      <div className="stats stats-vertical sm:stats-horizontal shadow">
        <div className="stat">
          <div className="stat-title">Total</div>
          <div className="stat-value">{sites.length.toLocaleString()}</div>
        </div>
        <div className="stat">
          <div className="stat-title">⛺ Campgrounds</div>
          <div className="stat-value">{campgrounds}</div>
        </div>
        <div className="stat">
          <div className="stat-title">🚐 Caravan Parks</div>
          <div className="stat-value">{caravanParks}</div>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-box overflow-hidden border border-base-300">
        <MapView markers={mapMarkers} zoom={code === "ACT" ? 10 : 6} />
      </div>
      {sites.length > 500 && (
        <p className="text-sm text-base-content/50">
          Showing 500 of {sites.length.toLocaleString()} sites on map. All sites listed below.
        </p>
      )}

      {/* Site List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sites.map((site) => (
          <SiteCard key={site.slug} site={site} />
        ))}
      </div>
    </div>
  );
}
