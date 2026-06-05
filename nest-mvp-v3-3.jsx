import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MapPin, Bed, Bath, Maximize2, Heart, ArrowRight, ArrowLeft, X, Search, SlidersHorizontal, Check, Phone, Calendar, Sparkles, ChevronDown, User, BookmarkCheck, Eye, ShieldCheck, Coffee, Sprout, Key, Plus, Star, ArrowUpRight, Home as HomeIcon, Building2 } from 'lucide-react';

// ---------- Embedded SVG illustrations ----------
// Each listing gets a unique stylized building illustration. No external dependencies.
// Production: replace usage of <ListingImage> with <SafeImage src={listing.images[0]}/> wrapping real photos.

const BUILDING_ILLUSTRATIONS = {
  // Modern tower with sea
  skyline: ({ bg = '#E8DCC8', primary = '#1A1B3A', accent = '#FFD66B' }) => (
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <defs>
        <linearGradient id="sky-sk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bg}/>
          <stop offset="100%" stopColor={bg} stopOpacity="0.7"/>
        </linearGradient>
        <linearGradient id="sea-sk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A8C5D0" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#7BA0B0" stopOpacity="0.4"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#sky-sk)"/>
      {/* Sun */}
      <circle cx="620" cy="160" r="55" fill={accent} opacity="0.85"/>
      {/* Sea */}
      <rect y="420" width="800" height="180" fill="url(#sea-sk)"/>
      {/* Wave lines */}
      <path d="M0,460 Q200,450 400,460 T800,460" stroke="#fff" strokeOpacity="0.4" fill="none" strokeWidth="2"/>
      <path d="M0,490 Q200,480 400,490 T800,490" stroke="#fff" strokeOpacity="0.3" fill="none" strokeWidth="2"/>
      <path d="M0,520 Q200,510 400,520 T800,520" stroke="#fff" strokeOpacity="0.25" fill="none" strokeWidth="2"/>
      {/* Main tower */}
      <rect x="280" y="180" width="180" height="280" fill={primary}/>
      {/* Tower windows grid */}
      {Array.from({ length: 11 }).map((_, row) =>
        Array.from({ length: 5 }).map((_, col) => (
          <rect key={`${row}-${col}`} x={295 + col * 32} y={200 + row * 24} width="18" height="14"
                fill={(row + col) % 4 === 0 ? accent : '#fff'} opacity={(row + col) % 4 === 0 ? 0.9 : 0.5}/>
        ))
      )}
      {/* Tower top */}
      <rect x="350" y="160" width="40" height="20" fill={primary}/>
      <rect x="365" y="140" width="10" height="20" fill={primary}/>
      {/* Adjacent shorter buildings */}
      <rect x="120" y="280" width="120" height="180" fill={primary} opacity="0.7"/>
      <rect x="500" y="260" width="100" height="200" fill={primary} opacity="0.7"/>
      <rect x="620" y="320" width="90" height="140" fill={primary} opacity="0.55"/>
    </svg>
  ),

  // Garden / lake side residence
  walden: ({ bg = '#D4E4D4', primary = '#1A1B3A', accent = '#5C9658' }) => (
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <rect width="800" height="600" fill={bg}/>
      {/* Soft cloud / hill */}
      <ellipse cx="200" cy="120" rx="180" ry="50" fill="#fff" opacity="0.4"/>
      <ellipse cx="600" cy="100" rx="150" ry="40" fill="#fff" opacity="0.5"/>
      {/* Trees behind */}
      <circle cx="80" cy="380" r="80" fill={accent} opacity="0.5"/>
      <circle cx="720" cy="380" r="90" fill={accent} opacity="0.45"/>
      <circle cx="160" cy="360" r="60" fill={accent} opacity="0.6"/>
      {/* Lake reflection */}
      <rect y="450" width="800" height="150" fill="#A8C5D0" opacity="0.5"/>
      <path d="M0,470 Q200,460 400,470 T800,470" stroke="#fff" strokeOpacity="0.5" fill="none" strokeWidth="1.5"/>
      <path d="M0,500 Q200,490 400,500 T800,500" stroke="#fff" strokeOpacity="0.3" fill="none" strokeWidth="1.5"/>
      {/* Low-rise wings */}
      <rect x="240" y="260" width="320" height="190" fill={primary}/>
      {/* Windows */}
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 8 }).map((_, col) => (
          <rect key={`${row}-${col}`} x={258 + col * 36} y={278 + row * 40} width="22" height="22"
                fill={(row + col) % 5 === 0 ? '#FFD66B' : '#fff'} opacity={(row + col) % 5 === 0 ? 0.85 : 0.55}/>
        ))
      )}
      {/* Roofline detail */}
      <rect x="240" y="252" width="320" height="10" fill={primary}/>
      {/* Front trees */}
      <ellipse cx="220" cy="470" rx="40" ry="50" fill={accent} opacity="0.8"/>
      <rect x="215" y="470" width="10" height="30" fill={primary} opacity="0.6"/>
      <ellipse cx="580" cy="470" rx="35" ry="45" fill={accent} opacity="0.75"/>
      <rect x="575" y="470" width="10" height="30" fill={primary} opacity="0.6"/>
    </svg>
  ),

  // Standalone villa
  vasant: ({ bg = '#F4D4C4', primary = '#1A1B3A', accent = '#E89968' }) => (
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <rect width="800" height="600" fill={bg}/>
      {/* Sun */}
      <circle cx="650" cy="140" r="48" fill={accent} opacity="0.6"/>
      {/* Trees behind */}
      <circle cx="100" cy="340" r="70" fill="#5C9658" opacity="0.5"/>
      <circle cx="700" cy="340" r="80" fill="#5C9658" opacity="0.45"/>
      {/* Ground */}
      <rect y="460" width="800" height="140" fill="#C8B898" opacity="0.6"/>
      {/* Villa body */}
      <rect x="230" y="270" width="340" height="200" fill="#fff"/>
      <rect x="230" y="270" width="340" height="200" fill={primary} opacity="0.05"/>
      {/* Roof — flat modern */}
      <rect x="220" y="258" width="360" height="14" fill={primary}/>
      {/* Large window */}
      <rect x="260" y="300" width="120" height="150" fill={primary} opacity="0.85"/>
      {/* Window mullions */}
      <rect x="318" y="300" width="2" height="150" fill="#fff" opacity="0.4"/>
      <rect x="260" y="370" width="120" height="2" fill="#fff" opacity="0.4"/>
      {/* Door */}
      <rect x="410" y="340" width="50" height="110" fill={primary}/>
      <circle cx="450" cy="395" r="2" fill={accent}/>
      {/* Side window */}
      <rect x="490" y="310" width="60" height="60" fill={primary} opacity="0.85"/>
      <rect x="518" y="310" width="2" height="60" fill="#fff" opacity="0.4"/>
      {/* Garden path */}
      <path d="M435,470 L435,560 M425,490 L445,490 M420,520 L450,520" stroke={primary} strokeOpacity="0.3" strokeWidth="2"/>
      {/* Front shrub */}
      <ellipse cx="200" cy="465" rx="30" ry="20" fill="#5C9658" opacity="0.7"/>
      <ellipse cx="600" cy="465" rx="32" ry="22" fill="#5C9658" opacity="0.7"/>
    </svg>
  ),

  // Sea-facing high-rise
  marine: ({ bg = '#D8E0EC', primary = '#1A1B3A', accent = '#FFD66B' }) => (
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <defs>
        <linearGradient id="sky-m" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bg}/>
          <stop offset="100%" stopColor="#F5E5D0"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#sky-m)"/>
      {/* Sun */}
      <circle cx="200" cy="180" r="60" fill={accent} opacity="0.6"/>
      {/* Sea */}
      <rect y="440" width="800" height="160" fill="#7BA0B0" opacity="0.55"/>
      <path d="M0,470 Q200,460 400,470 T800,470" stroke="#fff" strokeOpacity="0.4" fill="none" strokeWidth="2"/>
      <path d="M0,500 Q200,490 400,500 T800,500" stroke="#fff" strokeOpacity="0.3" fill="none" strokeWidth="2"/>
      <path d="M0,530 Q200,520 400,530 T800,530" stroke="#fff" strokeOpacity="0.25" fill="none" strokeWidth="2"/>
      {/* Two towers */}
      <rect x="320" y="120" width="120" height="370" fill={primary}/>
      <rect x="470" y="180" width="100" height="310" fill={primary} opacity="0.85"/>
      {/* Tower 1 windows */}
      {Array.from({ length: 15 }).map((_, row) =>
        Array.from({ length: 4 }).map((_, col) => (
          <rect key={`a-${row}-${col}`} x={332 + col * 26} y={138 + row * 23} width="14" height="12"
                fill={(row + col) % 5 === 0 ? accent : '#fff'} opacity={(row + col) % 5 === 0 ? 0.9 : 0.5}/>
        ))
      )}
      {/* Tower 2 windows */}
      {Array.from({ length: 12 }).map((_, row) =>
        Array.from({ length: 3 }).map((_, col) => (
          <rect key={`b-${row}-${col}`} x={480 + col * 28} y={196 + row * 24} width="14" height="12"
                fill={(row + col) % 4 === 0 ? accent : '#fff'} opacity={(row + col) % 4 === 0 ? 0.85 : 0.45}/>
        ))
      )}
      {/* Tower tops */}
      <rect x="370" y="105" width="20" height="15" fill={primary}/>
      <rect x="378" y="80" width="4" height="25" fill={primary}/>
      <rect x="510" y="165" width="20" height="15" fill={primary} opacity="0.85"/>
    </svg>
  ),

  // Mid-rise apartment
  casaVerde: ({ bg = '#EDE0F0', primary = '#1A1B3A', accent = '#C29ACC' }) => (
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <rect width="800" height="600" fill={bg}/>
      {/* Clouds */}
      <ellipse cx="150" cy="100" rx="100" ry="25" fill="#fff" opacity="0.6"/>
      <ellipse cx="650" cy="130" rx="120" ry="30" fill="#fff" opacity="0.5"/>
      {/* Ground */}
      <rect y="470" width="800" height="130" fill="#C8B8C0" opacity="0.5"/>
      {/* Building */}
      <rect x="200" y="200" width="400" height="270" fill="#fff"/>
      <rect x="200" y="200" width="400" height="270" fill={accent} opacity="0.15"/>
      {/* Roof line */}
      <rect x="190" y="190" width="420" height="14" fill={primary}/>
      {/* Balconies */}
      {Array.from({ length: 4 }).map((_, row) => (
        <g key={row}>
          <rect x="220" y={240 + row * 55} width="360" height="36" fill={primary} opacity="0.08"/>
          <rect x="220" y={272 + row * 55} width="360" height="4" fill={primary} opacity="0.3"/>
          {/* Balcony rails */}
          {Array.from({ length: 30 }).map((_, i) => (
            <rect key={i} x={224 + i * 12} y={258 + row * 55} width="1.5" height="14" fill={primary} opacity="0.4"/>
          ))}
          {/* Windows behind */}
          {Array.from({ length: 5 }).map((_, col) => (
            <rect key={col} x={240 + col * 72} y={244 + row * 55} width="50" height="28" fill={primary} opacity={(row + col) % 3 === 0 ? 0.85 : 0.6}/>
          ))}
        </g>
      ))}
      {/* Entrance */}
      <rect x="370" y="430" width="60" height="40" fill={primary}/>
      <rect x="395" y="440" width="10" height="30" fill={accent} opacity="0.5"/>
      {/* Small tree */}
      <ellipse cx="170" cy="465" rx="35" ry="40" fill="#5C9658" opacity="0.65"/>
      <ellipse cx="630" cy="465" rx="35" ry="40" fill="#5C9658" opacity="0.65"/>
    </svg>
  ),

  // Premium under construction
  quay: ({ bg = '#E4E8D4', primary = '#1A1B3A', accent = '#FFD66B' }) => (
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <rect width="800" height="600" fill={bg}/>
      {/* Sun */}
      <circle cx="100" cy="140" r="50" fill={accent} opacity="0.55"/>
      {/* Sea hint */}
      <rect y="450" width="800" height="150" fill="#A8C5D0" opacity="0.4"/>
      <path d="M0,480 Q200,470 400,480 T800,480" stroke="#fff" strokeOpacity="0.35" fill="none" strokeWidth="2"/>
      <path d="M0,510 Q200,500 400,510 T800,510" stroke="#fff" strokeOpacity="0.25" fill="none" strokeWidth="2"/>
      {/* Tower */}
      <rect x="260" y="100" width="220" height="370" fill={primary}/>
      {/* Curved top */}
      <path d="M260,100 Q370,60 480,100 Z" fill={primary}/>
      {/* Vertical window strips */}
      <rect x="280" y="120" width="14" height="340" fill={accent} opacity="0.5"/>
      <rect x="310" y="120" width="14" height="340" fill="#fff" opacity="0.4"/>
      <rect x="340" y="120" width="14" height="340" fill={accent} opacity="0.5"/>
      <rect x="370" y="120" width="14" height="340" fill="#fff" opacity="0.4"/>
      <rect x="400" y="120" width="14" height="340" fill={accent} opacity="0.5"/>
      <rect x="430" y="120" width="14" height="340" fill="#fff" opacity="0.4"/>
      <rect x="460" y="120" width="14" height="340" fill={accent} opacity="0.5"/>
      {/* Crane (construction hint) */}
      <line x1="540" y1="80" x2="540" y2="470" stroke={primary} strokeWidth="3" opacity="0.7"/>
      <line x1="540" y1="100" x2="640" y2="100" stroke={primary} strokeWidth="3" opacity="0.7"/>
      <line x1="540" y1="120" x2="500" y2="100" stroke={primary} strokeWidth="2" opacity="0.7"/>
      <line x1="620" y1="100" x2="620" y2="160" stroke={primary} strokeWidth="1.5" opacity="0.6"/>
      <rect x="610" y="160" width="20" height="14" fill={primary} opacity="0.7"/>
      {/* Adjacent shorter buildings */}
      <rect x="120" y="320" width="100" height="150" fill={primary} opacity="0.5"/>
      <rect x="680" y="290" width="80" height="180" fill={primary} opacity="0.55"/>
    </svg>
  ),
};

