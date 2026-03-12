import Link from "next/link";
import { allSites, getStateCounts, STATES } from "@/lib/data";

const STATE_EMOJI: Record<string, string> = {
  NSW: "🏖️",
  VIC: "🏔️",
  QLD: "🌴",
  SA: "🍷",
  WA: "🌊",
  TAS: "🌲",
  NT: "🏜️",
  ACT: "🏛️",
};

export default function Home() {
  const counts = getStateCounts();
  const total = allSites.length;
  const campgrounds = allSites.filter((s) => s.type === "campground").length;
  const caravanParks = total - campgrounds;

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="hero min-h-[40vh] bg-base-200 rounded-box">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold">
              🏕️ AU Camping & Caravan Park Directory
            </h1>
            <p className="py-6 text-lg text-base-content/70">
              Discover {total.toLocaleString()} camping grounds and caravan
              parks across every state and territory in Australia. Free, open
              data — no app required.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-title">Total Sites</div>
          <div className="stat-value">{total.toLocaleString()}</div>
          <div className="stat-desc">OpenStreetMap data</div>
        </div>
        <div className="stat">
          <div className="stat-title">Campgrounds</div>
          <div className="stat-value">{campgrounds.toLocaleString()}</div>
          <div className="stat-desc">⛺ Tent & bush camping</div>
        </div>
        <div className="stat">
          <div className="stat-title">Caravan Parks</div>
          <div className="stat-value">{caravanParks.toLocaleString()}</div>
          <div className="stat-desc">🚐 Powered sites & facilities</div>
        </div>
        <div className="stat">
          <div className="stat-title">States & Territories</div>
          <div className="stat-value">8</div>
          <div className="stat-desc">All covered</div>
        </div>
      </section>

      {/* Browse by State */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Browse by State</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(STATES).map(([code, name]) => (
            <Link
              key={code}
              href={`/state/${code.toLowerCase()}`}
              className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-300"
            >
              <div className="card-body items-center text-center p-6">
                <span className="text-3xl">
                  {STATE_EMOJI[code] || "📍"}
                </span>
                <h3 className="card-title text-lg">{name}</h3>
                <p className="text-base-content/60">
                  {(counts[code] || 0).toLocaleString()} sites
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "AU Camping & Caravan Park Directory",
            url: "https://camping.rollersoft.com.au",
            description: `Directory of ${total} camping grounds and caravan parks across Australia`,
            potentialAction: {
              "@type": "SearchAction",
              target: "https://camping.rollersoft.com.au/state/{search_term}",
              "query-input": "required name=search_term",
            },
          }),
        }}
      />
    </div>
  );
}
