#!/usr/bin/env python3
"""Scrape Australian camping & caravan sites from OpenStreetMap via Overpass API."""

import json
import urllib.request
import urllib.parse
import os
import time

QUERY = """
[out:json][timeout:120];
area["ISO3166-1"="AU"]->.a;
(
  node["tourism"="camp_site"](area.a);
  node["tourism"="caravan_site"](area.a);
  way["tourism"="camp_site"](area.a);
  way["tourism"="caravan_site"](area.a);
);
out center tags;
"""

STATE_BOUNDS = {
    "NSW": (-37.5, 140.9, -28.2, 153.6),
    "VIC": (-39.2, 140.9, -33.9, 150.0),
    "QLD": (-29.2, 138.0, -10.0, 153.6),
    "SA": (-38.1, 129.0, -26.0, 141.0),
    "WA": (-35.2, 112.9, -13.7, 129.0),
    "TAS": (-43.7, 143.8, -39.6, 148.5),
    "NT": (-26.0, 129.0, -10.9, 138.0),
    "ACT": (-35.9, 148.7, -35.1, 149.4),
}

def lat_to_state(lat, lon):
    for state, (s, w, n, e) in STATE_BOUNDS.items():
        if s <= lat <= n and w <= lon <= e:
            return state
    return "Other"

def main():
    print("Fetching camping sites from Overpass API...")
    url = "https://overpass-api.de/api/interpreter"
    data = urllib.parse.urlencode({"data": QUERY}).encode()
    req = urllib.request.Request(url, data=data)
    
    with urllib.request.urlopen(req, timeout=180) as resp:
        result = json.loads(resp.read().decode())
    
    elements = result.get("elements", [])
    print(f"Got {len(elements)} raw elements")
    
    sites = []
    seen = set()
    
    for el in elements:
        tags = el.get("tags", {})
        name = tags.get("name", "").strip()
        if not name:
            continue
            
        lat = el.get("lat") or el.get("center", {}).get("lat")
        lon = el.get("lon") or el.get("center", {}).get("lon")
        if not lat or not lon:
            continue
        
        key = f"{name}-{round(lat,3)}-{round(lon,3)}"
        if key in seen:
            continue
        seen.add(key)
        
        tourism = tags.get("tourism", "camp_site")
        site_type = "caravan_park" if tourism == "caravan_site" else "campground"
        
        site = {
            "name": name,
            "lat": round(lat, 6),
            "lon": round(lon, 6),
            "type": site_type,
            "state": lat_to_state(lat, lon),
            "slug": name.lower().replace(" ", "-").replace("'", "")[:60],
            "phone": tags.get("phone", ""),
            "website": tags.get("website", ""),
            "fee": tags.get("fee", ""),
            "access": tags.get("access", ""),
            "capacity": tags.get("capacity", ""),
            "drinking_water": tags.get("drinking_water", ""),
            "toilets": "yes" if tags.get("toilets") or tags.get("amenity") == "toilets" else "",
            "shower": tags.get("shower", ""),
            "power_supply": tags.get("power_supply", ""),
            "bbq": "yes" if tags.get("bbq") or tags.get("leisure") == "firepit" else "",
            "pets": tags.get("dog", tags.get("pets", "")),
            "operator": tags.get("operator", ""),
            "description": tags.get("description", ""),
            "addr": tags.get("addr:full", tags.get("addr:street", "")),
        }
        sites.append(site)
    
    # Deduplicate slugs
    slug_count = {}
    for s in sites:
        slug = s["slug"]
        if slug in slug_count:
            slug_count[slug] += 1
            s["slug"] = f"{slug}-{slug_count[slug]}"
        else:
            slug_count[slug] = 0
    
    sites.sort(key=lambda x: (x["state"], x["name"]))
    
    out_dir = os.path.join(os.path.dirname(__file__), "..", "src", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "camping-sites.json")
    
    with open(out_path, "w") as f:
        json.dump(sites, f, indent=2)
    
    # Stats
    by_state = {}
    by_type = {"campground": 0, "caravan_park": 0}
    for s in sites:
        by_state[s["state"]] = by_state.get(s["state"], 0) + 1
        by_type[s["type"]] += 1
    
    print(f"\nTotal named sites: {len(sites)}")
    print(f"Campgrounds: {by_type['campground']}, Caravan parks: {by_type['caravan_park']}")
    print("By state:")
    for state in sorted(by_state.keys()):
        print(f"  {state}: {by_state[state]}")

if __name__ == "__main__":
    main()