// ---------- Mock data ----------
const MOCK_LISTINGS = [
  { id: 'l1', title: 'Skyline Residences', subtitle: 'Tower B, 22nd Floor',
    locality: 'Bandra West', city: 'Mumbai',
    price: 42500000, priceLabel: '4.25 Cr',
    bhk: 3, baths: 3, area: 1480, type: 'Apartment', possession: 'Ready to move',
    verified: true, featured: true,
    illustration: 'skyline', color: '#E8DCC8',
    amenities: ['Sea view', 'Private gym', 'Infinity pool', '24/7 concierge', 'Valet parking', 'Smart home'],
    description: 'A rare west-facing residence in one of Bandra\'s most coveted addresses. Floor-to-ceiling windows frame the Arabian Sea, and the home has been designed with a restrained palette of oak, travertine, and brushed brass.',
    builder: 'Lodha Developers', age: '3 years' },
  { id: 'l2', title: 'The Walden', subtitle: 'Garden Wing',
    locality: 'Powai', city: 'Mumbai',
    price: 28500000, priceLabel: '2.85 Cr',
    bhk: 3, baths: 2, area: 1240, type: 'Apartment', possession: 'Dec 2025',
    verified: true, featured: false,
    illustration: 'walden', color: '#D4E4D4',
    amenities: ['Lake view', 'Clubhouse', 'Jogging track', 'Co-working lounge'],
    description: 'Garden-facing apartment in a low-density development by the lake. Quieter than the towers, with mature landscaping and a real sense of community.',
    builder: 'Hiranandani', age: 'Under construction' },
  { id: 'l3', title: 'Vasant House', subtitle: 'Standalone Villa',
    locality: 'Juhu', city: 'Mumbai',
    price: 67500000, priceLabel: '6.75 Cr',
    bhk: 4, baths: 4, area: 2100, type: 'Villa', possession: 'Ready to move',
    verified: true, featured: true,
    illustration: 'vasant', color: '#F4D4C4',
    amenities: ['Private garden', 'Pool', 'Servant quarters', 'Solar panels', 'EV charging'],
    description: 'A standalone four-bedroom home set back from the road on a leafy lane. Built in 2019 with thoughtful proportions and a small but lush garden.',
    builder: 'Independent', age: '5 years' },
  { id: 'l4', title: 'Marine Heights', subtitle: '18th Floor, Sea-facing',
    locality: 'Worli', city: 'Mumbai',
    price: 95000000, priceLabel: '9.50 Cr',
    bhk: 4, baths: 5, area: 2680, type: 'Apartment', possession: 'Ready to move',
    verified: true, featured: true,
    illustration: 'marine', color: '#D8E0EC',
    amenities: ['Panoramic sea view', 'Private elevator', 'Wine cellar', 'Two parking bays', 'Home theatre'],
    description: 'High-floor apartment with uninterrupted views across the Worli sea face. Private elevator opens directly into the residence.',
    builder: 'Oberoi Realty', age: '2 years' },
  { id: 'l5', title: 'Casa Verde', subtitle: 'Carter Road',
    locality: 'Bandra West', city: 'Mumbai',
    price: 18500000, priceLabel: '1.85 Cr',
    bhk: 2, baths: 2, area: 920, type: 'Apartment', possession: 'Ready to move',
    verified: true, featured: false,
    illustration: 'casaVerde', color: '#EDE0F0',
    amenities: ['Balcony', 'Gym', 'Power backup'],
    description: 'A bright two-bedroom in a quiet by-lane off Carter Road. Recently renovated with new fittings throughout.',
    builder: 'Rustomjee', age: '8 years' },
  { id: 'l6', title: 'The Quay', subtitle: 'Sea-facing residences',
    locality: 'Worli', city: 'Mumbai',
    price: 54000000, priceLabel: '5.40 Cr',
    bhk: 3, baths: 3, area: 1680, type: 'Apartment', possession: 'Jun 2026',
    verified: true, featured: false,
    illustration: 'quay', color: '#E4E8D4',
    amenities: ['Sea view', 'Infinity pool', 'Spa', 'Concierge'],
    description: 'Premium tower under construction with an infinity pool overlooking the sea. Possession expected mid-2026.',
    builder: 'K Raheja Corp', age: 'Under construction' },
];

