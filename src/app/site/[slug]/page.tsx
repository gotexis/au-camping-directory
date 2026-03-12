import { Metadata } from "next";
import Link from "next/link";
import { allSites, getSiteBySlug, STATES } from "@/lib/data";
import MapView from "@/components/MapView";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allSites.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const site = getSiteBySlug(slug);
  if (!site) return { title: "Not Found" };
  const typeLabel = site.type === "caravan_park" ? "Caravan Park" : "Campground";
  return {
    title: `${site.name} — ${typeLabel} in ${STATES[site.state] || site.state}`,
    description: `${site.name} is a ${typeLabel.toLowerCase()} in ${STATES[site.state] || site.state}, Australia. View facilities, location map, and details.`,
  };
}

function Info({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <tr>
      <td className="font-medium pr-4 py-1">{label}</td>
      <td className="py-1">{value}</td>
    </tr>
  );
}

function Facility({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  if (!value || value === "no") return null;
  return (
    <div className="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
      <span className="text-xl">{icon}</span>
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-base-content/60">
          {value === "yes" ? "Available" : value}
        </div>
      </div>
    </div>
  );
}

export default async function SitePage({ params }: Props) {
  const { slug } = await params;
  const site = getSiteBySlug(slug);

  if (!site) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Site not found</h1>
        <Link href="/" className="btn btn-primary mt-4">
          Back to directory
        </Link>
      </div>
    );
  }

  const typeLabel =
    site.type === "caravan_park" ? "Caravan Park" : "Campground";
  const stateName = STATES[site.state] || site.state;

  const markers = [
    {
      lat: site.lat,
      lng: site.lon,
      label: site.name,
      popup: typeLabel,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href={`/state/${site.state.toLowerCase()}`}>
              {stateName}
            </Link>
          </li>
          <li>{site.name}</li>
        </ul>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Info */}
        <div className="flex-1 space-y-6">
          <div>
            <span
              className={`badge mb-2 ${
                site.type === "caravan_park" ? "badge-accent" : "badge-primary"
              }`}
            >
              {site.type === "caravan_park" ? "🚐" : "⛺"} {typeLabel}
            </span>
            <h1 className="text-3xl font-bold">{site.name}</h1>
            <p className="text-base-content/60 mt-1">
              {stateName}, Australia
              {site.operator && ` · Operated by ${site.operator}`}
            </p>
          </div>

          {site.description && (
            <p className="text-base-content/80">{site.description}</p>
          )}

          {/* Facilities */}
          <div>
            <h2 className="text-xl font-bold mb-3">Facilities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Facility icon="💧" label="Drinking Water" value={site.drinking_water} />
              <Facility icon="🚻" label="Toilets" value={site.toilets} />
              <Facility icon="🚿" label="Showers" value={site.shower} />
              <Facility icon="🔌" label="Power Supply" value={site.power_supply} />
              <Facility icon="🔥" label="BBQ/Firepit" value={site.bbq} />
              <Facility icon="🐕" label="Pets Allowed" value={site.pets} />
            </div>
          </div>

          {/* Details */}
          <div>
            <h2 className="text-xl font-bold mb-3">Details</h2>
            <table className="table-auto text-sm">
              <tbody>
                <Info label="Type" value={typeLabel} />
                <Info label="State" value={stateName} />
                <Info label="Fee" value={site.fee === "yes" ? "Fees apply" : site.fee} />
                <Info label="Access" value={site.access} />
                <Info label="Capacity" value={site.capacity} />
                <Info label="Address" value={site.addr} />
                <Info label="Phone" value={site.phone} />
                {site.website && (
                  <tr>
                    <td className="font-medium pr-4 py-1">Website</td>
                    <td className="py-1">
                      <a href={site.website} target="_blank" rel="noopener" className="link link-primary">
                        {site.website.replace(/^https?:\/\//, "").slice(0, 40)}
                      </a>
                    </td>
                  </tr>
                )}
                <Info label="Coordinates" value={`${site.lat}, ${site.lon}`} />
              </tbody>
            </table>
          </div>
        </div>

        {/* Map */}
        <div className="lg:w-1/2">
          <div className="rounded-box overflow-hidden border border-base-300 sticky top-4">
            <MapView markers={markers} center={[site.lat, site.lon]} zoom={13} />
          </div>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Campground",
            name: site.name,
            description:
              site.description ||
              `${site.name} is a ${typeLabel.toLowerCase()} in ${stateName}, Australia.`,
            geo: {
              "@type": "GeoCoordinates",
              latitude: site.lat,
              longitude: site.lon,
            },
            address: {
              "@type": "PostalAddress",
              addressRegion: stateName,
              addressCountry: "AU",
              ...(site.addr && { streetAddress: site.addr }),
            },
            ...(site.phone && { telephone: site.phone }),
            ...(site.website && { url: site.website }),
          }),
        }}
      />
    </div>
  );
}
