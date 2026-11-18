import React, { useState, useEffect, useMemo } from 'react';
import {
  Wind,
  Sparkles,
  Home,
  Leaf,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  MapPin,
  Flame,
  CheckCircle2,
  RefreshCw,
  Send,
  Sliders,
  Zap,
  Heart,
  Shield,
  Volume2,
  Play,
  Award,
  Trees,
  Lock,
  Unlock,
  Droplets,
  Fan,
  Smile,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';

// ==========================================
// PRESET CITIES (KID-FRIENDLY + TELEMETRY)
// ==========================================
const CITY_PRESETS = [
  {
    id: 'delhi',
    name: 'Delhi NCR',
    emoji: '🕌',
    aqi: 412,
    pm25: 295,
    temp: '11°C 🥶',
    lidHeight: 22, // % from ground (low lid = trapped smog!)
    goldenWindow: '1:30 PM – 3:45 PM ☀️',
    shortTag: 'Thick Winter Smog Blanket'
  },
  {
    id: 'salem_chennai',
    name: 'Salem / Chennai',
    emoji: '🌴',
    aqi: 142,
    pm25: 68,
    temp: '23°C 🌤️',
    lidHeight: 58,
    goldenWindow: '11:00 AM – 4:00 PM ☀️',
    shortTag: 'Morning Mist & Traffic Haze'
  },
  {
    id: 'lahore',
    name: 'Lahore',
    emoji: '🏰',
    aqi: 385,
    pm25: 268,
    temp: '12°C 🥶',
    lidHeight: 25,
    goldenWindow: '1:00 PM – 3:30 PM ☀️',
    shortTag: 'Heavy Cold Fog Trap'
  },
  {
    id: 'beijing',
    name: 'Beijing',
    emoji: '🏮',
    aqi: 245,
    pm25: 194,
    temp: '2°C ❄️',
    lidHeight: 40,
    goldenWindow: '12:30 PM – 3:30 PM ☀️',
    shortTag: 'Icy Mountain Basin Haze'
  },
  {
    id: 'milan',
    name: 'Milan',
    emoji: '🏔️',
    aqi: 168,
    pm25: 89,
    temp: '5°C 🧣',
    lidHeight: 48,
    goldenWindow: '12:00 PM – 3:00 PM ☀️',
    shortTag: 'Valley Cold Air Lid'
  }
];

// ==========================================
// VISUAL FAMILY SQUAD AVATARS
// ==========================================
const FAMILY_AVATARS = [
  { id: 'kids', emoji: '🧒', label: 'Kids', perk: 'Fast breathers! Need indoor play games 🎈' },
  { id: 'elderly', emoji: '👵', label: 'Grandparents', perk: 'Extra lung shield & warm steam ☕' },
  { id: 'pets', emoji: '🐶', label: 'Pets', perk: 'Walk only in sunny 2 PM window 🐾' },
  { id: 'commuter', emoji: '🛵', label: 'Commuter', perk: 'N95 Hero Mask + Metro/Carpool 🚇' }
];

// ==========================================
// TAB 1: 24-HOUR TIME-TRAVEL STAGES
// ==========================================
const TIME_STAGES = [
  {
    id: 'morning',
    time: '6 AM – 9 AM',
    title: 'Cold Smog Blanket Trap!',
    emoji: '🥶🌫️',
    skyGradient: 'from-slate-900 via-rose-950/80 to-amber-950/70',
    sunY: 75,
    lidY: 62, // Low lid pressing smog down
    smogMultiplier: 1.25,
    windowOpen: false,
    visualWhy: 'Cold morning air acts like a heavy pot lid, trapping car smoke right at nose level!',
    badHabit: { emoji: '🏃‍♂️💨', text: 'Morning Park Run & Open Windows' },
    heroAction: { emoji: '🔒🧘', text: 'Lock Windows + Indoor Yoga & Fan Filter' },
    impactText: '+78% Cleaner Lungs',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40'
  },
  {
    id: 'midday_rise',
    time: '10 AM – 12 PM',
    title: 'Sun Warms the Sky Lid!',
    emoji: '🌤️🚇',
    skyGradient: 'from-sky-950 via-amber-900/50 to-slate-900',
    sunY: 42,
    lidY: 42, // Lid rising higher
    smogMultiplier: 0.95,
    windowOpen: false,
    visualWhy: 'Sunlight warms the ground and pushes the invisible smog lid higher into the sky.',
    badHabit: { emoji: '🛵💨', text: 'Solo Scooter without Mask in Traffic' },
    heroAction: { emoji: '😷🚇', text: 'N95 Hero Mask + Carpool / Metro Ride' },
    impactText: '-82% Tailpipe Smoke',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40'
  },
  {
    id: 'golden_window',
    time: '1 PM – 4 PM',
    title: 'Golden Fresh-Air Window!',
    emoji: '☀️🪟',
    skyGradient: 'from-sky-600/80 via-teal-800/60 to-slate-900',
    sunY: 18,
    lidY: 16, // Highest lid! Smog disperses
    smogMultiplier: 0.62,
    windowOpen: true,
    visualWhy: 'The sun punches through the cold lid! Smog thins out to its lowest level all day.',
    badHabit: { emoji: '🛋️🔒', text: 'Keeping Stale CO2 Trapped All Day' },
    heroAction: { emoji: '🪟🐕', text: 'Open Windows 20 Mins + Walk Pets Now!' },
    impactText: '100% Fresh Oxygen Boost',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
  },
  {
    id: 'night_trap',
    time: '6 PM – 10 PM',
    title: 'Night Smog Lid Drops!',
    emoji: '🌙🍲',
    skyGradient: 'from-indigo-950 via-slate-900 to-rose-950/60',
    sunY: 85,
    lidY: 58, // Lid drops back down at night
    smogMultiplier: 1.18,
    windowOpen: false,
    visualWhy: 'When the sun goes down, the ground cools fast and the smog blanket drops back down!',
    badHabit: { emoji: '🍳🔥', text: 'Unvented Frying + Bonfires Outside' },
    heroAction: { emoji: '🌀🧣', text: 'Kitchen Chimney ON + Door Draft Towel' },
    impactText: '-85% Night Lung Shield',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40'
  }
];

// ==========================================
// TAB 2: CUTAWAY HOUSE IAQ POWER-UPS
// ==========================================
const HOUSE_HACKS = [
  {
    id: 'box_fan',
    name: 'DIY Box-Fan Cube',
    emoji: '📦🌀',
    powerCut: 48,
    cost: 'Low Cost ($35)',
    shortDesc: 'Fan + 4 Filters sucks grey smog & blows sparkling blue bubbles!',
    zone: 'Living Room Center'
  },
  {
    id: 'window_seal',
    name: 'Window Forcefield Seal',
    emoji: '🪟🛡️',
    powerCut: 24,
    cost: 'Free (Wet Towel / Tape)',
    shortDesc: 'Blocks sneaky outside smog monsters from crawling through cracks!',
    zone: 'Window & Door Frame'
  },
  {
    id: 'kitchen_exhaust',
    name: 'Tadka Smoke Vacuum',
    emoji: '🍳💨',
    powerCut: 22,
    cost: 'Free Habit',
    shortDesc: 'Sucks orange cooking smoke straight out the chimney pipe!',
    zone: 'Kitchen Stove'
  },
  {
    id: 'wet_mop',
    name: 'Wet Mop Magic',
    emoji: '🪣✨',
    powerCut: 18,
    cost: 'Free Habit',
    shortDesc: 'Traps floor dust in water so brooms never launch it into your nose!',
    zone: 'House Floor'
  },
  {
    id: 'plant_squad',
    name: 'Green Oxygen Squad',
    emoji: '🪴💚',
    powerCut: 10,
    cost: '3 Indoor Plants',
    shortDesc: 'Areca Palm & Snake Plants sip stale CO2 and keep noses moist!',
    zone: 'Sunny Corner'
  }
];

// ==========================================
// TAB 3: ECO-SWAP ARCADE CARDS
// ==========================================
const ECO_SWAPS = [
  {
    id: 'ride',
    title: 'Morning School & Work Ride',
    badEmoji: '🛵💨',
    badTitle: 'Solo Cold-Engine Car/Bike',
    badVisual: 'Puffs 4x more black smoke into cold morning air!',
    goodEmoji: '🚇⚡',
    goodTitle: 'Metro / Carpool Pod / EV',
    goodVisual: 'Zero tailpipe smoke + 75% cleaner cabin air!',
    balloonsSaved: 18, // Clean air balloons per day
    pmSavedGrams: 22
  },
  {
    id: 'warmth',
    title: 'Staying Warm in Winter',
    badEmoji: '🔥🪵',
    badTitle: 'Burning Wood / Charcoal Fire',
    badVisual: '1 small fire fills an entire street with toxic smog!',
    goodEmoji: '🧣🔌',
    goodTitle: 'Cozy Sweaters + Hot Water Bag',
    goodVisual: '100% smoke-free warmth for family & security guards!',
    balloonsSaved: 65,
    pmSavedGrams: 145
  },
  {
    id: 'leaves',
    title: 'Garden & Street Leaves',
    badEmoji: '🍂🔥',
    badTitle: 'Burning Dry Leaves Pile',
    badVisual: 'Sends thick black soot straight into bedroom windows!',
    goodEmoji: '🌱♻️',
    goodTitle: 'Leaf Mulch & Garden Compost',
    goodVisual: 'Feeds soil, stops dust, and locks carbon underground!',
    balloonsSaved: 85,
    pmSavedGrams: 210
  },
  {
    id: 'cleaning',
    title: 'Daily Floor & Porch Cleaning',
    badEmoji: '🧹🌫️',
    badTitle: 'Dry Broom Dust Cloud',
    badVisual: 'Kicks settled road dust right back into kids’ lungs!',
    goodEmoji: '🪣💧',
    goodTitle: 'Wet Microfiber Mop & Sprinkle',
    goodVisual: 'Locks dust in water—zero floating dust clouds!',
    balloonsSaved: 24,
    pmSavedGrams: 35
  }
];

// ==========================================
// BREEZY THE LUNG BUDDY SVG MASCOT COMPONENT
// ==========================================
function BreezyMascot({ aqi, size = 110, forceMood = null, showSpeech = true }) {
  // Determine mood from AQI or override
  const mood = useMemo(() => {
    if (forceMood) return forceMood;
    if (aqi <= 60) return 'super_happy';
    if (aqi <= 140) return 'happy';
    if (aqi <= 250) return 'careful';
    return 'masked_hero';
  }, [aqi, forceMood]);

  const bodyColor =
    mood === 'super_happy'
      ? '#34d399'
      : mood === 'happy'
      ? '#2dd4bf'
      : mood === 'careful'
      ? '#fbbf24'
      : '#fb7185';

  const speechText =
    mood === 'super_happy'
      ? 'YAY! Sparkling clean air! My lungs are dancing! ✨'
      : mood === 'happy'
      ? 'Feeling good! Great job keeping smog away! 🌱'
      : mood === 'careful'
      ? 'A little hazy outside! Turn on our Box-Fan Cube! 📦'
      : 'Cough-cough! Thick smog alert! N95 Shield & Indoor Sanctuary ON! 😷🛡️';

  return (
    <div className="flex flex-col items-center relative select-none">
      {showSpeech && (
        <div className="mb-2 px-3 py-1.5 rounded-2xl bg-white text-slate-900 font-bold text-xs shadow-lg border-2 border-teal-400 max-w-[230px] text-center relative animate-bounce-slow">
          {speechText}
          <div className="w-3 h-3 bg-white border-r-2 border-b-2 border-teal-400 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
        </div>
      )}

      <svg
        width={size}
        height={size}
        viewBox="0 0 140 140"
        className="overflow-visible drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
      >
        {/* Glowing Aura behind Breezy */}
        <circle
          cx="70"
          cy="75"
          r="56"
          fill={bodyColor}
          opacity="0.22"
          className="animate-pulse"
        />

        {/* Sparkles when super happy */}
        {(mood === 'super_happy' || mood === 'happy') && (
          <g className="animate-spin-slow" style={{ transformOrigin: '70px 70px' }}>
            <circle cx="20" cy="30" r="4" fill="#fde047" />
            <circle cx="122" cy="35" r="5" fill="#38bdf8" />
            <circle cx="118" cy="110" r="4" fill="#4ade80" />
            <circle cx="22" cy="105" r="3.5" fill="#f472b6" />
          </g>
        )}

        {/* Smog puffs when high AQI */}
        {mood === 'masked_hero' && (
          <g className="animate-float">
            <circle cx="18" cy="48" r="8" fill="#64748b" opacity="0.6" />
            <circle cx="124" cy="52" r="9" fill="#64748b" opacity="0.6" />
          </g>
        )}

        {/* Breathing Animated Group */}
        <g className={mood === 'super_happy' ? 'animate-breezy-dance' : 'animate-breezy-breathe'}>
          {/* Trachea / Windpipe Crown */}
          <path
            d="M64 22 L64 42 M76 22 L76 42"
            stroke="#fda4af"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <rect x="61" y="20" width="18" height="18" rx="6" fill="#fb7185" />
          <line x1="63" y1="26" x2="77" y2="26" stroke="#fecdd3" strokeWidth="2" />
          <line x1="63" y1="32" x2="77" y2="32" stroke="#fecdd3" strokeWidth="2" />

          {/* Left Lung Lobe */}
          <path
            d="M65 40 C38 34, 18 55, 22 86 C25 108, 48 118, 63 104 C67 100, 67 52, 65 40 Z"
            fill={bodyColor}
            stroke="#ffffff"
            strokeWidth="3"
          />
          {/* Right Lung Lobe */}
          <path
            d="M75 40 C102 34, 122 55, 118 86 C115 108, 92 118, 77 104 C73 100, 73 52, 75 40 Z"
            fill={bodyColor}
            stroke="#ffffff"
            strokeWidth="3"
          />

          {/* Cute Rosie Cheeks */}
          <ellipse cx="40" cy="76" rx="6" ry="3.5" fill="#f43f5e" opacity="0.55" />
          <ellipse cx="100" cy="76" rx="6" ry="3.5" fill="#f43f5e" opacity="0.55" />

          {/* Expressive Eyes */}
          {mood === 'super_happy' ? (
            <>
              <path d="M40 64 Q47 55 54 64" stroke="#0f172a" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M86 64 Q93 55 100 64" stroke="#0f172a" strokeWidth="4" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="47" cy="64" r="6.5" fill="#0f172a" />
              <circle cx="45" cy="61.5" r="2.2" fill="#ffffff" />
              <circle cx="93" cy="64" r="6.5" fill="#0f172a" />
              <circle cx="91" cy="61.5" r="2.2" fill="#ffffff" />
            </>
          )}

          {/* Mouth or N95 Hero Mask */}
          {mood === 'masked_hero' ? (
            <g>
              {/* Elastic straps */}
              <line x1="25" y1="70" x2="52" y2="76" stroke="#e2e8f0" strokeWidth="2.5" />
              <line x1="115" y1="70" x2="88" y2="76" stroke="#e2e8f0" strokeWidth="2.5" />
              {/* N95 Shield Mask */}
              <path
                d="M48 74 Q70 64 92 74 L88 94 Q70 102 52 94 Z"
                fill="#f8fafc"
                stroke="#0ea5e9"
                strokeWidth="2.5"
              />
              <text x="61" y="88" fontSize="9" fontWeight="900" fill="#0284c7">
                N95
              </text>
            </g>
          ) : mood === 'careful' ? (
            <path d="M62 84 Q70 79 78 84" stroke="#0f172a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          ) : (
            <path
              d="M58 78 Q70 92 82 78 Z"
              fill="#0f172a"
            />
          )}

          {/* Cute Waving Arms */}
          <path
            d="M22 75 Q8 62 12 50"
            stroke={bodyColor}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M118 75 Q132 62 128 50"
            stroke={bodyColor}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
}

// ==========================================
// HELPER FOR COLOR & LABELS
// ==========================================
function getAqiVisualMeta(aqi) {
  if (aqi <= 60) {
    return {
      label: 'Sparkling Clean! ✨',
      badgeBg: 'bg-emerald-500 text-slate-950',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-400/50',
      smogOpacity: 0.06,
      particleCount: 4
    };
  }
  if (aqi <= 140) {
    return {
      label: 'A Little Hazy 🌤️',
      badgeBg: 'bg-amber-400 text-slate-950',
      textColor: 'text-amber-300',
      borderColor: 'border-amber-400/50',
      smogOpacity: 0.25,
      particleCount: 10
    };
  }
  if (aqi <= 260) {
    return {
      label: 'Smoggy! Careful 😷',
      badgeBg: 'bg-orange-500 text-white',
      textColor: 'text-orange-400',
      borderColor: 'border-orange-500/50',
      smogOpacity: 0.5,
      particleCount: 18
    };
  }
  return {
    label: 'Heavy Smog Alert! 🚨',
    badgeBg: 'bg-rose-500 text-white',
    textColor: 'text-rose-400',
    borderColor: 'border-rose-500/60',
    smogOpacity: 0.78,
    particleCount: 28
  };
}

export default function App() {
  // ==========================================
  // STATE
  // ==========================================
  const [selectedCityId, setSelectedCityId] = useState('delhi');
  const [outdoorAqi, setOutdoorAqi] = useState(412);
  const [lidTrapStrength, setLidTrapStrength] = useState(80); // 10 to 100% cold inversion lid
  const [selectedFamily, setSelectedFamily] = useState(['kids', 'elderly', 'pets']);
  const [activeTab, setActiveTab] = useState('house_game'); // 'house_game' | 'sky_clock' | 'eco_arcade' | 'ask_breezy'

  // Tab 1: 24-Hour Sky Clock State
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [autoPlayClock, setAutoPlayClock] = useState(false);

  // Tab 2: Cutaway House IAQ Game State
  const [activeHouseHacks, setActiveHouseHacks] = useState(['box_fan', 'window_seal', 'kitchen_exhaust', 'wet_mop']);
  const [lastClickedHack, setLastClickedHack] = useState(HOUSE_HACKS[0]);

  // Tab 3: Eco-Swap Arcade State
  const [adoptedSwaps, setAdoptedSwaps] = useState(['ride', 'warmth', 'leaves', 'cleaning']);
  const [neighborFamilies, setNeighborFamilies] = useState(120);

  // Tab 4: Ask Breezy AI Comic Generator State
  const [aiQuestion, setAiQuestion] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [comicStory, setComicStory] = useState({
    mascotMood: 'super_happy',
    headline: 'How Our DIY Box-Fan Cube Eats Smog! 📦✨',
    visualSteps: [
      {
        emoji: '📦🌀',
        shortTitle: '1. Tape 4 Filters to a Fan',
        kidFriendlyText: 'Tape 4 pleated MERV-13 filters into a cube with a box fan on top!',
        impactBadge: '-55% Smog Dots',
        animationType: 'fan_spin'
      },
      {
        emoji: '👾➡️🫧',
        shortTitle: '2. Trap Sticky Soot Monsters',
        kidFriendlyText: 'Dirty grey air gets pulled inside the cube walls and trapped tight!',
        impactBadge: '450 CFM Super Airflow',
        animationType: 'mask_shield'
      },
      {
        emoji: '☀️🪟',
        shortTitle: '3. 2 PM Fresh Air Boost',
        kidFriendlyText: 'Open windows for 15 mins at 2 PM when the sun lifts the sky lid!',
        impactBadge: '100% Happy Lungs',
        animationType: 'sun_lid'
      }
    ],
    funFact: 'Did you know? A $35 homemade Box-Fan Cube cleans a bedroom faster than many $300 store purifiers!'
  });

  const currentCity = useMemo(
    () => CITY_PRESETS.find((c) => c.id === selectedCityId) || CITY_PRESETS[0],
    [selectedCityId]
  );

  // Select a City Preset
  const handleSelectCity = (city) => {
    setSelectedCityId(city.id);
    setOutdoorAqi(city.aqi);
    setLidTrapStrength(100 - city.lidHeight);
  };

  // Auto-play 24-hour clock if toggled
  useEffect(() => {
    if (!autoPlayClock) return;
    const timer = setInterval(() => {
      setActiveStageIdx((prev) => (prev + 1) % TIME_STAGES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [autoPlayClock]);

  // Calculate Indoor AQI based on active House Hacks
  const indoorStats = useMemo(() => {
    let remaining = outdoorAqi * 0.75; // Unprotected home lets 75% of smog in
    HOUSE_HACKS.forEach((h) => {
      if (activeHouseHacks.includes(h.id)) {
        remaining *= 1 - h.powerCut / 100;
      }
    });
    const finalIndoorAqi = Math.max(12, Math.round(remaining));
    const outdoorCigs = (outdoorAqi * 0.7 / 22).toFixed(1);
    const indoorCigs = (finalIndoorAqi * 0.7 / 22).toFixed(1);
    const cigsBlocked = Math.max(0, (outdoorCigs - indoorCigs).toFixed(1));
    const percentSaved = Math.min(95, Math.round((1 - finalIndoorAqi / Math.max(1, outdoorAqi)) * 100));

    return {
      indoorAqi: finalIndoorAqi,
      outdoorCigs,
      indoorCigs,
      cigsBlocked,
      percentSaved,
      meta: getAqiVisualMeta(finalIndoorAqi)
    };
  }, [outdoorAqi, activeHouseHacks]);

  const outdoorMeta = useMemo(() => getAqiVisualMeta(outdoorAqi), [outdoorAqi]);

  // Calculate Eco-Swap Arcade Totals
  const arcadeStats = useMemo(() => {
    let balloonsPerFamily = 0;
    let gramsPerFamily = 0;
    ECO_SWAPS.forEach((s) => {
      if (adoptedSwaps.includes(s.id)) {
        balloonsPerFamily += s.balloonsSaved;
        gramsPerFamily += s.pmSavedGrams;
      }
    });
    const totalBalloons = balloonsPerFamily * neighborFamilies;
    const totalKgSmogStopped = ((gramsPerFamily * neighborFamilies * 60) / 1000).toFixed(1);
    const treesEq = Math.max(1, Math.round(totalBalloons / 18));
    return {
      balloonsPerFamily,
      totalBalloons,
      totalKgSmogStopped,
      treesEq
    };
  }, [adoptedSwaps, neighborFamilies]);

  // Toggle Family Member
  const toggleFamilyMember = (id) => {
    setSelectedFamily((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle House Hack
  const toggleHouseHack = (hack) => {
    setLastClickedHack(hack);
    setActiveHouseHacks((prev) =>
      prev.includes(hack.id) ? prev.filter((id) => id !== hack.id) : [...prev, hack.id]
    );
  };

  // Toggle Eco Swap
  const toggleEcoSwap = (id) => {
    setAdoptedSwaps((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // ==========================================
  // GEMINI API: VISUAL STORYBOOK GENERATOR
  // ==========================================
  const askBreezyAi = async (customPrompt) => {
    const query = customPrompt || aiQuestion;
    if (!query.trim()) return;
    setIsAiLoading(true);

    const systemInstruction = `You are "Breezy the Lung Buddy", a super friendly, playful animated mascot who explains winter smog, indoor air quality hacks, and low-emission habits to children and families using vivid visual metaphors and ultra-short, punchy text.
Context:
- City: ${currentCity.name}, Outdoor AQI: ${outdoorAqi}, Indoor Sanctuary AQI: ${indoorStats.indoorAqi}
- Keep every step title under 5 words and kidFriendlyText under 16 words!`;

    const payload = {
      contents: [{ parts: [{ text: query }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            mascotMood: { type: 'STRING' },
            headline: { type: 'STRING' },
            visualSteps: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  emoji: { type: 'STRING' },
                  shortTitle: { type: 'STRING' },
                  kidFriendlyText: { type: 'STRING' },
                  impactBadge: { type: 'STRING' },
                  animationType: { type: 'STRING' }
                },
                propertyOrdering: ['emoji', 'shortTitle', 'kidFriendlyText', 'impactBadge', 'animationType']
              }
            },
            funFact: { type: 'STRING' }
          },
          propertyOrdering: ['mascotMood', 'headline', 'visualSteps', 'funFact']
        }
      }
    };

    const apiKey = '';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      const parsed = JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text);
      if (parsed && parsed.visualSteps) {
        setComicStory(parsed);
      }
    } catch (e) {
      // Instant Kid-Friendly Visual Fallback
      setComicStory({
        mascotMood: 'super_happy',
        headline: `Breezy's Magic Plan: "${query.slice(0, 32)}" ✨`,
        visualSteps: [
          {
            emoji: '🥶🍲',
            shortTitle: '1. Beat the Cold Sky Lid',
            kidFriendlyText: 'Cold morning air traps smoke like a pot lid—keep windows locked till noon!',
            impactBadge: '-75% Morning Smog',
            animationType: 'sun_lid'
          },
          {
            emoji: '📦🫧',
            shortTitle: '2. Run Our Fan Filter Cube',
            kidFriendlyText: 'Turn on your MERV-13 Box Fan and use a wet mop so dust never floats!',
            impactBadge: 'Indoor AQI < 35',
            animationType: 'fan_spin'
          },
          {
            emoji: '🍊🛡️',
            shortTitle: '3. Vitamin C + N95 Shield',
            kidFriendlyText: 'Crunch oranges & broccoli and wear your N95 Hero Mask outdoors!',
            impactBadge: '95% Lung Armor',
            animationType: 'mask_shield'
          }
        ],
        funFact: `In ${currentCity.name}, opening windows for 15 minutes at 2:30 PM gives you the cleanest air of the whole day!`
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-16 overflow-x-hidden selection:bg-teal-400 selection:text-slate-950">
      {/* ==========================================
          CUSTOM KEYFRAME ANIMATIONS FOR KIDS & VISUALS
         ========================================== */}
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-10px) translateX(6px); }
        }
        @keyframes breezyBreathe {
          0%, 100% { transform: scale(1) translateY(0px); }
          50% { transform: scale(1.06) translateY(-4px); }
        }
        @keyframes breezyDance {
          0%, 100% { transform: rotate(-4deg) scale(1.04); }
          50% { transform: rotate(4deg) scale(1.09) translateY(-6px); }
        }
        @keyframes windStream {
          0% { stroke-dashoffset: 60; opacity: 0.2; }
          50% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0.2; }
        }
        @keyframes bubbleRise {
          0% { transform: translateY(15px) scale(0.6); opacity: 0; }
          50% { opacity: 0.95; }
          100% { transform: translateY(-45px) scale(1.15); opacity: 0; }
        }
        @keyframes lidPulse {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(5px); }
        }
        .animate-float { animation: floatSlow 4s ease-in-out infinite; }
        .animate-breezy-breathe { animation: breezyBreathe 3s ease-in-out infinite; transform-origin: 70px 75px; }
        .animate-breezy-dance { animation: breezyDance 1.4s ease-in-out infinite; transform-origin: 70px 75px; }
        .animate-wind { stroke-dasharray: 12 8; animation: windStream 1.6s linear infinite; }
        .animate-bubble { animation: bubbleRise 2.4s ease-out infinite; }
        .animate-lid { animation: lidPulse 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin 4s linear infinite; }
        .animate-bounce-slow { animation: bounce 2.5s infinite; }
      `}</style>

      {/* ==========================================
          TOP PLAYFUL HEADER
         ========================================== */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-400 via-emerald-400 to-sky-400 flex items-center justify-center shadow-lg shadow-teal-500/30 text-2xl">
              🫁
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">
                  SmogShield <span className="text-teal-400">Kids & Family</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  Interactive Visual Air Playground ✨
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Touch the sky, tap the house, and help Breezy beat the winter smog!
              </p>
            </div>
          </div>

          {/* City Quick Switcher Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CITY_PRESETS.map((city) => {
              const isSelected = city.id === selectedCityId;
              return (
                <button
                  key={city.id}
                  onClick={() => handleSelectCity(city)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-teal-400 text-slate-950 border-teal-300 scale-105 shadow-lg shadow-teal-500/25'
                      : 'bg-slate-900 text-slate-300 border-white/10 hover:bg-slate-800'
                  }`}
                >
                  <span>{city.emoji}</span>
                  <span>{city.name}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    isSelected ? 'bg-slate-950 text-teal-300' : 'bg-white/10 text-white'
                  }`}>
                    {city.aqi}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-5 space-y-6">
        {/* ============================================================
            HERO LIVING SKY & BREEZY MASCOT INTERACTIVE STAGE
           ============================================================ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* LEFT 8 COLS: INTERACTIVE LIVING CITY & INVERSION LID ANIMATION */}
          <div className="lg:col-span-8 bg-slate-900/90 border-2 border-white/10 rounded-3xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            {/* Top Overlay Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 z-10">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black shadow-md ${outdoorMeta.badgeBg}`}>
                  Outside AQI: {outdoorAqi} • {outdoorMeta.label}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-400 text-slate-950 shadow-md">
                  Inside Home AQI: {indoorStats.indoorAqi} 🏡✨
                </span>
              </div>
              <div className="text-xs font-bold bg-slate-950/80 px-3 py-1 rounded-full border border-white/15 text-amber-300">
                {currentCity.temp} • Best Window: {currentCity.goldenWindow}
              </div>
            </div>

            {/* ANIMATED SVG SKY, INVERSION LID, SMOG MONSTERS & BREEZY */}
            <div className="relative my-3 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-sky-900 via-slate-900 to-slate-950 h-64 sm:h-72">
              <svg viewBox="0 0 800 280" className="w-full h-full preserve-3d">
                {/* Warm Sun above the Inversion Lid */}
                <g className="transition-all duration-700" style={{ transform: `translate(680px, ${35 + lidTrapStrength * 0.2}px)` }}>
                  <circle cx="0" cy="0" r="38" fill="#fde047" opacity="0.25" className="animate-ping" />
                  <circle cx="0" cy="0" r="28" fill="#facc15" />
                </g>

                {/* WINTER INVERSION "COLD AIR LID" BLANKET */}
                <g
                  className="transition-all duration-500 animate-lid"
                  style={{ transform: `translateY(${40 + lidTrapStrength * 1.15}px)` }}
                >
                  {/* Glowing Cold Trap Line */}
                  <path
                    d="M0 20 Q200 32 400 18 T800 24 L800 260 L0 260 Z"
                    fill="#64748b"
                    opacity={outdoorMeta.smogOpacity}
                  />
                  <path
                    d="M0 20 Q200 32 400 18 T800 24"
                    stroke="#38bdf8"
                    strokeWidth="4"
                    strokeDasharray="10 6"
                    fill="none"
                  />
                  <rect x="260" y="2" width="280" height="24" rx="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                  <text x="400" y="18" textAnchor="middle" fill="#7dd3fc" fontSize="11" fontWeight="bold">
                    ❄️ COLD WINTER AIR LID (TRAPS SMOKE BELOW!) ⬇️
                  </text>
                </g>

                {/* FLOATING SMOG DOTS / LITTLE SOOT MONSTERS */}
                {Array.from({ length: outdoorMeta.particleCount }).map((_, idx) => {
                  const cx = 40 + ((idx * 73) % 720);
                  const minY = 65 + lidTrapStrength * 1.1;
                  const cy = Math.min(245, minY + ((idx * 37) % Math.max(30, 240 - minY)));
                  const isMonster = idx % 5 === 0;
                  return (
                    <g
                      key={idx}
                      className="animate-float"
                      style={{ animationDelay: `${(idx % 5) * 0.4}s` }}
                    >
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isMonster ? 11 : 5}
                        fill={outdoorAqi > 250 ? '#94a3b8' : '#cbd5e1'}
                        opacity="0.75"
                      />
                      {isMonster && (
                        <>
                          <circle cx={cx - 3.5} cy={cy - 1} r="1.8" fill="#0f172a" />
                          <circle cx={cx + 3.5} cy={cy - 1} r="1.8" fill="#0f172a" />
                        </>
                      )}
                    </g>
                  );
                })}

                {/* CITY SKYLINE, TREES & SAFE GLOWING SANCTUARY HOME */}
                <g transform="translate(0, 175)">
                  {/* Ground */}
                  <rect x="0" y="80" width="800" height="35" fill="#0f172a" />
                  {/* Buildings */}
                  <rect x="35" y="15" width="55" height="65" rx="4" fill="#1e293b" />
                  <rect x="100" y="30" width="45" height="50" rx="4" fill="#334155" />
                  <rect x="640" y="10" width="60" height="70" rx="4" fill="#1e293b" />
                  <rect x="710" y="25" width="50" height="55" rx="4" fill="#334155" />

                  {/* Green Trees */}
                  <circle cx="175" cy="60" r="18" fill="#10b981" />
                  <rect x="172" y="72" width="6" height="12" fill="#78350f" />
                  <circle cx="605" cy="58" r="20" fill="#10b981" />
                  <rect x="602" y="72" width="6" height="12" fill="#78350f" />

                  {/* Glowing Clean-Air Family Sanctuary Home in Center */}
                  <g transform="translate(275, -5)">
                    {/* Forcefield Shield Dome */}
                    <path
                      d="M-20 85 C-20 -15, 160 -15, 160 85 Z"
                      fill="#14b8a6"
                      opacity="0.18"
                      stroke="#2dd4bf"
                      strokeWidth="3"
                      strokeDasharray="8 4"
                    />
                    {/* House Body */}
                    <polygon points="30,35 70,5 110,35" fill="#0d9488" />
                    <rect x="38" y="35" width="64" height="50" rx="6" fill="#0f766e" stroke="#5eead4" strokeWidth="2" />
                    <rect x="58" y="52" width="24" height="22" rx="4" fill="#fef08a" />
                    <text x="70" y="-6" textAnchor="middle" fill="#5eead4" fontSize="11" fontWeight="900">
                      🛡️ SAFE HOME (AQI {indoorStats.indoorAqi})
                    </text>
                  </g>
                </g>
              </svg>

              {/* Floating Breezy Mascot inside the Stage */}
              <div className="absolute bottom-2 right-4 sm:right-8 z-20">
                <BreezyMascot aqi={outdoorAqi} size={112} showSpeech={true} />
              </div>
            </div>

            {/* INTERACTIVE TOY SLIDERS: DRAG SMOG & COLD LID! */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-white/10">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-teal-300 flex items-center gap-1.5">
                    🎚️ 1. Drag Outside Smog Level:
                  </span>
                  <span className={outdoorMeta.textColor}>AQI {outdoorAqi}</span>
                </div>
                <input
                  type="range"
                  min="35"
                  max="480"
                  value={outdoorAqi}
                  onChange={(e) => setOutdoorAqi(Number(e.target.value))}
                  className="w-full accent-teal-400 h-2.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>35 Clean 🌱</span>
                  <span>200 Smoggy 😷</span>
                  <span>450+ Heavy Smog 🚨</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-sky-300 flex items-center gap-1.5">
                    ❄️ 2. Drag Cold Winter Sky Lid:
                  </span>
                  <span className="text-sky-300">{lidTrapStrength}% Trapped</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="95"
                  value={lidTrapStrength}
                  onChange={(e) => setLidTrapStrength(Number(e.target.value))}
                  className="w-full accent-sky-400 h-2.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>High Sunny Lid ☀️</span>
                  <span>Low Cold Trap 🥶</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 4 COLS: VISUAL CIGARETTE METER & FAMILY SQUAD */}
          <div className="lg:col-span-4 bg-slate-900/90 border-2 border-white/10 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-2xl">
            {/* Visual Cigarette Equivalence Toy */}
            <div className="bg-slate-950/90 border border-rose-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  🚬 Visual Smoke Meter
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
                  Outside = {indoorStats.outdoorCigs} Cigs/Day
                </span>
              </div>

              <p className="text-xs text-slate-300 font-medium leading-snug">
                Breathing unprotected outside air today is like puffing{' '}
                <strong className="text-rose-400 font-black">{indoorStats.outdoorCigs} cigarettes</strong>!
                Look how many your <strong className="text-teal-300">Home Hacks block</strong>:
              </p>

              {/* Visual Row of Cigarette Icons (Crossed out when blocked!) */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {Array.from({ length: Math.min(14, Math.max(1, Math.round(Number(indoorStats.outdoorCigs)))) }).map((_, i) => {
                  const isBlocked = i >= Math.round(Number(indoorStats.indoorCigs));
                  return (
                    <div
                      key={i}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-base border transition-all ${
                        isBlocked
                          ? 'bg-emerald-500/20 border-emerald-400/50 scale-100'
                          : 'bg-rose-500/25 border-rose-500/50 animate-pulse'
                      }`}
                      title={isBlocked ? 'Blocked by your Home Hacks!' : 'Remaining indoor exposure'}
                    >
                      {isBlocked ? '🛡️' : '🚬'}
                    </div>
                  );
                })}
              </div>

              <div className="bg-emerald-500/15 border border-emerald-400/30 rounded-xl p-2.5 flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-300">
                  🛡️ Smoke Blocked Inside Home:
                </span>
                <span className="text-sm font-black text-white bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-lg">
                  -{indoorStats.cigsBlocked} Cigs Saved!
                </span>
              </div>
            </div>

            {/* Family Squad Tap Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-teal-300">
                  👨‍👩‍👧‍👦 Tap Your Family Squad
                </span>
                <span className="text-[11px] text-slate-400 font-bold">
                  {selectedFamily.length} Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {FAMILY_AVATARS.map((member) => {
                  const active = selectedFamily.includes(member.id);
                  return (
                    <button
                      key={member.id}
                      onClick={() => toggleFamilyMember(member.id)}
                      className={`p-2.5 rounded-2xl border-2 text-left transition-all flex items-center gap-2.5 ${
                        active
                          ? 'bg-teal-500/20 border-teal-400 text-white shadow-md scale-[1.02]'
                          : 'bg-slate-950/60 border-white/10 text-slate-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <span className="text-2xl">{member.emoji}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-black truncate">{member.label}</div>
                        <div className="text-[10px] text-teal-300 leading-tight line-clamp-2">
                          {member.perk}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            BIG PLAYFUL GAME TAB BAR
           ============================================================ */}
        <nav className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              id: 'house_game',
              emoji: '🏠✨',
              title: '1. Tap-the-House Game',
              sub: `Indoor AQI: ${indoorStats.indoorAqi} (-${indoorStats.percentSaved}%)`
            },
            {
              id: 'sky_clock',
              emoji: '⏰☀️',
              title: '2. 24-Hr Sky Time-Machine',
              sub: 'See when the Smog Lid lifts!'
            },
            {
              id: 'eco_arcade',
              emoji: '🌱🎈',
              title: '3. Smog-Buster Arcade',
              sub: `${arcadeStats.totalBalloons.toLocaleString()} Clean Balloons!`
            },
            {
              id: 'ask_breezy',
              emoji: '🤖💬',
              title: '4. Ask Breezy AI Story',
              sub: '3-Step Visual Comic Cards'
            }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 border-white shadow-xl shadow-teal-500/25 scale-[1.02]'
                    : 'bg-slate-900/90 text-white border-white/10 hover:border-teal-400/50 hover:bg-slate-800/80'
                }`}
              >
                <span className="text-2xl sm:text-3xl shrink-0">{tab.emoji}</span>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-black truncate">{tab.title}</div>
                  <div className={`text-[11px] font-bold truncate ${isActive ? 'text-slate-900' : 'text-teal-300'}`}>
                    {tab.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* ============================================================
            TAB 1 (DEFAULT): INTERACTIVE CUTAWAY HOUSE IAQ GAME
           ============================================================ */}
        {activeTab === 'house_game' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* LEFT 7 COLS: CLICKABLE CUTAWAY FAMILY HOUSE SVG */}
            <div className="lg:col-span-7 bg-slate-900/90 border-2 border-teal-400/40 rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-teal-400">
                    🎮 Interactive Cutaway Home Sandbox
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    Tap Inside the House to Turn On Clean-Air Power-Ups!
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveHouseHacks(HOUSE_HACKS.map((h) => h.id))}
                    className="px-3 py-1.5 rounded-xl bg-teal-400 text-slate-950 font-black text-xs hover:bg-teal-300 transition-all"
                  >
                    ⚡ Max Shield ON
                  </button>
                  <button
                    onClick={() => setActiveHouseHacks([])}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs border border-white/10 hover:bg-slate-700"
                  >
                    Turn All Off
                  </button>
                </div>
              </div>

              {/* INTERACTIVE 2D CUTAWAY HOUSE ILLUSTRATION */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-white/10 bg-slate-950 h-80 sm:h-96 select-none">
                <svg viewBox="0 0 700 380" className="w-full h-full">
                  {/* Outside Smoggy Sky Background */}
                  <rect x="0" y="0" width="700" height="380" fill="#1e293b" />

                  {/* Outside Floating Smog Monsters trying to sneak in */}
                  {Array.from({ length: 10 }).map((_, i) => (
                    <g key={i} className="animate-float" style={{ animationDelay: `${i * 0.3}s` }}>
                      <circle cx={35 + (i % 2) * 630} cy={45 + i * 32} r="12" fill="#64748b" opacity="0.8" />
                      <circle cx={31 + (i % 2) * 630} cy={43 + i * 32} r="2" fill="#0f172a" />
                      <circle cx={39 + (i % 2) * 630} cy={43 + i * 32} r="2" fill="#0f172a" />
                    </g>
                  ))}

                  {/* HOUSE ROOF & ATTIC */}
                  <polygon
                    points="60,85 350,15 640,85"
                    fill="#0f766e"
                    stroke="#2dd4bf"
                    strokeWidth="4"
                  />
                  <text x="350" y="64" textAnchor="middle" fill="#ccfbf1" fontSize="14" fontWeight="900">
                    🏡 OUR WINTER SANCTUARY (INSIDE AQI: {indoorStats.indoorAqi})
                  </text>

                  {/* MAIN HOUSE INTERIOR ROOMS */}
                  <rect
                    x="85"
                    y="85"
                    width="530"
                    height="255"
                    rx="8"
                    fill={indoorStats.indoorAqi < 65 ? '#064e3b' : indoorStats.indoorAqi < 150 ? '#1e3a8a' : '#4c1d95'}
                    stroke="#5eead4"
                    strokeWidth="4"
                    className="transition-colors duration-700"
                  />

                  {/* Room Divider Wall (Living Room Left, Kitchen Right) */}
                  <line x1="420" y1="85" x2="420" y2="340" stroke="#2dd4bf" strokeWidth="4" />

                  {/* Remaining Indoor Smog Dots (fewer when hacks are ON!) */}
                  {Array.from({ length: Math.max(2, Math.round(indoorStats.indoorAqi / 18)) }).map((_, idx) => (
                    <circle
                      key={idx}
                      cx={130 + ((idx * 67) % 440)}
                      cy={120 + ((idx * 43) % 170)}
                      r="6"
                      fill="#94a3b8"
                      opacity="0.55"
                      className="animate-float"
                    />
                  ))}

                  {/* ==========================================
                      CLICKABLE OBJECT 1: WINDOW FORCEFIELD SEAL (LEFT WALL)
                     ========================================== */}
                  <g
                    onClick={() => toggleHouseHack(HOUSE_HACKS[1])}
                    className="cursor-pointer hover:opacity-90"
                  >
                    <rect
                      x="85"
                      y="130"
                      width="26"
                      height="110"
                      rx="4"
                      fill={activeHouseHacks.includes('window_seal') ? '#38bdf8' : '#f43f5e'}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />
                    {activeHouseHacks.includes('window_seal') ? (
                      <g>
                        {/* Glowing Forcefield Shield */}
                        <path
                          d="M116 125 L116 245"
                          stroke="#38bdf8"
                          strokeWidth="6"
                          strokeDasharray="8 4"
                          className="animate-pulse"
                        />
                        <text x="130" y="160" fill="#7dd3fc" fontSize="11" fontWeight="900">
                          🛡️ SEALED!
                        </text>
                      </g>
                    ) : (
                      <g>
                        {/* Smog leaking through crack */}
                        <path d="M80 175 L145 175" stroke="#fda4af" strokeWidth="4" className="animate-wind" />
                        <text x="122" y="162" fill="#fda4af" fontSize="11" fontWeight="900">
                          ⚠️ LEAKING! TAP ME
                        </text>
                      </g>
                    )}
                  </g>

                  {/* ==========================================
                      CLICKABLE OBJECT 2: DIY BOX-FAN CUBE (CENTER LIVING ROOM)
                     ========================================== */}
                  <g
                    transform="translate(230, 175)"
                    onClick={() => toggleHouseHack(HOUSE_HACKS[0])}
                    className="cursor-pointer"
                  >
                    {/* Box Cube */}
                    <rect
                      x="-42"
                      y="-35"
                      width="84"
                      height="84"
                      rx="12"
                      fill={activeHouseHacks.includes('box_fan') ? '#0284c7' : '#334155'}
                      stroke="#ffffff"
                      strokeWidth="3"
                    />
                    {/* Spinning Fan Blades */}
                    <g className={activeHouseHacks.includes('box_fan') ? 'animate-spin-slow' : ''}>
                      <circle cx="0" cy="7" r="24" fill="#0f172a" />
                      <ellipse cx="0" cy="-7" rx="6" ry="14" fill="#38bdf8" />
                      <ellipse cx="0" cy="21" rx="6" ry="14" fill="#38bdf8" />
                      <ellipse cx="-14" cy="7" rx="14" ry="6" fill="#38bdf8" />
                      <ellipse cx="14" cy="7" rx="14" ry="6" fill="#38bdf8" />
                    </g>

                    {/* Sparkling Clean Air Bubbles Rising when ON */}
                    {activeHouseHacks.includes('box_fan') && (
                      <g className="animate-bubble">
                        <circle cx="-22" cy="-48" r="7" fill="#7dd3fc" />
                        <circle cx="0" cy="-62" r="9" fill="#34d399" />
                        <circle cx="24" cy="-50" r="6" fill="#7dd3fc" />
                      </g>
                    )}

                    <rect x="-56" y="54" width="112" height="22" rx="8" fill="#0f172a" />
                    <text x="0" y="69" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="900">
                      {activeHouseHacks.includes('box_fan') ? '📦 FAN CUBE ON (-48%)' : '📦 TAP TO TURN ON FAN'}
                    </text>
                  </g>

                  {/* ==========================================
                      CLICKABLE OBJECT 3: GREEN PLANT SQUAD (LIVING ROOM RIGHT)
                     ========================================== */}
                  <g
                    transform="translate(365, 240)"
                    onClick={() => toggleHouseHack(HOUSE_HACKS[4])}
                    className="cursor-pointer"
                  >
                    {/* Plant Pot */}
                    <polygon points="-20,30 20,30 14,65 -14,65" fill="#d97706" stroke="#ffffff" strokeWidth="2" />
                    {/* Leaves */}
                    <path
                      d="M0 30 Q-25 -10 -10 -30 Q5 -5 0 30"
                      fill={activeHouseHacks.includes('plant_squad') ? '#10b981' : '#64748b'}
                    />
                    <path
                      d="M0 30 Q25 -10 10 -30 Q-5 -5 0 30"
                      fill={activeHouseHacks.includes('plant_squad') ? '#34d399' : '#475569'}
                    />
                    <path
                      d="M0 30 Q0 -25 0 -38"
                      stroke={activeHouseHacks.includes('plant_squad') ? '#6ee7b7' : '#94a3b8'}
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    {activeHouseHacks.includes('plant_squad') && (
                      <text x="0" y="-45" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="900">
                        💚 O2!
                      </text>
                    )}
                  </g>

                  {/* ==========================================
                      CLICKABLE OBJECT 4: KITCHEN CHIMNEY EXHAUST (RIGHT ROOM)
                     ========================================== */}
                  <g
                    transform="translate(525, 145)"
                    onClick={() => toggleHouseHack(HOUSE_HACKS[2])}
                    className="cursor-pointer"
                  >
                    {/* Chimney Hood */}
                    <polygon
                      points="-45,25 45,25 25,-15 -25,-15"
                      fill={activeHouseHacks.includes('kitchen_exhaust') ? '#10b981' : '#475569'}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />
                    <rect x="-12" y="-55" width="24" height="40" fill="#334155" />

                    {/* Stove & Frying Pan below */}
                    <rect x="-45" y="105" width="90" height="55" rx="6" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                    <ellipse cx="0" cy="100" rx="28" ry="7" fill="#f97316" />

                    {/* Cooking Fumes Animation */}
                    {activeHouseHacks.includes('kitchen_exhaust') ? (
                      <g>
                        {/* Sucked straight into chimney hood */}
                        <path
                          d="M-10 90 L-5 30 M10 90 L5 30"
                          stroke="#6ee7b7"
                          strokeWidth="4"
                          className="animate-wind"
                        />
                        <text x="0" y="12" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="900">
                          💨 VENTED OUT!
                        </text>
                      </g>
                    ) : (
                      <g>
                        {/* Orange cooking smoke filling the house */}
                        <circle cx="-20" cy="60" r="14" fill="#fb923c" opacity="0.65" className="animate-float" />
                        <circle cx="18" cy="50" r="16" fill="#f97316" opacity="0.65" className="animate-float" />
                        <text x="0" y="65" textAnchor="middle" fill="#fed7aa" fontSize="10" fontWeight="900">
                          ⚠️ SMOKE! TAP HOOD
                        </text>
                      </g>
                    )}
                  </g>

                  {/* ==========================================
                      CLICKABLE OBJECT 5: WET MICROFIBER MOP (FLOOR)
                     ========================================== */}
                  <g
                    transform="translate(250, 322)"
                    onClick={() => toggleHouseHack(HOUSE_HACKS[3])}
                    className="cursor-pointer"
                  >
                    <rect
                      x="-155"
                      y="-8"
                      width="310"
                      height="22"
                      rx="8"
                      fill={activeHouseHacks.includes('wet_mop') ? '#0284c7' : '#78350f'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text x="0" y="7" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900">
                      {activeHouseHacks.includes('wet_mop')
                        ? '🪣✨ WET MOP FLOOR: DUST LOCKED IN WATER (-18%)'
                        : '🧹⚠️ DRY DUSTY FLOOR! TAP TO WET MOP'}
                    </text>
                  </g>
                </svg>
              </div>
            </div>

            {/* RIGHT 5 COLS: POWER-UP CARDS & KID-FRIENDLY EXPLANATION */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
              <div className="bg-slate-900/90 border-2 border-white/10 rounded-3xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-teal-300">
                    ⚡ 5 Home Super-Powers
                  </span>
                  <span className="text-xs font-black text-emerald-400">
                    {activeHouseHacks.length}/5 Active (-{indoorStats.percentSaved}% Smog!)
                  </span>
                </div>

                {/* Power-Up Toggle Buttons */}
                <div className="space-y-2.5 pt-1">
                  {HOUSE_HACKS.map((hack) => {
                    const isOn = activeHouseHacks.includes(hack.id);
                    return (
                      <div
                        key={hack.id}
                        onClick={() => toggleHouseHack(hack)}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isOn
                            ? 'bg-teal-500/20 border-teal-400 shadow-md scale-[1.01]'
                            : 'bg-slate-950/60 border-white/10 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-3xl shrink-0">{hack.emoji}</span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-white truncate">{hack.name}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-teal-300">
                                {hack.cost}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 leading-snug mt-0.5">
                              {hack.shortDesc}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-sm font-black text-teal-300">-{hack.powerCut}%</div>
                          <span
                            className={`inline-block mt-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black ${
                              isOn ? 'bg-teal-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {isOn ? 'ON ✨' : 'OFF'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Power-Up Spotlight Box */}
              {lastClickedHack && (
                <div className="bg-gradient-to-r from-teal-950 to-slate-900 border-2 border-teal-400/50 rounded-3xl p-4 flex items-center gap-4">
                  <div className="text-4xl shrink-0">{lastClickedHack.emoji}</div>
                  <div>
                    <div className="text-[11px] font-black uppercase text-teal-300">
                      Spotlight Zone: {lastClickedHack.zone}
                    </div>
                    <div className="text-sm font-black text-white">{lastClickedHack.name}</div>
                    <p className="text-xs text-slate-200 mt-0.5">{lastClickedHack.shortDesc}</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ============================================================
            TAB 2: 24-HOUR "TIME-TRAVEL" SKY & ROUTINE WHEEL
           ============================================================ */}
        {activeTab === 'sky_clock' && (
          <section className="space-y-5">
            {/* Time Selector Wheel Bar */}
            <div className="bg-slate-900/90 border-2 border-white/10 rounded-3xl p-4 sm:p-5 space-y-4 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                    ⏰ Interactive 24-Hour Winter Smog Time-Machine
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    Tap Any Time of Day to Watch the Sky Lid Move!
                  </h2>
                </div>
                <button
                  onClick={() => setAutoPlayClock(!autoPlayClock)}
                  className={`px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-2 transition-all ${
                    autoPlayClock
                      ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30'
                      : 'bg-slate-800 text-white border border-white/15 hover:bg-slate-700'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>{autoPlayClock ? 'Playing 24-Hr Movie... (Tap to Pause)' : 'Auto-Play 24-Hr Sky Movie'}</span>
                </button>
              </div>

              {/* 4 Big Time Buttons */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {TIME_STAGES.map((st, idx) => {
                  const active = activeStageIdx === idx;
                  return (
                    <button
                      key={st.id}
                      onClick={() => {
                        setActiveStageIdx(idx);
                        setAutoPlayClock(false);
                      }}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                        active
                          ? 'bg-white text-slate-950 border-amber-400 scale-[1.03] shadow-xl'
                          : 'bg-slate-950/70 text-white border-white/10 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{st.emoji}</span>
                        <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                          active ? 'bg-slate-950 text-amber-300' : 'bg-white/10 text-slate-300'
                        }`}>
                          {st.time}
                        </span>
                      </div>
                      <div className="text-sm font-black mt-2">{st.title}</div>
                    </button>
                  );
                })}
              </div>

              {/* ACTIVE TIME STAGE VISUAL ANIMATION SCENE */}
              {(() => {
                const stage = TIME_STAGES[activeStageIdx];
                const stageAqi = Math.min(500, Math.round(outdoorAqi * stage.smogMultiplier));
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2 items-center">
                    {/* Animated Sky Window for this Time Slot */}
                    <div className={`lg:col-span-7 rounded-3xl p-5 bg-gradient-to-b ${stage.skyGradient} border-2 border-white/15 relative h-72 overflow-hidden flex flex-col justify-between`}>
                      <div className="flex items-center justify-between z-10">
                        <span className="px-3 py-1 rounded-full bg-slate-950/80 text-white font-black text-xs border border-white/15">
                          {stage.emoji} {stage.time}: {stage.title}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs">
                          Outside AQI: {stageAqi}
                        </span>
                      </div>

                      {/* SVG Sky Lid & Sun Position */}
                      <svg viewBox="0 0 600 180" className="w-full h-44 overflow-visible">
                        {/* Sun or Moon */}
                        <circle
                          cx="490"
                          cy={stage.sunY}
                          r="26"
                          fill={stage.id === 'night_trap' ? '#e2e8f0' : '#facc15'}
                          className="transition-all duration-700"
                        />

                        {/* Inversion Lid Line */}
                        <g
                          className="transition-all duration-700"
                          style={{ transform: `translateY(${stage.lidY * 1.4}px)` }}
                        >
                          <rect x="0" y="0" width="600" height="160" fill="#475569" opacity={stage.windowOpen ? 0.15 : 0.55} />
                          <line x1="0" y1="0" x2="600" y2="0" stroke="#38bdf8" strokeWidth="4" strokeDasharray="10 6" />
                          <text x="300" y="-8" textAnchor="middle" fill="#bae6fd" fontSize="11" fontWeight="900">
                            {stage.windowOpen
                              ? '☀️ HIGH SKY LID! SMOG FLOATS AWAY!'
                              : '🥶 LOW COLD SKY LID! SMOG TRAPPED NEAR GROUND!'}
                          </text>
                        </g>

                        {/* Little House Window Open/Closed Animation */}
                        <g transform="translate(230, 95)">
                          <rect x="0" y="0" width="140" height="75" rx="10" fill="#0f766e" stroke="#ffffff" strokeWidth="3" />
                          <text x="70" y="25" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900">
                            {stage.windowOpen ? '🪟 WINDOWS OPEN 20M!' : '🔒 WINDOWS LOCKED!'}
                          </text>
                          {stage.windowOpen && (
                            <path
                              d="M-40 48 L180 48"
                              stroke="#6ee7b7"
                              strokeWidth="5"
                              className="animate-wind"
                            />
                          )}
                        </g>
                      </svg>

                      <div className="bg-slate-950/85 px-4 py-2.5 rounded-2xl border border-white/10 text-xs font-bold text-teal-200 z-10">
                        💡 <strong>Why?</strong> {stage.visualWhy}
                      </div>
                    </div>

                    {/* Visual Action Cards (No vs Yes!) */}
                    <div className="lg:col-span-5 space-y-3">
                      <div className="p-4 rounded-2xl bg-rose-950/50 border-2 border-rose-500/40 flex items-center gap-3.5">
                        <span className="text-4xl shrink-0">{stage.badHabit.emoji}</span>
                        <div>
                          <div className="text-[11px] font-black uppercase text-rose-400">
                            ❌ Skip This Right Now
                          </div>
                          <div className="text-base font-black text-white mt-0.5">
                            {stage.badHabit.text}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-950/60 border-2 border-emerald-400 flex items-center gap-3.5 shadow-lg">
                        <span className="text-4xl shrink-0">{stage.heroAction.emoji}</span>
                        <div>
                          <div className="text-[11px] font-black uppercase text-emerald-300">
                            ✅ Do This Hero Move Instead!
                          </div>
                          <div className="text-base font-black text-white mt-0.5">
                            {stage.heroAction.text}
                          </div>
                          <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-400 text-slate-950">
                            🎯 Direct Impact: {stage.impactText}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </section>
        )}

        {/* ============================================================
            TAB 3: "SMOG BUSTER" ECO-SWAP ARCADE & NEIGHBORHOOD MULTIPLIER
           ============================================================ */}
        {activeTab === 'eco_arcade' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT 7 COLS: VISUAL BEFORE VS AFTER FLIP CARDS */}
            <div className="lg:col-span-7 space-y-3">
              <div className="bg-slate-900/90 border-2 border-white/10 rounded-3xl p-4">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  🌱 Smog-Buster Choice Arcade
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Tap Each Card to Swap Smoggy Smoke for Clean Air Balloons!
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {ECO_SWAPS.map((swap) => {
                  const isAdopted = adoptedSwaps.includes(swap.id);
                  return (
                    <div
                      key={swap.id}
                      onClick={() => toggleEcoSwap(swap.id)}
                      className={`p-4 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                        isAdopted
                          ? 'bg-slate-900/95 border-emerald-400 shadow-xl scale-[1.01]'
                          : 'bg-slate-900/50 border-rose-500/40 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-300">{swap.title}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                          isAdopted ? 'bg-emerald-400 text-slate-950' : 'bg-rose-500 text-white'
                        }`}>
                          {isAdopted ? `+${swap.balloonsSaved} Clean Balloons 🎈` : 'Smoggy Mode 💨'}
                        </span>
                      </div>

                      {/* Before Box */}
                      <div className={`p-3 rounded-2xl border transition-all ${
                        !isAdopted ? 'bg-rose-950/60 border-rose-400' : 'bg-slate-950/50 border-white/5 opacity-50'
                      }`}>
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{swap.badEmoji}</span>
                          <div>
                            <div className="text-xs font-black text-rose-300 line-through">{swap.badTitle}</div>
                            <div className="text-[11px] text-slate-300">{swap.badVisual}</div>
                          </div>
                        </div>
                      </div>

                      {/* After Hero Box */}
                      <div className={`p-3 rounded-2xl border-2 transition-all ${
                        isAdopted ? 'bg-emerald-950/60 border-emerald-400' : 'bg-slate-950/50 border-white/10'
                      }`}>
                        <div className="flex items-center gap-2.5">
                          <span className="text-3xl animate-bounce-slow">{swap.goodEmoji}</span>
                          <div>
                            <div className="text-xs font-black text-emerald-300">{swap.goodTitle}</div>
                            <div className="text-[11px] text-white font-medium">{swap.goodVisual}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT 5 COLS: NEIGHBORHOOD HERO MULTIPLIER TOY */}
            <div className="lg:col-span-5 bg-slate-900/90 border-2 border-emerald-400/50 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-2xl">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  🏘️ Neighborhood Teamwork Multiplier
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  What If Your Whole Street Joins In?
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Drag the slider to invite more families on your street and watch the forest grow!
                </p>
              </div>

              {/* Slider */}
              <div className="bg-slate-950/90 p-4 rounded-2xl border border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-emerald-300">👨‍👩‍👧‍👦 Families Teaming Up:</span>
                  <span className="text-base text-white">{neighborFamilies} Families!</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="500"
                  value={neighborFamilies}
                  onChange={(e) => setNeighborFamilies(Number(e.target.value))}
                  className="w-full accent-emerald-400 h-3 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>Just Us (1)</span>
                  <span>School Class (50)</span>
                  <span>Whole Street (500)</span>
                </div>
              </div>

              {/* Visual Floating Balloons & Growing Trees Scene */}
              <div className="bg-gradient-to-b from-sky-900/60 to-emerald-950/70 border border-emerald-400/30 rounded-2xl p-4 text-center space-y-3">
                <div className="flex flex-wrap justify-center gap-1.5 min-h-[56px] items-center">
                  {Array.from({ length: Math.min(18, Math.max(2, Math.round(neighborFamilies / 25))) }).map((_, i) => (
                    <span key={i} className="text-2xl animate-bounce-slow" style={{ animationDelay: `${i * 0.12}s` }}>
                      {i % 2 === 0 ? '🌳' : '🎈'}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-950/80 rounded-xl p-3 border border-white/10">
                    <div className="text-2xl font-black text-emerald-400">
                      {arcadeStats.totalBalloons.toLocaleString()} 🎈
                    </div>
                    <div className="text-[11px] font-bold text-slate-300">
                      Clean-Air Balloons Saved / Day
                    </div>
                  </div>

                  <div className="bg-slate-950/80 rounded-xl p-3 border border-white/10">
                    <div className="text-2xl font-black text-teal-300">
                      {arcadeStats.totalKgSmogStopped} kg 💨
                    </div>
                    <div className="text-[11px] font-bold text-slate-300">
                      Black Winter Soot Stopped!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================
            TAB 4: ASK BREEZY AI (3-PANEL VISUAL COMIC STORY GENERATOR)
           ============================================================ */}
        {activeTab === 'ask_breezy' && (
          <section className="bg-slate-900/90 border-2 border-teal-400/50 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🤖🫁</div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-teal-300">
                    Powered by Gemini AI • Kid & Family Storybook Mode
                  </span>
                  <h2 className="text-xl font-black text-white">
                    Ask Breezy Anything! Get a 3-Card Visual Comic Answer
                  </h2>
                </div>
              </div>
            </div>

            {/* Fun 1-Tap Picture Question Chips */}
            <div className="flex flex-wrap gap-2">
              {[
                'Why does smog get worse at night? 🌙🥶',
                'How do we build a Box-Fan Cube filter? 📦🌀',
                'What indoor games can kids play on AQI 400 days? 🎈🏃',
                'What yummy foods help protect our lungs? 🍊🥦'
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setAiQuestion(q);
                    askBreezyAi(q);
                  }}
                  disabled={isAiLoading}
                  className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-teal-400 hover:text-slate-950 text-xs font-extrabold text-teal-200 border border-white/10 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askBreezyAi()}
                placeholder="Ask Breezy a question... (e.g., Is it safe to walk my dog right now?)"
                className="flex-1 bg-slate-950 border-2 border-white/15 rounded-2xl px-4 py-3 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
              />
              <button
                onClick={() => askBreezyAi()}
                disabled={isAiLoading}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                {isAiLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Drawing Story Cards...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Make Visual Cards!</span>
                  </>
                )}
              </button>
            </div>

            {/* 3-PANEL COMIC STRIP OUTPUT */}
            {comicStory && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between bg-slate-950/90 px-4 py-3 rounded-2xl border border-teal-400/30">
                  <h3 className="text-base sm:text-lg font-black text-teal-300">
                    {comicStory.headline}
                  </h3>
                  <span className="text-xs font-bold text-slate-400">3-Step Visual Guide</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {comicStory.visualSteps.map((card, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/90 border-2 border-white/15 rounded-3xl p-5 flex flex-col items-center text-center justify-between space-y-3 hover:border-teal-400 transition-all"
                    >
                      <div className="w-20 h-20 rounded-3xl bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-4xl animate-bounce-slow">
                        {card.emoji}
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-base font-black text-white">{card.shortTitle}</div>
                        <p className="text-xs font-medium text-slate-300 leading-relaxed">
                          {card.kidFriendlyText}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-400 text-slate-950">
                        ⚡ {card.impactBadge}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-400/15 border-2 border-amber-400/40 rounded-2xl p-3.5 flex items-center gap-3">
                  <span className="text-2xl">🌟</span>
                  <div className="text-xs sm:text-sm font-bold text-amber-200">
                    <strong>Breezy&apos;s Fun Science Fact:</strong> {comicStory.funFact}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
