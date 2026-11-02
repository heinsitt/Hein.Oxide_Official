export interface Film {
  id: string;
  title: string;
  youtubeId: string;
  youtubeUrl: string;
  thumbnail: string;
  duration: string;
  views: string;
  releaseDate: string;
  year: string;
  category: 'aerial' | 'narrative' | 'documentary';
  location: string;
  gearUsed: string;
  description: string;
  directorNotes: string;
  technicalSpecs: {
    resolution: string;
    frameRate: string;
    colorProfile: string;
    audio: string;
    keyEquipment?: string;
  };
}

export const FILMS: Film[] = [
  {
    id: 'kyaukphyu-arakan',
    title: 'Mavic Air 2 on Arakan Land, Kyaukphyu',
    youtubeId: 'RanG4seGYcU',
    youtubeUrl: 'https://www.youtube.com/watch?v=RanG4seGYcU&t=4s',
    thumbnail: '/assets/aistudio/thumb-kyaukphyu_7e262704.jpg',
    duration: '2:50',
    views: '1.5K',
    releaseDate: '4 years ago',
    year: '2020',
    category: 'aerial',
    location: 'Kyaukphyu Coast, Arakan',
    gearUsed: 'DJI Mavic Air 2',
    description: 'An aerial contemplation over the sea walls, sandy headlands, and turquoise waters of Kyaukphyu on the Arakan coastline.',
    directorNotes: 'Filmed during the golden hour tide change. Flying low over the rocky breakers while the water mirrored the violet clouds.',
    technicalSpecs: {
      resolution: '4K Ultra HD (3840x2160)',
      frameRate: '60 fps',
      colorProfile: 'D-Log M 10-bit',
      audio: 'Ambient Waves & Atmospheric Synth Score',
      keyEquipment: 'PolarPro ND16/PL Filter'
    }
  },
  {
    id: 'august-kyaukphyu',
    title: 'Sony ZV-E10 x Sigma 30mm f1.4 | Rakhine, Kyaukphyu',
    youtubeId: '6w71gfyVjcY',
    youtubeUrl: 'https://www.youtube.com/watch?v=6w71gfyVjcY',
    thumbnail: '/assets/aistudio/thumb-august_60aeed44.jpg',
    duration: '1:19',
    views: '780',
    releaseDate: '2 years ago',
    year: '2022',
    category: 'narrative',
    location: 'Kyaukphyu Town & Coastline',
    gearUsed: 'Sony ZV-E10 · Sigma 30mm f/1.4',
    description: 'A delicate visual poem featuring Soung Nilar Yadi Thant, set against coastal roads and dappled afternoon sunlight.',
    directorNotes: 'Captured entirely with the Sigma 30mm wide open at f/1.4. The lens separates subjects from the coastal foliage with creamy, organic roll-off.',
    technicalSpecs: {
      resolution: '4K (3840x2160)',
      frameRate: '24 fps',
      colorProfile: 'S-Log3 / S-Gamut3.Cine',
      audio: 'Taylor Swift - August Acoustic Cut',
      keyEquipment: 'Sigma 30mm f/1.4 DC DN'
    }
  },
  {
    id: 'homesick',
    title: 'Homesick',
    youtubeId: 'pNv5BvziQSA',
    youtubeUrl: 'https://www.youtube.com/watch?v=pNv5BvziQSA&t=1s',
    thumbnail: '/assets/aistudio/thumb-homesick_0d095bd7.jpg',
    duration: '2:21',
    views: '363',
    releaseDate: '5 years ago',
    year: '2019',
    category: 'documentary',
    location: 'Kyaukphyu Estuary & Sandbars',
    gearUsed: 'DJI Spark',
    description: 'A nostalgic reflection from above looking down on the curving river estuaries, coconut groves, and long sandbanks.',
    directorNotes: 'Created when I was away from my home coast. The aerial perspective captured that ache of distance and the longing for quiet shores.',
    technicalSpecs: {
      resolution: '1080p Full HD',
      frameRate: '30 fps',
      colorProfile: 'Standard Natural',
      audio: 'Acoustic Piano & Ocean Wind',
      keyEquipment: 'DJI Spark 2-axis Gimbal'
    }
  },
  {
    id: 'hope',
    title: 'HOPE',
    youtubeId: 'bkp-zhMlH-c',
    youtubeUrl: 'https://www.youtube.com/watch?v=bkp-zhMlH-c',
    thumbnail: '/assets/aistudio/thumb-hope_1bcea640.jpg',
    duration: '1:21',
    views: '115',
    releaseDate: '5 years ago',
    year: '2019',
    category: 'narrative',
    location: 'Arakan Horizon Plains',
    gearUsed: 'Sony Mirrorless & DJI Drone',
    description: 'A lone figure standing before the vast twilight sky as the sun dips beneath the horizon. A meditation on perseverance.',
    directorNotes: 'We timed this shot for the exact 8 minutes of civil twilight when the sky turned royal purple and deep ember gold.',
    technicalSpecs: {
      resolution: '4K Ultra HD',
      frameRate: '30 fps',
      colorProfile: 'Cine4 Warm Sunset Grade',
      audio: 'Ethereal Post-Rock Soundscape',
      keyEquipment: '3D Silhouette Lettering Composite'
    }
  },
  {
    id: 'monn',
    title: 'Monn',
    youtubeId: 'OqAjsYttrBA',
    youtubeUrl: 'https://www.youtube.com/watch?v=OqAjsYttrBA',
    thumbnail: '/assets/aistudio/thumb-monn_7b87d4d7.jpg',
    duration: '1:36',
    views: '190',
    releaseDate: '5 years ago',
    year: '2019',
    category: 'documentary',
    location: 'Kyaukphyu Riverport & Ferries',
    gearUsed: 'DJI Osmo Pocket',
    description: 'Portraits of passengers, wooden water taxis, and the warm river winds at the Kyaukphyu ferry pier.',
    directorNotes: 'The Osmo Pocket was small enough to blend in naturally without putting a wall of glass between me and the people living here.',
    technicalSpecs: {
      resolution: '4K Ultra HD',
      frameRate: '30 fps',
      colorProfile: 'D-Cinelike',
      audio: 'Live Environmental Audio & Warm Strings',
      keyEquipment: 'DJI Osmo Pocket 3-Axis'
    }
  },
  {
    id: 'showreel-2020',
    title: 'Drone Showreel 2020',
    youtubeId: 'CHKP7huSCns',
    youtubeUrl: 'https://www.youtube.com/watch?v=CHKP7huSCns',
    thumbnail: '/assets/aistudio/thumb-showreel_20efdc27.jpg',
    duration: '1:46',
    views: '128',
    releaseDate: '5 years ago',
    year: '2020',
    category: 'aerial',
    location: 'Across Rakhine State',
    gearUsed: 'DJI Mavic Air 2 & DJI Spark',
    description: 'A dynamic montage of coastal flyovers, low skimming over sandy flats, and high-altitude mountain ridgeline reveals.',
    directorNotes: 'Pushed the Mavic Air 2 in Sport Mode to achieve aggressive parallax motion against the background hills.',
    technicalSpecs: {
      resolution: '4K Ultra HD',
      frameRate: '60 fps',
      colorProfile: 'Custom Graded Rec.709',
      audio: 'Cinematic Orchestral Trailer Mix',
      keyEquipment: 'DJI Smart Controller'
    }
  }
];