const CITIES = [
  { name: 'Mumbai', state: 'Maharashtra', count: 42, localities: ['Bandra West', 'Worli', 'Juhu', 'Powai', 'Lower Parel', 'Andheri West', 'Khar West', 'Pali Hill'] },
  { name: 'Delhi NCR', state: 'Delhi', count: 38, localities: ['Greater Kailash', 'Vasant Vihar', 'Defence Colony', 'Golf Course Road', 'DLF Phase 5'] },
  { name: 'Bengaluru', state: 'Karnataka', count: 56, localities: ['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'Jayanagar'] },
  { name: 'Pune', state: 'Maharashtra', count: 24, localities: ['Koregaon Park', 'Kalyani Nagar', 'Baner', 'Aundh'] },
  { name: 'Hyderabad', state: 'Telangana', count: 19, localities: ['Jubilee Hills', 'Banjara Hills', 'Gachibowli'] },
  { name: 'Chennai', state: 'Tamil Nadu', count: 16, localities: ['Boat Club', 'Adyar', 'Nungambakkam', 'OMR'] },
];

const INTENT_META = {
  casual:  { label: 'Just browsing',   color: '#F5C6A8', text: '#7B3F1D', icon: Coffee,  dot: '#E89968' },
  soon:    { label: 'Exploring soon',  color: '#C8DCC0', text: '#2D5A2D', icon: Sprout,  dot: '#5C9658' },
  serious: { label: 'Ready to buy',    color: '#FFD66B', text: '#5A3D00', icon: Key,     dot: '#E5A823' },
};

// ---------- Atoms ----------
const Pill = ({ children, active, onClick }) => (
  <button onClick={onClick} className={`px-4 py-2 text-[13px] tracking-wide rounded-full border transition-all duration-300 ${
    active ? 'bg-[#1A1B3A] text-white border-[#1A1B3A] shadow-sm' : 'bg-white text-[#1A1B3A] border-stone-200 hover:border-[#1A1B3A]'
  }`}>{children}</button>
);

const Tag = ({ children, tone = 'default', size = 'md' }) => {
  const tones = {
    default:  'bg-white text-[#1A1B3A] border-stone-200',
    verified: 'bg-[#E8F3E8] text-[#2D5A2D] border-[#C8DCC0]',
    featured: 'bg-[#FFF4D6] text-[#5A3D00] border-[#FFD66B]',
  };
  const sizes = { sm: 'text-[10px] px-2 py-0.5', md: 'text-[11px] px-2.5 py-1' };
  return <span className={`inline-flex items-center gap-1 tracking-[0.06em] uppercase font-medium rounded-full border ${tones[tone]} ${sizes[size]}`}>{children}</span>;
};

// ---------- ListingImage: renders the embedded SVG illustration ----------
const ListingImage = ({ listing, className = '' }) => {
  const Illustration = BUILDING_ILLUSTRATIONS[listing.illustration] || BUILDING_ILLUSTRATIONS.skyline;
  return (
    <div className={`${className} relative overflow-hidden`} style={{ backgroundColor: listing.color }}>
      <Illustration bg={listing.color}/>
    </div>
  );
};

// ---------- Intent Badge ----------
const IntentBadge = ({ intent, onClick, size = 'md', showLabel = true }) => {
  const meta = intent ? INTENT_META[intent] : null;
  if (!meta) {
    return (
      <button onClick={onClick} className={`group inline-flex items-center gap-2 rounded-full border border-dashed border-stone-300 hover:border-[#1A1B3A] hover:bg-white transition ${
        size === 'sm' ? 'px-3 py-1.5 text-[11px]' : 'px-4 py-2 text-[12px]'
      }`}>
        <Plus size={12} className="text-stone-500"/>
        {showLabel && <span className="text-stone-600 group-hover:text-[#1A1B3A]">Set buying intent</span>}
      </button>
    );
  }
  const Icon = meta.icon;
  return (
    <button onClick={onClick} className={`group inline-flex items-center gap-2 rounded-full border transition hover:shadow-sm ${
      size === 'sm' ? 'px-3 py-1.5 text-[11px]' : 'px-4 py-2 text-[12px]'
    }`} style={{ backgroundColor: meta.color, borderColor: meta.color, color: meta.text }}>
      <span className="relative flex items-center">
        <span className="absolute w-2 h-2 rounded-full animate-ping opacity-50" style={{ backgroundColor: meta.dot }}/>
        <span className="relative w-2 h-2 rounded-full" style={{ backgroundColor: meta.dot }}/>
      </span>
      <Icon size={size === 'sm' ? 11 : 13} strokeWidth={2.2}/>
      {showLabel && <span className="font-medium tracking-wide">{meta.label}</span>}
    </button>
  );
};

// ---------- City Selector ----------
const CitySelector = ({ city, onChange, compact }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-2 rounded-full border transition ${
        compact ? 'px-3 py-1.5 text-[12px] bg-white border-stone-200 hover:border-[#1A1B3A]' : 'px-4 py-2.5 text-[13px] bg-white border-stone-200 hover:border-[#1A1B3A]'
      }`}>
        <MapPin size={compact ? 12 : 14} className="text-stone-500"/>
        <span className="font-medium">{city.name}</span>
        <ChevronDown size={compact ? 12 : 14} className={`text-stone-400 transition ${open ? 'rotate-180' : ''}`}/>
      </button>
      {open && (
        <div className="absolute top-full mt-2 left-0 w-80 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="p-2 max-h-[400px] overflow-y-auto">
            {CITIES.map(c => (
              <button key={c.name} onClick={() => { onChange(c); setOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between hover:bg-stone-50 transition ${
                c.name === city.name ? 'bg-stone-50' : ''
              }`}>
                <div>
                  <p className="text-[14px] font-medium text-[#1A1B3A]">{c.name}</p>
                  <p className="text-[11px] text-stone-500">{c.state}</p>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div>
                    <p className="text-[13px] font-display text-[#1A1B3A]">{c.count}</p>
                    <p className="text-[10px] text-stone-500 uppercase tracking-widest">homes</p>
                  </div>
                  {c.name === city.name && <Check size={14} className="text-[#1A1B3A]"/>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ---------- Top Nav ----------
const TopNav = ({ navigate, shortlistCount, user, onOpenAuth, intent, onOpenIntent, city, onChangeCity }) => (
  <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-stone-200/60" style={{ backgroundColor: 'rgba(250, 247, 242, 0.88)' }}>
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between gap-4" style={{ height: '88px' }}>
      <div className="flex items-center gap-6">
        <button onClick={() => navigate({ name: 'home' })} className="flex items-center gap-3 group">
          <div className="relative" style={{ width: '42px', height: '42px' }}>
            <div className="absolute inset-0 rounded-xl rotate-3 group-hover:rotate-6 transition-transform" style={{ backgroundColor: '#1A1B3A' }}/>
            <div className="absolute inset-0 rounded-xl -rotate-3 group-hover:-rotate-6 transition-transform" style={{ backgroundColor: '#FFD66B', mixBlendMode: 'multiply' }}/>
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="font-display tracking-tight" style={{ fontSize: '28px', color: '#1A1B3A' }}>nest</span>
            <span className="tracking-[0.25em] uppercase text-stone-500" style={{ fontSize: '10px', marginTop: '2px' }}>By invitation</span>
          </div>
        </button>
        <div className="hidden md:block h-9 w-px bg-stone-200"/>
        <div className="hidden md:block">
          <CitySelector city={city} onChange={onChangeCity} compact/>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-stone-700" style={{ fontSize: '15px' }}>
        <button onClick={() => navigate({ name: 'search' })} className="hover:text-[#1A1B3A] transition">Browse</button>
        <button onClick={() => navigate({ name: 'shortlist' })} className="hover:text-[#1A1B3A] transition flex items-center gap-1.5">
          Shortlist
          {shortlistCount > 0 && <span className="rounded-full px-1.5 min-w-[18px] text-center font-medium" style={{ fontSize: '10px', backgroundColor: '#1A1B3A', color: '#ffffff' }}>{shortlistCount}</span>}
        </button>
        <button className="hover:text-[#1A1B3A] transition">Dealers</button>
      </nav>

      <div className="flex items-center gap-3">
        {user && <IntentBadge intent={intent} onClick={onOpenIntent} size="sm"/>}
        {user ? (
          <button onClick={() => navigate({ name: 'profile' })} className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-stone-200 hover:border-[#1A1B3A] transition bg-white">
            <div className="rounded-full flex items-center justify-center font-medium" style={{ width: '32px', height: '32px', backgroundColor: '#1A1B3A', color: '#ffffff', fontSize: '12px' }}>{user.name[0].toUpperCase()}</div>
            <span className="text-stone-800 hidden sm:block" style={{ fontSize: '14px' }}>{user.name.split(' ')[0]}</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="font-medium transition"
            style={{
              fontSize: '14px',
              padding: '12px 22px',
              backgroundColor: '#1A1B3A',
              color: '#ffffff',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 14px -4px rgba(26, 27, 58, 0.4)',
            }}
            onMouseOver={e => { e.currentTarget.style.backgroundColor = '#2A2B5A'; }}
            onMouseOut={e => { e.currentTarget.style.backgroundColor = '#1A1B3A'; }}
          >
            Sign in <span style={{ opacity: 0.5, margin: '0 4px' }}>/</span> Join now
          </button>
        )}
      </div>
    </div>
  </header>
);

// ---------- Home / Landing — clean centered hero ----------
const HomePage = ({ navigate, listings, toggleShortlist, shortlist, intent, onOpenIntent, user, city, onChangeCity }) => {
  const [query, setQuery] = useState('');
  const [localityOpen, setLocalityOpen] = useState(false);
  const submitSearch = () => navigate({ name: 'search', query, city: city.name });

  const featured = listings.filter(l => l.featured);

  return (
    <div>
      {/* Centered hero banner */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-20 left-1/4 rounded-full blur-3xl" style={{ width: '400px', height: '400px', backgroundColor: '#FFD66B', opacity: 0.2 }}/>
          <div className="absolute top-40 right-1/4 rounded-full blur-3xl" style={{ width: '500px', height: '500px', backgroundColor: '#FFB5A7', opacity: 0.2 }}/>
          <div className="absolute bottom-0 left-1/3 rounded-full blur-3xl" style={{ width: '400px', height: '400px', backgroundColor: '#C8DCC0', opacity: 0.25 }}/>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-24 pb-20 text-center">
          {/* Status pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white rounded-full border border-stone-200 mb-10 shadow-sm">
            <span className="relative flex items-center">
              <span className="absolute w-2 h-2 rounded-full animate-ping opacity-60" style={{ backgroundColor: '#5C9658' }}/>
              <span className="relative w-2 h-2 rounded-full" style={{ backgroundColor: '#5C9658' }}/>
            </span>
            <span className="text-[12px] text-stone-700"><span className="font-medium">{city.count} homes</span> verified in {city.name}</span>
          </div>

          {/* Big banner title — sized in inline style for reliability */}
          <h1 className="font-display leading-[0.92] tracking-tight" style={{ color: '#1A1B3A', fontSize: 'clamp(56px, 11vw, 140px)' }}>
            Homes that <em className="italic font-normal">earn</em>
            <br/>
            their <span className="relative inline-block">
              <span className="relative z-10">listing.</span>
              <span className="absolute inset-x-0 z-0" style={{ backgroundColor: '#FFD66B', bottom: '0.12em', height: '0.22em', transform: 'rotate(-1deg)' }}/>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-10 leading-relaxed text-stone-600 max-w-2xl mx-auto" style={{ fontSize: 'clamp(16px, 1.8vw, 22px)' }}>
            A curated marketplace where every property is verified by us, and dealers only hear from buyers who are actually ready to talk.
          </p>

          {/* Search composer — city + locality */}
          <div className="mt-14 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-2 flex items-stretch shadow-[0_20px_60px_-20px_rgba(26,27,58,0.2)] border border-stone-200 flex-col sm:flex-row gap-2 sm:gap-0">
              {/* City picker inside search */}
              <div className="flex items-center gap-2 px-5 py-2 sm:border-r border-stone-200 relative">
                <CitySelector city={city} onChange={onChangeCity}/>
              </div>
              {/* Locality input */}
              <div className="flex items-center gap-3 px-5 flex-1 relative">
                <Search size={18} className="text-stone-400"/>
                <input
                  value={query}
                  onChange={e => { setQuery(e.target.value); setLocalityOpen(true); }}
                  onFocus={() => setLocalityOpen(true)}
                  onBlur={() => setTimeout(() => setLocalityOpen(false), 150)}
                  onKeyDown={e => e.key === 'Enter' && submitSearch()}
                  placeholder={`Locality in ${city.name}…`}
                  className="flex-1 bg-transparent outline-none text-[15px] py-3.5 text-[#1A1B3A] placeholder:text-stone-400 min-w-0"
                />
                {localityOpen && city.localities.filter(l => l.toLowerCase().includes(query.toLowerCase())).length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 overflow-hidden text-left">
                    {city.localities.filter(l => l.toLowerCase().includes(query.toLowerCase())).slice(0, 6).map(loc => (
                      <button key={loc} onMouseDown={() => { setQuery(loc); setLocalityOpen(false); }} className="w-full text-left px-5 py-3 text-[14px] text-stone-700 hover:bg-stone-50 transition flex items-center gap-2">
                        <MapPin size={13} className="text-stone-400"/> {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={submitSearch} className="px-7 py-4 bg-[#1A1B3A] text-white rounded-xl text-[14px] hover:bg-[#2A2B5A] transition flex items-center justify-center gap-2 font-medium">
                Find homes <ArrowRight size={16}/>
              </button>
            </div>

            {/* Popular localities */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[12px] text-stone-500 mr-1">Popular in {city.name}:</span>
              {city.localities.slice(0, 5).map(loc => (
                <button key={loc} onClick={() => navigate({ name: 'search', query: loc, city: city.name })}
                  className="text-[12px] px-3 py-1.5 bg-white border border-stone-200 hover:border-[#1A1B3A] rounded-full text-stone-700 hover:text-[#1A1B3A] transition">
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Intent section */}
      <section className="border-y border-stone-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16">
          <div className="text-center mb-12">
            <p className="text-[11px] tracking-[0.2em] uppercase text-stone-500">How it works</p>
            <h2 className="font-display text-[40px] md:text-[52px] text-[#1A1B3A] mt-2 leading-none">Tell us where you stand</h2>
            <p className="text-[15px] text-stone-600 mt-3 max-w-lg mx-auto">Your intent shapes your experience — and protects you from spam. Change it anytime.</p>
          </div>

          <div className="max-w-[1100px] mx-auto" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              { id: 'casual', body: 'Look around freely. We won\'t share your details with anyone.', features: ['Browse all listings', 'Save favourites', 'Zero dealer contact'] },
              { id: 'soon', body: 'Researching for the next 3–6 months. Get weekly digests of new homes.', features: ['Tailored recommendations', 'New listing alerts', 'Optional dealer intros'] },
              { id: 'serious', body: 'You\'re actively looking. A vetted dealer will reach out within hours.', features: ['Priority response', 'Visit scheduling', 'Single dealer match'] },
            ].map(o => {
              const meta = INTENT_META[o.id];
              const Icon = meta.icon;
              const isCurrent = intent === o.id;
              return (
                <button key={o.id} onClick={user ? onOpenIntent : null}
                  className={`text-left p-7 rounded-3xl border-2 transition-all relative overflow-hidden group ${
                    isCurrent ? 'border-[#1A1B3A] shadow-md' : 'border-stone-200 hover:border-stone-400 bg-[#FAF7F2]'
                  }`} style={isCurrent ? { backgroundColor: meta.color + '40' } : {}}>
                  <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full opacity-50" style={{ backgroundColor: meta.color }}/>
                  <div className="relative">
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: meta.color }}>
                        <Icon size={20} style={{ color: meta.text }} strokeWidth={2}/>
                      </div>
                      {isCurrent && <span className="text-[10px] uppercase tracking-widest font-medium px-2 py-1 rounded-full bg-[#1A1B3A] text-white">Active</span>}
                    </div>
                    <h3 className="font-display text-[26px] text-[#1A1B3A] leading-tight">{meta.label}</h3>
                    <p className="text-[13px] leading-relaxed text-stone-600 mt-2">{o.body}</p>
                    <ul className="mt-5 space-y-2">
                      {o.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-[12px] text-stone-700">
                          <Check size={12} style={{ color: meta.dot }} strokeWidth={3}/> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured listings — clean uniform grid */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-stone-500">This week in {city.name}</p>
            <h2 className="font-display text-[44px] md:text-[56px] text-[#1A1B3A] mt-1 leading-none">Hand-picked homes</h2>
          </div>
          <button onClick={() => navigate({ name: 'search' })} className="group flex items-center gap-2 text-[14px] font-medium text-[#1A1B3A] hover:gap-3 transition-all">
            See all {city.count} homes
            <span className="w-9 h-9 rounded-full bg-[#1A1B3A] text-white flex items-center justify-center">
              <ArrowUpRight size={16}/>
            </span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', columnGap: '24px', rowGap: '40px' }}>
          {featured.slice(0, 6).map(l => (
            <ListingCard key={l.id} listing={l} navigate={navigate} toggleShortlist={toggleShortlist} shortlisted={shortlist.includes(l.id)}/>
          ))}
        </div>
      </section>

      {/* Trust strip — dark section */}
      <section style={{ backgroundColor: '#1A1B3A', color: '#ffffff' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'start' }}>
            <div>
              <p className="tracking-[0.2em] uppercase font-medium" style={{ fontSize: '11px', color: '#FFD66B' }}>Why nest</p>
              <h2 className="font-display leading-[0.95] mt-3" style={{ fontSize: 'clamp(40px, 5.5vw, 68px)', color: '#ffffff' }}>
                No fake leads.<br/>
                No bait listings.<br/>
                <em className="italic" style={{ color: '#FFD66B' }}>No noise.</em>
              </h2>
              <p className="mt-7 leading-relaxed" style={{ fontSize: '16px', color: '#D1D1D6', maxWidth: '520px' }}>
                We control the supply side ourselves. Every home is verified before going live. And dealers only see leads from buyers who tell us they're ready.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {[
                { num: '100%', label: 'Verified listings' },
                { num: '12',   label: 'Vetted dealers' },
                { num: '4hrs', label: 'Avg. response' },
                { num: '0',    label: 'Spam calls' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <p className="font-display leading-none" style={{ fontSize: '44px', color: '#FFD66B' }}>{s.num}</p>
                  <p className="mt-2 tracking-wide" style={{ fontSize: '12px', color: '#D1D1D6' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
};

// ---------- Listing Card — clean single variant ----------
const ListingCard = ({ listing, navigate, toggleShortlist, shortlisted }) => {
  const goTo = () => navigate({ name: 'listing', id: listing.id });
  const toggle = (e) => { e.stopPropagation(); toggleShortlist(listing.id); };

  return (
    <article className="group cursor-pointer" onClick={goTo}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <ListingImage listing={listing} className="absolute inset-0 w-full h-full group-hover:scale-[1.04] transition-transform duration-700"/>
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {listing.featured && <Tag tone="featured" size="sm"><Star size={9} fill="currentColor"/> Pick</Tag>}
          {listing.verified && <Tag tone="verified" size="sm"><Check size={9}/> Verified</Tag>}
        </div>
        <button onClick={toggle} className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur transition ${
          shortlisted ? 'bg-[#FFD66B] text-[#1A1B3A]' : 'bg-white/85 text-stone-700 hover:bg-white'
        }`}>
          <Heart size={15} fill={shortlisted ? 'currentColor' : 'none'}/>
        </button>
      </div>
      <div className="mt-4 px-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[22px] text-[#1A1B3A] leading-tight truncate">{listing.title}</h3>
          <p className="font-display text-[22px] text-[#1A1B3A] whitespace-nowrap">₹{listing.priceLabel}</p>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-[13px] text-stone-500 flex items-center gap-1 truncate"><MapPin size={11}/>{listing.locality}</p>
          <p className="text-[12px] text-stone-600 whitespace-nowrap ml-2">{listing.bhk} BHK · {listing.area} sq.ft</p>
        </div>
      </div>
    </article>
  );
};

// ---------- Search / Results ----------
const SearchPage = ({ navigate, route, listings, toggleShortlist, shortlist, intent, onOpenIntent, user, city, onChangeCity }) => {
  const [query, setQuery] = useState(route.query || '');
  const [filters, setFilters] = useState({ bhk: [], type: [], priceMax: null, possession: null });
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let r = listings.filter(l => {
      if (query && !`${l.locality} ${l.city} ${l.title}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (filters.bhk.length && !filters.bhk.includes(l.bhk)) return false;
      if (filters.type.length && !filters.type.includes(l.type)) return false;
      if (filters.priceMax && l.price > filters.priceMax) return false;
      if (filters.possession === 'ready' && l.possession !== 'Ready to move') return false;
      return true;
    });
    if (sort === 'price-asc') r.sort((a,b) => a.price - b.price);
    if (sort === 'price-desc') r.sort((a,b) => b.price - a.price);
    return r;
  }, [listings, query, filters, sort]);

  const toggleArr = (key, val) => setFilters(f => ({ ...f, [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val] }));
  const activeCount = filters.bhk.length + filters.type.length + (filters.priceMax ? 1 : 0) + (filters.possession ? 1 : 0);

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="sticky z-30 backdrop-blur-xl border-b border-stone-200/60" style={{ top: '88px', backgroundColor: 'rgba(250, 247, 242, 0.9)' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5">
          <div className="flex items-center gap-3 flex-wrap">
            <CitySelector city={city} onChange={onChangeCity}/>
            <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-full px-5 py-3 flex-1 min-w-[200px] max-w-sm shadow-sm">
              <Search size={16} className="text-stone-400"/>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder={`Locality in ${city.name}…`} className="bg-transparent outline-none text-[14px] flex-1 min-w-0"/>
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-[13px] font-medium transition border ${
                showFilters || activeCount > 0 ? 'bg-[#1A1B3A] text-white border-[#1A1B3A]' : 'bg-white border-stone-200 hover:border-[#1A1B3A]'
              }`}>
              <SlidersHorizontal size={14}/> Filters
              {activeCount > 0 && <span className="bg-[#FFD66B] text-[#1A1B3A] rounded-full text-[10px] px-1.5 min-w-[18px] text-center">{activeCount}</span>}
            </button>
            <select value={sort} onChange={e => setSort(e.target.value)} className="px-5 py-3 bg-white border border-stone-200 rounded-full text-[13px] outline-none cursor-pointer hover:border-[#1A1B3A]">
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
            </select>
            <div className="ml-auto flex bg-white border border-stone-200 rounded-full p-1">
              <button onClick={() => setView('grid')} className={`px-4 py-2 text-[12px] rounded-full font-medium transition ${view === 'grid' ? 'bg-[#1A1B3A] text-white' : 'text-stone-600'}`}>Grid</button>
              <button onClick={() => setView('map')} className={`px-4 py-2 text-[12px] rounded-full font-medium transition ${view === 'map' ? 'bg-[#1A1B3A] text-white' : 'text-stone-600'}`}>Map</button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-5 pt-5 border-t border-stone-200 text-[13px]" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
              <div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-stone-500 mb-3 font-medium">Bedrooms</p>
                <div className="flex flex-wrap gap-1.5">{[1,2,3,4,5].map(n => <Pill key={n} active={filters.bhk.includes(n)} onClick={() => toggleArr('bhk', n)}>{n} BHK</Pill>)}</div>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-stone-500 mb-3 font-medium">Type</p>
                <div className="flex flex-wrap gap-1.5">{['Apartment','Villa','Plot'].map(t => <Pill key={t} active={filters.type.includes(t)} onClick={() => toggleArr('type', t)}>{t}</Pill>)}</div>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-stone-500 mb-3 font-medium">Max price</p>
                <div className="flex flex-wrap gap-1.5">{[{ label: '2 Cr', v: 20000000 }, { label: '5 Cr', v: 50000000 }, { label: '10 Cr', v: 100000000 }].map(p => (
                  <Pill key={p.v} active={filters.priceMax === p.v} onClick={() => setFilters(f => ({ ...f, priceMax: f.priceMax === p.v ? null : p.v }))}>{p.label}</Pill>
                ))}</div>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-stone-500 mb-3 font-medium">Possession</p>
                <div className="flex flex-wrap gap-1.5">
                  <Pill active={filters.possession === 'ready'} onClick={() => setFilters(f => ({ ...f, possession: f.possession === 'ready' ? null : 'ready' }))}>Ready to move</Pill>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
        <div className="flex items-baseline justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-stone-500">Results in {city.name}</p>
            <p className="font-display text-[40px] text-[#1A1B3A] mt-1 leading-none">
              {filtered.length} {filtered.length === 1 ? 'home' : 'homes'}
              {query && <span className="italic text-stone-500"> in {query}</span>}
            </p>
          </div>
          {user && <div className="flex items-center gap-3 text-[13px] text-stone-600"><span>Searching as:</span><IntentBadge intent={intent} onClick={onOpenIntent} size="sm"/></div>}
        </div>

        {view === 'grid' ? (
          filtered.length === 0 ? <EmptyState/> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', columnGap: '24px', rowGap: '40px' }}>
              {filtered.map(l => <ListingCard key={l.id} listing={l} navigate={navigate} toggleShortlist={toggleShortlist} shortlisted={shortlist.includes(l.id)}/>)}
            </div>
          )
        ) : <MapView listings={filtered} navigate={navigate}/>}
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="text-center py-24 bg-white border border-dashed border-stone-300 rounded-3xl">
    <div className="font-display italic text-[44px] text-stone-300">Nothing here yet</div>
    <p className="mt-3 text-stone-500 text-[14px]">Try widening your filters or a different locality.</p>
  </div>
);

const MapView = ({ listings, navigate }) => {
  const [hoveredId, setHoveredId] = useState(null);
  return (
    <div className="map-grid">
      <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[calc(100vh-260px)] rounded-3xl overflow-hidden border border-stone-200" style={{ background: 'linear-gradient(135deg, #E8E2D5 0%, #D8D0BE 100%)' }}>
        <svg className="absolute inset-0 w-full h-full opacity-40">
          <defs><pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="#a89c84" strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 600">
          <path d="M0,300 Q200,200 400,350 T800,300" stroke="#C8BCA0" strokeWidth="4" fill="none"/>
          <path d="M400,0 Q450,200 350,400 T400,600" stroke="#C8BCA0" strokeWidth="4" fill="none"/>
          <path d="M0,100 Q300,150 500,80 T800,150" stroke="#C8BCA0" strokeWidth="3" fill="none"/>
        </svg>
        {listings.map((l, i) => {
          const x = 15 + (i * 13) % 70;
          const y = 20 + (i * 17) % 60;
          const active = hoveredId === l.id;
          return (
            <button key={l.id} onClick={() => navigate({ name: 'listing', id: l.id })}
              onMouseEnter={() => setHoveredId(l.id)} onMouseLeave={() => setHoveredId(null)}
              style={{ left: `${x}%`, top: `${y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-full font-display text-[14px] whitespace-nowrap transition-all shadow-md ${
                active ? 'bg-[#1A1B3A] text-white scale-110 z-10 shadow-xl' : 'bg-white text-[#1A1B3A] hover:scale-105'
              }`}>₹{l.priceLabel}</button>
          );
        })}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-full text-[11px] text-stone-600">Stylized preview · production uses MapLibre</div>
      </div>

      <div className="space-y-3 lg:max-h-[calc(100vh-260px)] lg:overflow-y-auto lg:pr-2">
        {listings.map(l => (
          <button key={l.id} onClick={() => navigate({ name: 'listing', id: l.id })}
            onMouseEnter={() => setHoveredId(l.id)} onMouseLeave={() => setHoveredId(null)}
            className={`block w-full text-left bg-white border rounded-2xl overflow-hidden transition ${
              hoveredId === l.id ? 'border-[#1A1B3A] shadow-md' : 'border-stone-200 hover:border-stone-400'
            }`}>
            <div className="flex gap-3">
              <div className="w-32 h-32 flex-shrink-0"><ListingImage listing={l} className="w-full h-full"/></div>
              <div className="flex-1 py-3 pr-3">
                <p className="font-display text-[18px] text-[#1A1B3A] leading-tight">{l.title}</p>
                <p className="text-[11px] text-stone-500 mt-0.5">{l.locality}</p>
                <p className="font-display text-[20px] text-[#1A1B3A] mt-2">₹{l.priceLabel}</p>
                <p className="text-[11px] text-stone-600 mt-0.5">{l.bhk} BHK · {l.area} sq.ft</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ---------- Listing Detail ----------
const ListingDetailPage = ({ navigate, route, listings, toggleShortlist, shortlist, user, onContactDealer, intent, onOpenIntent }) => {
  const listing = listings.find(l => l.id === route.id);
  if (!listing) return <div className="p-20 text-center">Listing not found</div>;
  const shortlisted = shortlist.includes(listing.id);

  return (
    <div className="bg-[#FAF7F2]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-8">
        <button onClick={() => navigate({ name: 'search' })} className="flex items-center gap-2 text-[13px] text-stone-600 hover:text-[#1A1B3A] mb-5">
          <ArrowLeft size={14}/> Back to search
        </button>

        {/* Hero illustration */}
        <div className="rounded-3xl overflow-hidden h-[480px] relative">
          <ListingImage listing={listing} className="w-full h-full"/>
          <div className="absolute top-5 left-5 flex flex-col gap-2">
            {listing.featured && <Tag tone="featured"><Star size={10} fill="currentColor"/> Editor's pick</Tag>}
            {listing.verified && <Tag tone="verified"><Check size={10}/> Verified by nest</Tag>}
          </div>
          <button onClick={() => toggleShortlist(listing.id)}
            className={`absolute top-5 right-5 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur transition ${
              shortlisted ? 'bg-[#FFD66B] text-[#1A1B3A]' : 'bg-white/80 text-stone-700 hover:bg-white'
            }`}>
            <Heart size={17} fill={shortlisted ? 'currentColor' : 'none'}/>
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12 detail-grid">
        <div>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Tag>{listing.type}</Tag>
            <Tag>{listing.possession}</Tag>
            <Tag>{listing.age}</Tag>
          </div>
          <p className="text-[13px] text-stone-500 mb-2 flex items-center gap-1.5"><MapPin size={13}/> {listing.locality}, {listing.city}</p>
          <h1 className="font-display text-[56px] leading-[0.95] text-[#1A1B3A]">{listing.title}</h1>
          <p className="font-display italic text-[24px] text-stone-500 mt-1">{listing.subtitle}</p>

          <div className="mt-10" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
            {[
              { icon: Bed, label: 'Bedrooms', value: listing.bhk },
              { icon: Bath, label: 'Bathrooms', value: listing.baths },
              { icon: Maximize2, label: 'Carpet', value: `${listing.area} sq.ft` },
              { icon: HomeIcon, label: 'Built', value: listing.age },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-2xl p-5 border border-stone-200">
                  <Icon size={18} className="text-stone-400 mb-3" strokeWidth={1.8}/>
                  <p className="font-display text-[24px] text-[#1A1B3A] leading-none">{s.value}</p>
                  <p className="text-[11px] uppercase tracking-wider text-stone-500 mt-1.5">{s.label}</p>
                </div>
              );
            })}
          </div>

          <section className="mt-12">
            <h2 className="font-display text-[32px] text-[#1A1B3A] mb-4">About this home</h2>
            <p className="text-[16px] leading-[1.75] text-stone-700">{listing.description}</p>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-[32px] text-[#1A1B3A] mb-5">What's included</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {listing.amenities.map(a => (
                <div key={a} className="flex items-center gap-3 px-4 py-3 bg-white border border-stone-200 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-[#FFF4D6] flex items-center justify-center">
                    <Check size={13} className="text-[#5A3D00]" strokeWidth={2.5}/>
                  </div>
                  <span className="text-[14px] text-stone-700">{a}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-[32px] text-[#1A1B3A] mb-5">Where it is</h2>
            <div className="aspect-[16/9] rounded-3xl overflow-hidden border border-stone-200 relative" style={{ background: 'linear-gradient(135deg, #E8E2D5 0%, #D8D0BE 100%)' }}>
              <svg className="absolute inset-0 w-full h-full opacity-40">
                <defs><pattern id="grid3" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="#a89c84" strokeWidth="0.5"/></pattern></defs>
                <rect width="100%" height="100%" fill="url(#grid3)"/>
              </svg>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-5 h-5 bg-[#1A1B3A] rounded-full ring-8 ring-[#1A1B3A]/15 animate-pulse"/>
                <div className="mt-3 px-4 py-2 bg-white rounded-full text-[13px] font-display shadow-md">{listing.locality}</div>
              </div>
            </div>
          </section>
        </div>

        {/* Sticky sidebar */}
        <aside className="lg:sticky self-start space-y-4" style={{ top: '104px' }}>
          <div className="bg-white border border-stone-200 rounded-3xl p-7 shadow-sm">
            <p className="text-[11px] tracking-[0.2em] uppercase text-stone-500">Asking</p>
            <p className="font-display text-[48px] text-[#1A1B3A] leading-none mt-1">₹{listing.priceLabel}</p>
            <p className="text-[12px] text-stone-500 mt-2">₹{Math.round(listing.price / listing.area).toLocaleString('en-IN')} per sq.ft</p>

            {user && (
              <div className="mt-5 flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: intent ? INTENT_META[intent].color + '40' : '#F5F5F0' }}>
                <span className="text-[12px] text-stone-700">Contacting as</span>
                <IntentBadge intent={intent} onClick={onOpenIntent} size="sm"/>
              </div>
            )}

            <div className="mt-5 space-y-2.5">
              <button onClick={() => onContactDealer(listing, 'callback')} className="w-full py-4 bg-[#1A1B3A] text-white rounded-xl text-[14px] hover:bg-[#2A2B5A] transition flex items-center justify-center gap-2 font-medium">
                <Phone size={15}/> Request a callback
              </button>
              <button onClick={() => onContactDealer(listing, 'visit')} className="w-full py-4 bg-white border-2 border-[#1A1B3A] text-[#1A1B3A] rounded-xl text-[14px] hover:bg-[#1A1B3A]/5 transition flex items-center justify-center gap-2 font-medium">
                <Calendar size={15}/> Schedule a visit
              </button>
            </div>

            <div className="mt-6 pt-5 border-t border-stone-200 flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#E8F3E8] flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck size={12} className="text-[#2D5A2D]"/>
              </div>
              <p className="text-[12px] text-stone-600 leading-relaxed">You'll be contacted by <span className="font-medium text-[#1A1B3A]">one vetted dealer</span> — only if you tell us you're ready.</p>
            </div>
          </div>

          <div className="rounded-3xl p-7" style={{ backgroundColor: '#1A1B3A', color: '#ffffff' }}>
            <p className="tracking-[0.2em] uppercase" style={{ fontSize: '11px', color: '#FFD66B' }}>Listed by</p>
            <p className="font-display mt-1" style={{ fontSize: '22px', color: '#ffffff' }}>{listing.builder}</p>
            <p className="mt-1" style={{ fontSize: '12px', color: '#A1A1AA' }}>Verified developer · 18 active listings</p>
          </div>
        </aside>
      </div>
      <Footer/>
    </div>
  );
};

// ---------- Shortlist ----------
const ShortlistPage = ({ navigate, listings, toggleShortlist, shortlist, intent, onOpenIntent, user }) => {
  const items = listings.filter(l => shortlist.includes(l.id));
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12 min-h-screen">
      <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-stone-500">Saved homes</p>
          <h1 className="font-display text-[56px] text-[#1A1B3A] mt-1 leading-none">Your shortlist</h1>
          <p className="text-[14px] text-stone-600 mt-3">{items.length} {items.length === 1 ? 'home' : 'homes'} saved</p>
        </div>
        {user && <IntentBadge intent={intent} onClick={onOpenIntent}/>}
      </div>
      {items.length === 0 ? (
        <div className="text-center py-24 bg-white border border-dashed border-stone-300 rounded-3xl">
          <Heart size={32} className="text-stone-300 mx-auto mb-4"/>
          <p className="font-display italic text-[32px] text-stone-400">No homes yet</p>
          <p className="text-stone-500 text-[14px] mt-2 mb-6">Tap the heart on any listing to save it here.</p>
          <button onClick={() => navigate({ name: 'search' })} className="px-7 py-3 bg-[#1A1B3A] text-white rounded-full text-[13px] hover:bg-[#2A2B5A] font-medium">Browse homes</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', columnGap: '24px', rowGap: '40px' }}>
          {items.map(l => <ListingCard key={l.id} listing={l} navigate={navigate} toggleShortlist={toggleShortlist} shortlisted={true}/>)}
        </div>
      )}
    </div>
  );
};

// ---------- Profile ----------
const ProfilePage = ({ user, intent, navigate, onChangeIntent, onSignOut, viewedCount, shortlist }) => {
  if (!user) return <div className="p-20 text-center text-stone-600">Please sign in.</div>;
  const meta = intent ? INTENT_META[intent] : null;
  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-10 py-12 min-h-screen">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-20 h-20 rounded-2xl bg-[#1A1B3A] text-white flex items-center justify-center font-display text-[36px]">{user.name[0].toUpperCase()}</div>
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-stone-500">Member</p>
          <h1 className="font-display text-[44px] text-[#1A1B3A] leading-tight">{user.name}</h1>
          <p className="text-[14px] text-stone-500">{user.phone}</p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl p-8 mb-6" style={{ backgroundColor: meta ? meta.color : '#F5F5F0' }}>
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-40" style={{ backgroundColor: meta ? meta.dot : '#999' }}/>
        <div className="relative">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase font-medium" style={{ color: meta ? meta.text : '#666' }}>Your buying intent</p>
              <p className="font-display text-[44px] mt-2 leading-tight" style={{ color: meta ? meta.text : '#1A1B3A' }}>{meta ? meta.label : 'Not set'}</p>
              <p className="text-[14px] mt-3 max-w-md leading-relaxed" style={{ color: meta ? meta.text : '#666', opacity: 0.85 }}>
                {intent === 'serious' && 'A dealer from our bench will reach out when you request a callback.'}
                {intent === 'soon' && 'You\'ll get a weekly digest of new homes. No dealer contact yet.'}
                {intent === 'casual' && 'You\'re browsing freely. No one will contact you.'}
                {!intent && 'Tell us where you stand so we can tailor your experience.'}
              </p>
            </div>
            <button onClick={onChangeIntent} className="px-5 py-2.5 bg-[#1A1B3A] text-white rounded-full text-[13px] font-medium hover:bg-[#2A2B5A]">{intent ? 'Change' : 'Set intent'}</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-stone-200 rounded-3xl p-6">
          <Eye size={18} className="text-stone-400 mb-3" strokeWidth={1.8}/>
          <p className="font-display text-[40px] text-[#1A1B3A] leading-none">{viewedCount}</p>
          <p className="text-[12px] text-stone-500 mt-1.5 tracking-wide">Homes viewed</p>
        </div>
        <button onClick={() => navigate({ name: 'shortlist' })} className="bg-white border border-stone-200 rounded-3xl p-6 text-left hover:border-[#1A1B3A] transition group">
          <div className="flex items-center justify-between mb-3">
            <BookmarkCheck size={18} className="text-stone-400" strokeWidth={1.8}/>
            <ArrowUpRight size={16} className="text-stone-400 group-hover:text-[#1A1B3A]"/>
          </div>
          <p className="font-display text-[40px] text-[#1A1B3A] leading-none">{shortlist.length}</p>
          <p className="text-[12px] text-stone-500 mt-1.5 tracking-wide">Saved homes</p>
        </button>
      </div>

      <button onClick={onSignOut} className="mt-10 text-[13px] text-stone-500 hover:text-[#1A1B3A] underline underline-offset-4">Sign out</button>
    </div>
  );
};

// ---------- Modals (unchanged) ----------
const AuthModal = ({ open, onClose, onSignIn }) => {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const reset = () => { setStep('phone'); setPhone(''); setOtp(''); setName(''); };
  const submit = () => {
    if (step === 'phone' && phone.length >= 10) setStep('otp');
    else if (step === 'otp' && otp.length === 4) setStep('name');
    else if (step === 'name' && name.trim()) { onSignIn({ name: name.trim(), phone: `+91 ${phone}` }); reset(); }
  };
  if (!open) return null;
  return (
    <Modal onClose={() => { onClose(); reset(); }}>
      <div className="p-10">
        <div className="relative w-12 h-12 mb-7">
          <div className="absolute inset-0 rounded-xl bg-[#1A1B3A] rotate-3"/>
          <div className="absolute inset-0 rounded-xl bg-[#FFD66B] -rotate-3 mix-blend-multiply"/>
        </div>
        <span className="text-[11px] tracking-[0.2em] uppercase text-stone-500">Welcome</span>
        <h2 className="font-display text-[36px] text-[#1A1B3A] mt-1 leading-tight">
          {step === 'phone' && 'Sign in to nest'}
          {step === 'otp' && 'Verify your number'}
          {step === 'name' && 'Almost there'}
        </h2>
        <p className="text-[14px] text-stone-600 mt-2">
          {step === 'phone' && 'We use your phone — no passwords, ever.'}
          {step === 'otp' && `A 4-digit code is on its way to +91 ${phone}.`}
          {step === 'name' && 'What should we call you?'}
        </p>
        <div className="mt-7">
          {step === 'phone' && (
            <div className="flex items-center border-2 border-stone-200 rounded-xl focus-within:border-[#1A1B3A] transition">
              <span className="px-4 py-4 text-[15px] text-stone-700 border-r-2 border-stone-200">+91</span>
              <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))} placeholder="Mobile number" className="flex-1 px-4 py-4 outline-none text-[15px] bg-transparent" autoFocus/>
            </div>
          )}
          {step === 'otp' && (
            <>
              <input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="– – – –" className="w-full px-4 py-5 border-2 border-stone-200 rounded-xl outline-none text-center text-[28px] tracking-[1em] font-display focus:border-[#1A1B3A] transition" autoFocus/>
              <p className="text-[12px] text-stone-500 text-center mt-3">Use any 4-digit code for the demo</p>
            </>
          )}
          {step === 'name' && <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="w-full px-4 py-4 border-2 border-stone-200 rounded-xl outline-none text-[15px] focus:border-[#1A1B3A] transition" autoFocus/>}
        </div>
        <button onClick={submit} className="w-full mt-6 py-4 bg-[#1A1B3A] text-white rounded-xl text-[14px] hover:bg-[#2A2B5A] transition flex items-center justify-center gap-2 font-medium">
          {step === 'name' ? 'Continue' : 'Next'} <ArrowRight size={15}/>
        </button>
      </div>
    </Modal>
  );
};

const IntentModal = ({ open, onClose, onSelect, currentIntent }) => {
  if (!open) return null;
  const options = [
    { id: 'casual', subtitle: 'I\'m curious about the market. Don\'t contact me.' },
    { id: 'soon', subtitle: 'I\'m researching for the next 3–6 months.' },
    { id: 'serious', subtitle: 'I want to see homes and talk to a dealer.' },
  ];
  return (
    <Modal onClose={onClose} wide>
      <div className="p-10">
        <span className="text-[11px] tracking-[0.2em] uppercase text-stone-500">Tell us about you</span>
        <h2 className="font-display text-[40px] text-[#1A1B3A] mt-1 leading-[1.05]">Where are you in your<br/>home-buying <em className="italic">journey?</em></h2>
        <p className="text-[14px] text-stone-600 mt-3">You can change this anytime in your profile.</p>
        <div className="mt-8 space-y-3">
          {options.map(o => {
            const meta = INTENT_META[o.id];
            const Icon = meta.icon;
            const active = currentIntent === o.id;
            return (
              <button key={o.id} onClick={() => { onSelect(o.id); onClose(); }}
                className={`w-full text-left p-5 border-2 rounded-2xl transition flex items-center gap-5 ${
                  active ? 'border-[#1A1B3A]' : 'border-stone-200 hover:border-stone-400'
                }`} style={active ? { backgroundColor: meta.color + '50' } : {}}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: meta.color }}>
                  <Icon size={22} style={{ color: meta.text }} strokeWidth={2}/>
                </div>
                <div className="flex-1">
                  <p className="font-display text-[22px] text-[#1A1B3A] leading-tight">{meta.label}</p>
                  <p className="text-[13px] text-stone-600 mt-0.5">{o.subtitle}</p>
                </div>
                {active && <div className="w-7 h-7 rounded-full bg-[#1A1B3A] flex items-center justify-center"><Check size={14} className="text-white" strokeWidth={3}/></div>}
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

const ContactModal = ({ open, onClose, listing, mode, user, intent, onSubmit, onPromptIntent }) => {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => { if (open) { setSubmitted(false); setMessage(''); } }, [open]);
  if (!open || !listing) return null;

  if (!intent || intent !== 'serious') {
    return (
      <Modal onClose={onClose}>
        <div className="p-10 text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-2xl bg-[#FFD66B] rotate-6"/>
            <div className="absolute inset-0 rounded-2xl bg-[#1A1B3A] -rotate-6 flex items-center justify-center"><Sparkles size={24} className="text-[#FFD66B]"/></div>
          </div>
          <h2 className="font-display text-[32px] text-[#1A1B3A] leading-tight">A quick step before we connect you</h2>
          <p className="text-[14px] text-stone-600 mt-3 max-w-sm mx-auto leading-relaxed">
            We only share leads with dealers when buyers are <span className="font-medium text-[#1A1B3A]">ready to engage</span>. Update your status to continue.
          </p>
          {intent && <div className="mt-5 inline-block"><p className="text-[11px] text-stone-500 mb-1.5">Current status</p><IntentBadge intent={intent} onClick={() => {}} size="sm"/></div>}
          <button onClick={() => { onClose(); onPromptIntent(); }} className="mt-7 px-7 py-3.5 bg-[#1A1B3A] text-white rounded-xl text-[14px] font-medium block mx-auto">Update my status</button>
        </div>
      </Modal>
    );
  }

  const submit = () => { onSubmit({ listingId: listing.id, mode, message }); setSubmitted(true); };

  return (
    <Modal onClose={onClose}>
      <div className="p-10">
        {submitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-[#E8F3E8] flex items-center justify-center mx-auto mb-6"><Check size={26} className="text-[#2D5A2D]" strokeWidth={2.5}/></div>
            <h2 className="font-display text-[32px] text-[#1A1B3A]">You're on the list</h2>
            <p className="text-[14px] text-stone-600 mt-3 max-w-sm mx-auto leading-relaxed">A dealer from our bench will reach out within <span className="font-medium text-[#1A1B3A]">4 hours</span>.</p>
            <button onClick={onClose} className="mt-7 px-7 py-3 bg-[#1A1B3A] text-white rounded-xl text-[13px] font-medium">Done</button>
          </div>
        ) : (
          <>
            <span className="text-[11px] tracking-[0.2em] uppercase text-stone-500">{mode === 'visit' ? 'Schedule a visit' : 'Request a callback'}</span>
            <h2 className="font-display text-[32px] text-[#1A1B3A] mt-1 leading-tight">{listing.title}</h2>
            <p className="text-[13px] text-stone-500 mt-1">{listing.locality}, {listing.city}</p>
            <div className="mt-6 p-4 bg-[#FAF7F2] border border-stone-200 rounded-2xl space-y-2 text-[13px]">
              <div className="flex justify-between items-center"><span className="text-stone-500">Contact</span><span className="font-medium">{user?.phone}</span></div>
              <div className="flex justify-between items-center"><span className="text-stone-500">Status</span><IntentBadge intent="serious" onClick={() => {}} size="sm"/></div>
            </div>
            <label className="block mt-5 text-[12px] text-stone-600 mb-2">Anything specific? <span className="text-stone-400">(optional)</span></label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={mode === 'visit' ? 'When would you like to visit?' : 'A good time to call?'} rows={3} className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl outline-none text-[14px] focus:border-[#1A1B3A] resize-none transition"/>
            <button onClick={submit} className="w-full mt-5 py-4 bg-[#1A1B3A] text-white rounded-xl text-[14px] font-medium hover:bg-[#2A2B5A]">Send to our dealer</button>
            <p className="text-[11px] text-stone-500 text-center mt-3">You'll be contacted only about this home.</p>
          </>
        )}
      </div>
    </Modal>
  );
};

const Modal = ({ children, onClose, wide }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1B3A]/40 backdrop-blur-md" onClick={onClose}>
    <div className={`relative bg-white rounded-3xl shadow-2xl w-full ${wide ? 'max-w-lg' : 'max-w-md'} max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
      <button onClick={onClose} className="absolute top-5 right-5 w-9 h-9 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-500 z-10 transition"><X size={16}/></button>
      {children}
    </div>
  </div>
);

const Footer = () => (
  <footer className="mt-20" style={{ backgroundColor: '#1A1B3A', color: '#ffffff' }}>
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px' }}>
        <div>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-xl rotate-3" style={{ backgroundColor: '#ffffff' }}/>
              <div className="absolute inset-0 rounded-xl -rotate-3" style={{ backgroundColor: '#FFD66B', mixBlendMode: 'multiply' }}/>
            </div>
            <span className="font-display" style={{ fontSize: '26px', color: '#ffffff' }}>nest</span>
          </div>
          <p className="leading-relaxed" style={{ fontSize: '13px', color: '#A1A1AA', maxWidth: '280px' }}>A curated property platform for serious buyers and hand-picked dealers.</p>
        </div>
        {[
          { title: 'Cities', items: CITIES.slice(0, 5).map(c => c.name) },
          { title: 'Company', items: ['Our standards', 'Verification', 'Dealer bench', 'Press', 'Careers'] },
          { title: 'Legal', items: ['Privacy', 'Terms', 'Contact', 'For dealers'] },
        ].map(col => (
          <div key={col.title}>
            <p className="tracking-[0.2em] uppercase mb-4 font-medium" style={{ fontSize: '11px', color: '#FFD66B' }}>{col.title}</p>
            <ul style={{ fontSize: '13px', listStyle: 'none', padding: 0, margin: 0 }}>
              {col.items.map(i => (
                <li key={i} style={{ marginBottom: '10px' }}>
                  <a href="#" style={{ color: '#D1D1D6', textDecoration: 'none' }} onMouseOver={e => e.currentTarget.style.color='#ffffff'} onMouseOut={e => e.currentTarget.style.color='#D1D1D6'}>{i}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5 flex justify-between items-center" style={{ fontSize: '12px', color: '#A1A1AA' }}>
        <span>© 2026 nest homes pvt. ltd.</span>
        <span className="font-display italic">Bombay</span>
      </div>
    </div>
  </footer>
);

// ---------- Root App ----------
export default function App() {
  const [route, setRoute] = useState({ name: 'home' });
  const [user, setUser] = useState(null);
  const [intent, setIntent] = useState(null);
  const [shortlist, setShortlist] = useState([]);
  const [viewedIds, setViewedIds] = useState(new Set());
  const [city, setCity] = useState(CITIES[0]);
  const [authOpen, setAuthOpen] = useState(false);
  const [intentOpen, setIntentOpen] = useState(false);
  const [contactState, setContactState] = useState({ open: false, listing: null, mode: 'callback' });

  const navigate = (r) => {
    setRoute(r);
    if (r.name === 'listing') setViewedIds(prev => new Set(prev).add(r.id));
    window.scrollTo(0, 0);
  };

  const toggleShortlist = (id) => {
    if (!user) { setAuthOpen(true); return; }
    setShortlist(s => {
      const next = s.includes(id) ? s.filter(x => x !== id) : [...s, id];
      if (next.length === 3 && !intent) setTimeout(() => setIntentOpen(true), 400);
      return next;
    });
  };

  const handleSignIn = (u) => {
    setUser(u);
    setAuthOpen(false);
    if (!intent) setTimeout(() => setIntentOpen(true), 300);
  };

  const handleContactDealer = (listing, mode = 'callback') => {
    if (!user) { setAuthOpen(true); return; }
    setContactState({ open: true, listing, mode });
  };

  const handleLeadSubmit = (lead) => { console.log('Lead submitted:', { ...lead, intent, viewedCount: viewedIds.size, city: city.name }); };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1B3A]" style={{ fontFamily: '"Geist", system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Geist:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', Georgia, serif; font-feature-settings: 'ss01', 'ss02'; letter-spacing: -0.02em; }
        body { font-family: 'Geist', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
        /* Detail page: sticky sidebar on wider screens */
        .detail-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 48px; }
        @media (min-width: 1024px) {
          .detail-grid { grid-template-columns: minmax(0, 1fr) 420px; }
        }
        /* Map view: side-by-side on wider screens */
        .map-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; }
        @media (min-width: 1024px) {
          .map-grid { grid-template-columns: minmax(0, 1fr) 440px; }
        }
      `}</style>

      <TopNav navigate={navigate} shortlistCount={shortlist.length} user={user} onOpenAuth={() => setAuthOpen(true)} intent={intent} onOpenIntent={() => setIntentOpen(true)} city={city} onChangeCity={setCity}/>

      {route.name === 'home' && <HomePage navigate={navigate} listings={MOCK_LISTINGS} toggleShortlist={toggleShortlist} shortlist={shortlist} intent={intent} onOpenIntent={() => setIntentOpen(true)} user={user} city={city} onChangeCity={setCity}/>}
      {route.name === 'search' && <SearchPage navigate={navigate} route={route} listings={MOCK_LISTINGS} toggleShortlist={toggleShortlist} shortlist={shortlist} intent={intent} onOpenIntent={() => setIntentOpen(true)} user={user} city={city} onChangeCity={setCity}/>}
      {route.name === 'listing' && <ListingDetailPage navigate={navigate} route={route} listings={MOCK_LISTINGS} toggleShortlist={toggleShortlist} shortlist={shortlist} user={user} onContactDealer={handleContactDealer} intent={intent} onOpenIntent={() => setIntentOpen(true)}/>}
      {route.name === 'shortlist' && <ShortlistPage navigate={navigate} listings={MOCK_LISTINGS} toggleShortlist={toggleShortlist} shortlist={shortlist} intent={intent} onOpenIntent={() => setIntentOpen(true)} user={user}/>}
      {route.name === 'profile' && <ProfilePage user={user} intent={intent} navigate={navigate} onChangeIntent={() => setIntentOpen(true)} onSignOut={() => { setUser(null); setIntent(null); navigate({ name: 'home' }); }} viewedCount={viewedIds.size} shortlist={shortlist}/>}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSignIn={handleSignIn}/>
      <IntentModal open={intentOpen} onClose={() => setIntentOpen(false)} onSelect={setIntent} currentIntent={intent}/>
      <ContactModal open={contactState.open} onClose={() => setContactState({ ...contactState, open: false })} listing={contactState.listing} mode={contactState.mode} user={user} intent={intent} onSubmit={handleLeadSubmit} onPromptIntent={() => setIntentOpen(true)}/>
    </div>
  );
}
