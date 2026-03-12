import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AU Camping & Caravan Park Directory",
    template: "%s | AU Camping Directory",
  },
  description:
    "Find 8,500+ camping grounds and caravan parks across Australia. Free directory with maps, facilities info, and state-by-state listings.",
  openGraph: {
    title: "AU Camping & Caravan Park Directory",
    description:
      "Find 8,500+ camping grounds and caravan parks across Australia.",
    url: "https://camping.rollersoft.com.au",
    siteName: "AU Camping Directory",
    locale: "en_AU",
    type: "website",
  },
  alternates: { canonical: "https://camping.rollersoft.com.au" },
  robots: { index: true, follow: true },
};

const NAV_STATES = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="forest">
      <body className="min-h-screen bg-base-100 flex flex-col">
        <header className="navbar bg-primary text-primary-content shadow-lg">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <Link className="text-xl font-bold" href="/">
              🏕️ AU Camping Directory
            </Link>
            <nav className="hidden md:flex gap-2">
              {NAV_STATES.map((s) => (
                <Link
                  key={s}
                  href={`/state/${s.toLowerCase()}`}
                  className="btn btn-ghost btn-sm text-primary-content"
                >
                  {s}
                </Link>
              ))}
            </nav>
            <div className="dropdown dropdown-end md:hidden">
              <label tabIndex={0} className="btn btn-ghost btn-sm">
                States ▾
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 text-base-content rounded-box w-40 z-50"
              >
                {NAV_STATES.map((s) => (
                  <li key={s}>
                    <Link href={`/state/${s.toLowerCase()}`}>{s}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
        <footer className="footer footer-center p-6 bg-base-200 text-base-content">
          <p>
            © {new Date().getFullYear()} AU Camping Directory. Data from{" "}
            <a
              href="https://www.openstreetmap.org"
              className="link"
              target="_blank"
              rel="noopener"
            >
              OpenStreetMap
            </a>{" "}
            contributors. A{" "}
            <a href="https://rollersoft.com.au" className="link">
              Rollersoft
            </a>{" "}
            project.
          </p>
        </footer>
      </body>
    </html>
  );
}
