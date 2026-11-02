export interface GearItem {
  id: string;
  name: string;
  category: string;
  role: string;
  image: string;
  summary: string;
  specs: {
    label: string;
    value: string;
  }[];
  filmmakerThoughts: string;
  featuredIn: string[];
}

export const GEAR_ITEMS: GearItem[] = [
  {
    id: 'mavic-air-2',
    name: 'DJI Mavic Air 2',
    category: 'Aerial Drone',
    role: 'Primary Flight Workhorse',
    image: '/assets/aistudio/djimavicair2_10e777c0.jpg',
    summary: 'The centerpiece of my aerial cinematography over Rakhine. Combines rock-solid wind resistance with 4K/60fps 10-bit color.',
    specs: [
      { label: 'Sensor', value: '1/2" Quad Bayer CMOS (48 MP)' },
      { label: 'Video Resolution', value: '4K @ 60fps / HDR Video' },
      { label: 'Max Flight Time', value: '34 Minutes' },
      { label: 'Transmission', value: 'OcuSync 2.0 (10 km range)' },
      { label: 'Wind Resistance', value: 'Level 5 (Up to 10.5 m/s)' },
      { label: 'Color Profile', value: 'D-Log M & HDR' }
    ],
    filmmakerThoughts: 'When ocean gusts pick up along Kyaukphyu bay, the Mavic Air 2 holds its coordinate anchor like stone. D-Log M gives me the headroom to preserve highlights in tropical sunbreaks.',
    featuredIn: ['Mavic Air 2 on Arakan Land', 'Drone Showreel 2020']
  },
  {
    id: 'sony-zve10',
    name: 'Sony ZV-E10 + Sigma 30mm f/1.4',
    category: 'Mirrorless Camera',
    role: 'Cinematic Narrative & Bokeh',
    image: '/assets/aistudio/sonyzv-e10_7b376711.jpg',
    summary: 'My primary ground setup. APS-C sensor paired with the ultra-fast Sigma 30mm prime for painterly shallow depth of field.',
    specs: [
      { label: 'Sensor', value: '24.2 MP APS-C Exmor CMOS' },
      { label: 'Primary Lens', value: 'Sigma 30mm f/1.4 DC DN Contemporary' },
      { label: 'Autofocus', value: 'Real-Time Eye AF & Tracking' },
      { label: 'Color Science', value: 'S-Log3 / S-Gamut3.Cine' },
      { label: 'Form Factor', value: '343g Ultra-Lightweight Body' },
      { label: 'Audio Input', value: 'Directional 3-Capsule Mic + Windscreen' }
    ],
    filmmakerThoughts: 'The Sigma 30mm at f/1.4 produces that creamy separation where coastal portraits look timeless. Compact enough to carry all afternoon without fatigue.',
    featuredIn: ['Sony ZV-E10 x Sigma 30mm | August', 'HOPE']
  },
  {
    id: 'osmo-pocket',
    name: 'DJI Osmo Pocket',
    category: 'Gimbal Camera',
    role: 'Run & Gun Stabilization',
    image: '/assets/aistudio/djiosmopocket_1501ff41.jpg',
    summary: 'Pocket-sized 3-axis mechanical gimbal camera for immediate, discreet coastal documentation and boat journeys.',
    specs: [
      { label: 'Gimbal', value: '3-Axis Mechanical Stabilization' },
      { label: 'Sensor', value: '1/2.3" CMOS (12 MP)' },
      { label: 'Video', value: '4K Ultra HD @ 60fps (100Mbps)' },
      { label: 'Weight', value: '116 grams' },
      { label: 'Modes', value: 'Story Mode, FPV, Motionlapse' },
      { label: 'Battery Life', value: 'Up to 140 minutes' }
    ],
    filmmakerThoughts: 'Whenever I jump onto wooden ferry boats or stroll crowded night markets in Rakhine, bulky rigs intimidate people. The Osmo Pocket lets people behave naturally.',
    featuredIn: ['Monn', 'Travel Archives']
  },
  {
    id: 'dji-spark',
    name: 'DJI Spark',
    category: 'Compact Drone',
    role: 'The Genesis Flight Companion',
    image: '/assets/aistudio/djispark_f3a79526.jpg',
    summary: 'Where the flight journey began in 2019. Small, fearless, and the drone that taught me how to read horizons from the sky.',
    specs: [
      { label: 'Takeoff Weight', value: '300 grams' },
      { label: 'Max Speed', value: '50 km/h (Sport Mode)' },
      { label: 'Gimbal', value: '2-Axis Mechanical' },
      { label: 'Camera', value: '12 MP / 1080p 30fps' },
      { label: 'Flight Range', value: '2 km HD Wi-Fi' },
      { label: 'Control', value: 'Gesture & Remote Control' }
    ],
    filmmakerThoughts: 'Even though newer drones are more capable, the Spark was pure freedom. It taught me how to find the coastline line and respect the wind.',
    featuredIn: ['Homesick', 'First Flight Montages']
  }
];
