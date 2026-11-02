export interface FilmingLocation {
  id: string;
  name: string;
  area: string;
  description: string;
  bestLight: string;
  favoriteLensOrDrone: string;
  coordinates: string;
  notableFilm: string;
}

export const FILMING_LOCATIONS: FilmingLocation[] = [
  {
    id: 'point-beach',
    name: 'Point Beach & Sea Wall',
    area: 'Kyaukphyu Peninsula, Bay of Bengal',
    description: 'The iconic western tip of Kyaukphyu where concrete sea barriers meet powerful ocean swells and rocky volcanic reefs.',
    bestLight: 'Golden Hour & Blue Hour Twilight (5:30 PM - 6:30 PM)',
    favoriteLensOrDrone: 'DJI Mavic Air 2 (Low 8m Fly-bys)',
    coordinates: '19.4292° N, 93.5398° E',
    notableFilm: 'Mavic Air 2 on Arakan Land, Kyaukphyu'
  },
  {
    id: 'maday-straits',
    name: 'Maday Island Maritime Straits',
    area: 'Kyaukphyu Archipelago',
    description: 'Vast marine passages surrounded by mangrove clusters, tidal mudflats, and deep ocean channels connecting the outer bay.',
    bestLight: 'Early Morning Calm (6:45 AM)',
    favoriteLensOrDrone: 'DJI Mavic Air 2 (High Altitude 120m Top-Down)',
    coordinates: '19.3812° N, 93.6821° E',
    notableFilm: 'Homesick'
  },
  {
    id: 'viewpoint-hill',
    name: 'Kyaukphyu Viewpoint & Pagoda Ridge',
    area: 'Central Kyaukphyu Heights',
    description: 'An elevated ridge overlooking the entire town, from the tranquil interior lakes to the distant maritime horizon.',
    bestLight: 'Sunrise Mist (6:00 AM)',
    favoriteLensOrDrone: 'Sony ZV-E10 + Sigma 30mm f/1.4',
    coordinates: '19.4225° N, 93.5480° E',
    notableFilm: 'HOPE'
  },
  {
    id: 'ferry-harbour',
    name: 'Gyaing Bay & Old Wooden Pier',
    area: 'Southern Portside Inlet',
    description: 'A bustling haven of wooden longtail boats, ferry crossings, and salt-seasoned timber walkways full of warmth.',
    bestLight: 'Late Afternoon Warm Dappled Light',
    favoriteLensOrDrone: 'DJI Osmo Pocket (Eye-level Stabilized Walk)',
    coordinates: '19.4140° N, 93.5610° E',
    notableFilm: 'Monn'
  }
];
