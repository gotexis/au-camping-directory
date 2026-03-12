export interface CampingSite {
  name: string;
  lat: number;
  lon: number;
  type: "campground" | "caravan_park";
  state: string;
  slug: string;
  phone: string;
  website: string;
  fee: string;
  access: string;
  capacity: string;
  drinking_water: string;
  toilets: string;
  shower: string;
  power_supply: string;
  bbq: string;
  pets: string;
  operator: string;
  description: string;
  addr: string;
}

import rawData from "@/data/camping-sites.json";

export const allSites: CampingSite[] = rawData as CampingSite[];

export const STATES: Record<string, string> = {
  NSW: "New South Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  SA: "South Australia",
  WA: "Western Australia",
  TAS: "Tasmania",
  NT: "Northern Territory",
  ACT: "Australian Capital Territory",
};

export function getSitesByState(state: string): CampingSite[] {
  return allSites.filter((s) => s.state === state.toUpperCase());
}

export function getSiteBySlug(slug: string): CampingSite | undefined {
  return allSites.find((s) => s.slug === slug);
}

export function getStateCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const s of allSites) {
    counts[s.state] = (counts[s.state] || 0) + 1;
  }
  return counts;
}
