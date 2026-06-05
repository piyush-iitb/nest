import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MapPin, Bed, Bath, Maximize2, Heart, ArrowRight, ArrowLeft, X, Search, SlidersHorizontal, Check, Phone, Calendar, Sparkles, ChevronDown, User, BookmarkCheck, Eye, ShieldCheck, Coffee, Sprout, Key, Plus, Star, ArrowUpRight, Home as HomeIcon, Building2, Menu, Share2, Loader2, Trees, Train, GraduationCap, ShoppingBag, Stethoscope, RotateCcw, BookmarkPlus } from 'lucide-react';

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

// ---------- Additional illustrations: interior variants for galleries ----------
const INTERIOR_ILLUSTRATIONS = {
  livingRoom: ({ bg = '#E8DCC8', primary = '#1A1B3A', accent = '#FFD66B' }) => (
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <rect width="800" height="600" fill={bg}/>
      {/* Floor */}
      <rect y="430" width="800" height="170" fill={primary} opacity="0.1"/>
      <line x1="0" y1="430" x2="800" y2="430" stroke={primary} strokeOpacity="0.2" strokeWidth="2"/>
      {/* Floor planks */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1={i * 100} y1="430" x2={i * 100 - 60} y2="600" stroke={primary} strokeOpacity="0.08" strokeWidth="1"/>
      ))}
      {/* Back wall art */}
      <rect x="280" y="120" width="240" height="160" fill="#fff" opacity="0.9"/>
      <rect x="280" y="120" width="240" height="160" fill="none" stroke={primary} strokeOpacity="0.2" strokeWidth="2"/>
      <circle cx="400" cy="170" r="25" fill={accent} opacity="0.7"/>
      <path d="M310,250 L370,200 L430,230 L490,180 L490,260 L310,260 Z" fill={primary} opacity="0.3"/>
      {/* Sofa */}
      <rect x="140" y="340" width="320" height="100" fill={primary} opacity="0.85" rx="8"/>
      <rect x="140" y="320" width="320" height="40" fill={primary} opacity="0.95" rx="8"/>
      {/* Sofa cushions */}
      <rect x="170" y="335" width="80" height="40" fill="#fff" opacity="0.2" rx="6"/>
      <rect x="260" y="335" width="80" height="40" fill="#fff" opacity="0.2" rx="6"/>
      <rect x="350" y="335" width="80" height="40" fill="#fff" opacity="0.2" rx="6"/>
      {/* Coffee table */}
      <ellipse cx="290" cy="475" rx="120" ry="20" fill={primary} opacity="0.5"/>
      <rect x="170" y="465" width="240" height="6" fill={primary} opacity="0.7"/>
      {/* Side chair */}
      <rect x="540" y="350" width="100" height="90" fill={accent} opacity="0.6" rx="6"/>
      <rect x="540" y="320" width="100" height="40" fill={accent} opacity="0.8" rx="6"/>
      {/* Floor lamp */}
      <line x1="690" y1="200" x2="690" y2="440" stroke={primary} strokeOpacity="0.6" strokeWidth="3"/>
      <ellipse cx="690" cy="190" rx="35" ry="15" fill={accent} opacity="0.7"/>
      {/* Plant */}
      <rect x="60" y="380" width="50" height="60" fill={primary} opacity="0.6" rx="4"/>
      <ellipse cx="85" cy="350" rx="40" ry="50" fill="#5C9658" opacity="0.7"/>
      <ellipse cx="60" cy="330" rx="20" ry="30" fill="#5C9658" opacity="0.6"/>
      <ellipse cx="105" cy="335" rx="25" ry="35" fill="#5C9658" opacity="0.65"/>
    </svg>
  ),
  kitchen: ({ bg = '#E8DCC8', primary = '#1A1B3A', accent = '#FFD66B' }) => (
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <rect width="800" height="600" fill={bg}/>
      {/* Back wall */}
      <rect width="800" height="420" fill={bg}/>
      {/* Window */}
      <rect x="540" y="80" width="180" height="160" fill="#A8C5D0" opacity="0.4"/>
      <rect x="540" y="80" width="180" height="160" fill="none" stroke={primary} strokeOpacity="0.3" strokeWidth="3"/>
      <line x1="630" y1="80" x2="630" y2="240" stroke={primary} strokeOpacity="0.3" strokeWidth="2"/>
      <line x1="540" y1="160" x2="720" y2="160" stroke={primary} strokeOpacity="0.3" strokeWidth="2"/>
      {/* Upper cabinets */}
      <rect x="60" y="80" width="420" height="140" fill={primary} opacity="0.85"/>
      <line x1="200" y1="80" x2="200" y2="220" stroke="#fff" strokeOpacity="0.3" strokeWidth="2"/>
      <line x1="340" y1="80" x2="340" y2="220" stroke="#fff" strokeOpacity="0.3" strokeWidth="2"/>
      {/* Cabinet handles */}
      <circle cx="180" cy="150" r="3" fill={accent}/>
      <circle cx="220" cy="150" r="3" fill={accent}/>
      <circle cx="320" cy="150" r="3" fill={accent}/>
      <circle cx="360" cy="150" r="3" fill={accent}/>
      <circle cx="460" cy="150" r="3" fill={accent}/>
      {/* Counter */}
      <rect x="60" y="340" width="660" height="20" fill="#D8D0BE"/>
      {/* Lower cabinets */}
      <rect x="60" y="360" width="660" height="160" fill={primary} opacity="0.7"/>
      <line x1="200" y1="360" x2="200" y2="520" stroke="#fff" strokeOpacity="0.2" strokeWidth="2"/>
      <line x1="380" y1="360" x2="380" y2="520" stroke="#fff" strokeOpacity="0.2" strokeWidth="2"/>
      <line x1="540" y1="360" x2="540" y2="520" stroke="#fff" strokeOpacity="0.2" strokeWidth="2"/>
      {/* Sink */}
      <rect x="240" y="305" width="140" height="40" fill="#A8B0B8" opacity="0.6" rx="4"/>
      <circle cx="310" cy="295" r="6" fill={primary} opacity="0.6"/>
      {/* Pendant lights */}
      <line x1="200" y1="0" x2="200" y2="40" stroke={primary} strokeOpacity="0.5" strokeWidth="2"/>
      <line x1="320" y1="0" x2="320" y2="60" stroke={primary} strokeOpacity="0.5" strokeWidth="2"/>
      <line x1="440" y1="0" x2="440" y2="40" stroke={primary} strokeOpacity="0.5" strokeWidth="2"/>
      <path d="M180,40 Q200,55 220,40 L220,60 L180,60 Z" fill={accent} opacity="0.8"/>
      <path d="M300,60 Q320,75 340,60 L340,80 L300,80 Z" fill={accent} opacity="0.8"/>
      <path d="M420,40 Q440,55 460,40 L460,60 L420,60 Z" fill={accent} opacity="0.8"/>
      {/* Floor */}
      <rect y="520" width="800" height="80" fill={primary} opacity="0.15"/>
    </svg>
  ),
  bedroom: ({ bg = '#E8DCC8', primary = '#1A1B3A', accent = '#FFD66B' }) => (
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <rect width="800" height="600" fill={bg}/>
      {/* Wall */}
      <rect width="800" height="420" fill={bg}/>
      {/* Floor */}
      <rect y="420" width="800" height="180" fill={primary} opacity="0.12"/>
      {/* Headboard */}
      <rect x="200" y="180" width="400" height="200" fill={primary} opacity="0.85" rx="12"/>
      {/* Pendant pillows on headboard */}
      <circle cx="290" cy="280" r="3" fill={accent} opacity="0.6"/>
      <circle cx="510" cy="280" r="3" fill={accent} opacity="0.6"/>
      {/* Mattress */}
      <rect x="160" y="370" width="480" height="80" fill="#fff" rx="8"/>
      <rect x="160" y="370" width="480" height="80" fill="none" stroke={primary} strokeOpacity="0.2" strokeWidth="2" rx="8"/>
      {/* Pillows */}
      <rect x="200" y="345" width="160" height="60" fill="#fff" rx="6"/>
      <rect x="200" y="345" width="160" height="60" fill="none" stroke={primary} strokeOpacity="0.2" strokeWidth="2" rx="6"/>
      <rect x="440" y="345" width="160" height="60" fill="#fff" rx="6"/>
      <rect x="440" y="345" width="160" height="60" fill="none" stroke={primary} strokeOpacity="0.2" strokeWidth="2" rx="6"/>
      {/* Blanket fold */}
      <path d="M160,440 L640,440 L640,450 L160,450 Z" fill={accent} opacity="0.5"/>
      {/* Nightstands */}
      <rect x="80" y="400" width="60" height="80" fill={primary} opacity="0.6" rx="4"/>
      <rect x="660" y="400" width="60" height="80" fill={primary} opacity="0.6" rx="4"/>
      {/* Lamps */}
      <rect x="100" y="370" width="20" height="30" fill={accent} opacity="0.7"/>
      <path d="M90,370 L130,370 L125,355 L95,355 Z" fill={accent} opacity="0.8"/>
      <rect x="680" y="370" width="20" height="30" fill={accent} opacity="0.7"/>
      <path d="M670,370 L710,370 L705,355 L675,355 Z" fill={accent} opacity="0.8"/>
      {/* Art above bed */}
      <rect x="350" y="100" width="100" height="60" fill="#fff"/>
      <rect x="350" y="100" width="100" height="60" fill="none" stroke={primary} strokeOpacity="0.3" strokeWidth="1.5"/>
      <circle cx="400" cy="130" r="14" fill={accent} opacity="0.6"/>
    </svg>
  ),
  view: ({ bg = '#E8DCC8', primary = '#1A1B3A', accent = '#FFD66B' }) => (
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <defs>
        <linearGradient id="vw-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5D5B0"/>
          <stop offset="60%" stopColor={bg}/>
          <stop offset="100%" stopColor={bg} stopOpacity="0.7"/>
        </linearGradient>
        <linearGradient id="vw-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A8C5D0"/>
          <stop offset="100%" stopColor="#7BA0B0"/>
        </linearGradient>
      </defs>
      {/* Window frame */}
      <rect width="800" height="600" fill={primary}/>
      {/* Window opening */}
      <rect x="40" y="40" width="720" height="520" fill="url(#vw-sky)"/>
      {/* Sun */}
      <circle cx="600" cy="180" r="60" fill={accent} opacity="0.85"/>
      <circle cx="600" cy="180" r="90" fill={accent} opacity="0.2"/>
      {/* Distant city skyline */}
      <rect x="40" y="350" width="60" height="60" fill={primary} opacity="0.3"/>
      <rect x="100" y="330" width="40" height="80" fill={primary} opacity="0.35"/>
      <rect x="140" y="360" width="50" height="50" fill={primary} opacity="0.3"/>
      <rect x="190" y="320" width="70" height="90" fill={primary} opacity="0.4"/>
      <rect x="260" y="340" width="40" height="70" fill={primary} opacity="0.3"/>
      <rect x="300" y="310" width="60" height="100" fill={primary} opacity="0.45"/>
      <rect x="500" y="340" width="50" height="70" fill={primary} opacity="0.3"/>
      <rect x="550" y="320" width="60" height="90" fill={primary} opacity="0.4"/>
      <rect x="610" y="350" width="40" height="60" fill={primary} opacity="0.3"/>
      <rect x="660" y="330" width="80" height="80" fill={primary} opacity="0.4"/>
      {/* Sea */}
      <rect x="40" y="410" width="720" height="150" fill="url(#vw-sea)"/>
      {/* Wave lines */}
      <path d="M40,440 Q200,430 400,440 T760,440" stroke="#fff" strokeOpacity="0.4" fill="none" strokeWidth="2"/>
      <path d="M40,470 Q200,460 400,470 T760,470" stroke="#fff" strokeOpacity="0.3" fill="none" strokeWidth="2"/>
      <path d="M40,500 Q200,490 400,500 T760,500" stroke="#fff" strokeOpacity="0.25" fill="none" strokeWidth="2"/>
      {/* Window mullion (cross) */}
      <rect x="395" y="40" width="10" height="520" fill={primary}/>
      <rect x="40" y="295" width="720" height="10" fill={primary}/>
      {/* Inside window sill */}
      <rect y="560" width="800" height="40" fill={primary} opacity="0.95"/>
    </svg>
  ),
};

// ---------- Get a gallery for a listing (returns array of named views) ----------
const getListingGallery = (listing) => {
  // Combine exterior + interior variations. Returns an array of {name, render} for the gallery.
  const exterior = BUILDING_ILLUSTRATIONS[listing.illustration] || BUILDING_ILLUSTRATIONS.skyline;
  return [
    { name: 'Exterior',     render: (props) => exterior(props) },
    { name: 'Living room',  render: INTERIOR_ILLUSTRATIONS.livingRoom },
    { name: 'Kitchen',      render: INTERIOR_ILLUSTRATIONS.kitchen },
    { name: 'Bedroom',      render: INTERIOR_ILLUSTRATIONS.bedroom },
    { name: 'View',         render: INTERIOR_ILLUSTRATIONS.view },
  ];
};

// ---------- ListingImage: renders the embedded SVG illustration ----------
const ListingImage = ({ listing, className = '', imgIndex = 0 }) => {
  const gallery = getListingGallery(listing);
  const item = gallery[imgIndex] || gallery[0];
  return (
    <div className={`${className} relative overflow-hidden`} style={{ backgroundColor: listing.color }}>
      {item.render({ bg: listing.color })}
    </div>
  );
};

// ---------- Skeleton loaders ----------
const Shimmer = ({ className = '', style = {} }) => (
  <div className={className} style={{
    backgroundColor: '#EBE5D5',
    backgroundImage: 'linear-gradient(90deg, #EBE5D5 0%, #F4EFE3 50%, #EBE5D5 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.6s infinite',
    ...style,
  }}/>
);

const ListingCardSkeleton = () => (
  <div>
    <Shimmer className="rounded-2xl" style={{ aspectRatio: '4 / 3', width: '100%' }}/>
    <div className="mt-4 px-1 space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <Shimmer style={{ height: '22px', width: '60%', borderRadius: '4px' }}/>
        <Shimmer style={{ height: '22px', width: '25%', borderRadius: '4px' }}/>
      </div>
      <div className="flex items-center justify-between">
        <Shimmer style={{ height: '13px', width: '40%', borderRadius: '4px' }}/>
        <Shimmer style={{ height: '13px', width: '35%', borderRadius: '4px' }}/>
      </div>
    </div>
  </div>
);

const ListingDetailSkeleton = () => (
  <div className="bg-[#FAF7F2] min-h-screen">
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-8">
      <Shimmer style={{ height: '14px', width: '120px', borderRadius: '4px', marginBottom: '20px' }}/>
      <Shimmer className="rounded-3xl" style={{ height: '480px', width: '100%' }}/>
    </div>
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12 detail-grid">
      <div>
        <div className="flex gap-2 mb-4">
          <Shimmer style={{ height: '24px', width: '80px', borderRadius: '999px' }}/>
          <Shimmer style={{ height: '24px', width: '100px', borderRadius: '999px' }}/>
        </div>
        <Shimmer style={{ height: '18px', width: '180px', borderRadius: '4px', marginBottom: '12px' }}/>
        <Shimmer style={{ height: '56px', width: '70%', borderRadius: '6px' }}/>
        <div className="mt-10" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
          {[1,2,3,4].map(i => <Shimmer key={i} className="rounded-2xl" style={{ height: '100px' }}/>)}
        </div>
        <Shimmer style={{ height: '32px', width: '40%', borderRadius: '4px', marginTop: '48px' }}/>
        <Shimmer style={{ height: '100px', width: '100%', borderRadius: '4px', marginTop: '16px' }}/>
      </div>
      <aside>
        <Shimmer className="rounded-3xl" style={{ height: '380px' }}/>
      </aside>
    </div>
  </div>
);

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
const TopNav = ({ navigate, shortlistCount, user, onOpenAuth, intent, onOpenIntent, city, onChangeCity }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
  <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-stone-200/60" style={{ backgroundColor: 'rgba(250, 247, 242, 0.88)' }}>
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-3" style={{ height: '88px' }}>
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={() => navigate({ name: 'home' })} className="flex items-center gap-3 group flex-shrink-0">
          <div className="relative" style={{ width: '42px', height: '42px' }}>
            <div className="absolute inset-0 rounded-xl rotate-3 group-hover:rotate-6 transition-transform" style={{ backgroundColor: '#1A1B3A' }}/>
            <div className="absolute inset-0 rounded-xl -rotate-3 group-hover:-rotate-6 transition-transform" style={{ backgroundColor: '#FFD66B', mixBlendMode: 'multiply' }}/>
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="font-display tracking-tight" style={{ fontSize: '28px', color: '#1A1B3A' }}>nest</span>
            <span className="tracking-[0.25em] uppercase text-stone-500 show-sm-up" style={{ fontSize: '10px', marginTop: '2px' }}>By invitation</span>
          </div>
        </button>
        <div className="show-md-up h-9 w-px bg-stone-200" style={{ marginLeft: '12px' }}/>
        <div className="show-md-up" style={{ marginLeft: '12px' }}>
          <CitySelector city={city} onChange={onChangeCity} compact/>
        </div>
      </div>

      <nav className="hide-mobile items-center gap-8 text-stone-700" style={{ fontSize: '15px' }}>
        <button onClick={() => navigate({ name: 'search' })} className="hover:text-[#1A1B3A] transition" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit' }}>Browse</button>
        <button onClick={() => navigate({ name: 'shortlist' })} className="hover:text-[#1A1B3A] transition flex items-center gap-1.5" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit' }}>
          Shortlist
          {shortlistCount > 0 && <span className="rounded-full px-1.5 min-w-[18px] text-center font-medium" style={{ fontSize: '10px', backgroundColor: '#1A1B3A', color: '#ffffff' }}>{shortlistCount}</span>}
        </button>
        <button onClick={() => navigate({ name: 'about' })} className="hover:text-[#1A1B3A] transition" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit' }}>How it works</button>
        <button className="hover:text-[#1A1B3A] transition" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit' }}>Dealers</button>
      </nav>

      <div className="flex items-center gap-2 flex-shrink-0">
        {user && <div className="show-sm-up"><IntentBadge intent={intent} onClick={onOpenIntent} size="sm"/></div>}
        {user ? (
          <button onClick={() => navigate({ name: 'profile' })} className="flex items-center gap-2 pl-1 py-1 rounded-full border border-stone-200 hover:border-[#1A1B3A] transition bg-white" style={{ paddingRight: '12px' }}>
            <div className="rounded-full flex items-center justify-center font-medium" style={{ width: '32px', height: '32px', backgroundColor: '#1A1B3A', color: '#ffffff', fontSize: '12px' }}>{user.name[0].toUpperCase()}</div>
            <span className="text-stone-800 show-md-up" style={{ fontSize: '14px' }}>{user.name.split(' ')[0]}</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="font-medium transition"
            style={{
              fontSize: '13px',
              padding: '10px 18px',
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
            <span className="show-sm-up">Sign in <span style={{ opacity: 0.5, margin: '0 4px' }}>/</span> </span>Join now
          </button>
        )}
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="show-mobile items-center justify-center"
          style={{
            width: '40px', height: '40px',
            borderRadius: '999px',
            border: '1px solid #E7E5E4',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            padding: 0,
          }}
          aria-label="Toggle menu">
          {mobileOpen ? <X size={18}/> : <Menu size={18}/>}
        </button>
      </div>
    </div>

    {/* Mobile menu drawer */}
    {mobileOpen && (
      <div className="show-mobile border-t border-stone-200" style={{ backgroundColor: '#FAF7F2', flexDirection: 'column' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6" style={{ padding: '20px 16px', width: '100%' }}>
          {/* City picker — always shown in drawer for quick mobile access */}
          <div className="hide-md-up" style={{ paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid #E7E5E4' }}>
            <p className="tracking-[0.15em] uppercase text-stone-500" style={{ fontSize: '11px', marginBottom: '8px' }}>City</p>
            <CitySelector city={city} onChange={(c) => { onChangeCity(c); }} compact/>
          </div>
          {/* Intent (only on really small screens where the nav-bar pill is hidden) */}
          {user && (
            <div style={{ paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid #E7E5E4' }}>
              <p className="tracking-[0.15em] uppercase text-stone-500" style={{ fontSize: '11px', marginBottom: '8px' }}>Your status</p>
              <IntentBadge intent={intent} onClick={() => { onOpenIntent(); setMobileOpen(false); }} size="sm"/>
            </div>
          )}
          {[
            { label: 'Browse homes', route: { name: 'search' } },
            { label: `Shortlist${shortlistCount ? ` (${shortlistCount})` : ''}`, route: { name: 'shortlist' } },
            { label: 'How it works', route: { name: 'about' } },
            { label: 'Dealers', route: null },
          ].map(item => (
            <button key={item.label}
              onClick={() => { if (item.route) navigate(item.route); setMobileOpen(false); }}
              className="hover:bg-white transition flex items-center justify-between"
              style={{ fontSize: '15px', color: '#1A1B3A', width: '100%', textAlign: 'left', padding: '14px 12px', borderRadius: '12px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
              {item.label}
              <ArrowRight size={14} className="text-stone-400"/>
            </button>
          ))}
        </div>
      </div>
    )}
  </header>
  );
};

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

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 pt-16 sm:pt-24 pb-12 sm:pb-20 text-center">
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

      {/* Featured listings — clean uniform grid */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20">
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
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'start' }}>
            <div>
              <p className="tracking-[0.2em] uppercase font-medium" style={{ fontSize: '11px', color: '#FFD66B' }}>Why nest</p>
              <h2 className="font-display leading-[0.95] mt-3" style={{ fontSize: 'clamp(40px, 5.5vw, 68px)', color: '#ffffff' }}>
                No fake leads.<br/>
                No bait listings.<br/>
                <em className="italic" style={{ color: '#FFD66B' }}>No noise.</em>
              </h2>
              <p className="mt-7 leading-relaxed" style={{ fontSize: '16px', color: '#D1D1D6', maxWidth: '520px' }}>
                Every home is verified by our team. You tell us if you're just browsing or ready to buy — and dealers only hear from you when you say so.
              </p>
              <button onClick={() => navigate({ name: 'about' })} className="mt-6 inline-flex items-center gap-2 group transition" style={{ color: '#FFD66B', fontSize: '14px', fontWeight: 500 }}>
                <span style={{ borderBottom: '1px solid rgba(255, 214, 107, 0.4)', paddingBottom: '2px' }}>See how it works</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
              </button>
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
const SearchPage = ({ navigate, route, listings, toggleShortlist, shortlist, intent, onOpenIntent, user, city, onChangeCity, recentSearches, addRecentSearch, savedSearches, toggleSavedSearch }) => {
  const [query, setQuery] = useState(route.query || '');
  const [filters, setFilters] = useState({ bhk: [], type: [], priceMax: null, possession: null });
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Brief loading flash to demo skeletons
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [route.query, city.name]);

  // Save to recent searches when query changes (debounced via effect)
  useEffect(() => {
    if (query && query.length > 2) {
      const t = setTimeout(() => addRecentSearch({ query, city: city.name }), 800);
      return () => clearTimeout(t);
    }
  }, [query, city.name]);

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
    else if (sort === 'area-desc') r.sort((a,b) => b.area - a.area);
    else if (sort === 'newest') r.sort((a,b) => (a.possession === 'Ready to move' ? -1 : 1) - (b.possession === 'Ready to move' ? -1 : 1));
    return r;
  }, [listings, query, filters, sort]);

  const toggleArr = (key, val) => setFilters(f => ({ ...f, [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val] }));
  const activeCount = filters.bhk.length + filters.type.length + (filters.priceMax ? 1 : 0) + (filters.possession ? 1 : 0);
  const clearAllFilters = () => setFilters({ bhk: [], type: [], priceMax: null, possession: null });

  // Save-search ID: city+query+filters serialised
  const currentSearchId = `${city.name}|${query}|${JSON.stringify(filters)}`;
  const isSaved = savedSearches.some(s => s.id === currentSearchId);
  const handleSaveSearch = () => {
    if (!user) { return; }
    toggleSavedSearch({ id: currentSearchId, city: city.name, query, filters, savedAt: Date.now() });
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="sticky z-30 backdrop-blur-xl border-b border-stone-200/60" style={{ top: '88px', backgroundColor: 'rgba(250, 247, 242, 0.9)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-5">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <CitySelector city={city} onChange={onChangeCity}/>
            <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-full px-5 py-3 flex-1 min-w-[180px] max-w-sm shadow-sm">
              <Search size={16} className="text-stone-400"/>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder={`Locality in ${city.name}…`} className="bg-transparent outline-none text-[14px] flex-1 min-w-0"/>
              {query && <button onClick={() => setQuery('')} className="text-stone-400 hover:text-[#1A1B3A]"><X size={14}/></button>}
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 rounded-full text-[13px] font-medium transition border"
              style={(showFilters || activeCount > 0) ? { backgroundColor: '#1A1B3A', color: '#ffffff', borderColor: '#1A1B3A' } : { backgroundColor: '#ffffff', borderColor: '#E7E5E4' }}>
              <SlidersHorizontal size={14}/> Filters
              {activeCount > 0 && <span className="rounded-full px-1.5 min-w-[18px] text-center" style={{ fontSize: '10px', backgroundColor: '#FFD66B', color: '#1A1B3A' }}>{activeCount}</span>}
            </button>
            <select value={sort} onChange={e => setSort(e.target.value)} className="px-5 py-3 bg-white border border-stone-200 rounded-full text-[13px] outline-none cursor-pointer hover:border-[#1A1B3A]">
              <option value="relevance">Relevance</option>
              <option value="newest">Ready first</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="area-desc">Area ↓</option>
            </select>
            {user && (
              <button onClick={handleSaveSearch}
                className="flex items-center gap-2 px-4 py-3 rounded-full text-[13px] font-medium transition border"
                style={isSaved ? { backgroundColor: '#FFD66B', color: '#5A3D00', borderColor: '#FFD66B' } : { backgroundColor: '#ffffff', borderColor: '#E7E5E4' }}>
                <BookmarkPlus size={14}/>
                <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save search'}</span>
              </button>
            )}
            <div className="ml-auto flex bg-white border border-stone-200 rounded-full p-1">
              <button onClick={() => setView('grid')} className="px-4 py-2 text-[12px] rounded-full font-medium transition"
                style={view === 'grid' ? { backgroundColor: '#1A1B3A', color: '#ffffff' } : { color: '#52525B' }}>Grid</button>
              <button onClick={() => setView('map')} className="px-4 py-2 text-[12px] rounded-full font-medium transition"
                style={view === 'map' ? { backgroundColor: '#1A1B3A', color: '#ffffff' } : { color: '#52525B' }}>Map</button>
            </div>
          </div>

          {/* Recent searches chip row (when filters closed and we have history) */}
          {!showFilters && recentSearches.length > 0 && (
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
              <span className="text-[11px] tracking-[0.15em] uppercase text-stone-500 flex-shrink-0">Recent:</span>
              {recentSearches.slice(0, 5).map((r, i) => (
                <button key={i} onClick={() => setQuery(r.query)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 hover:border-[#1A1B3A] rounded-full text-[12px] text-stone-700 hover:text-[#1A1B3A] transition">
                  <RotateCcw size={11} className="text-stone-400"/>
                  {r.query} <span className="text-stone-400">· {r.city}</span>
                </button>
              ))}
            </div>
          )}

          {showFilters && (
            <div className="mt-5 pt-5 border-t border-stone-200 text-[13px]">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] tracking-[0.2em] uppercase text-stone-500 font-medium">Refine your search</p>
                {activeCount > 0 && (
                  <button onClick={clearAllFilters} className="text-[12px] text-stone-600 hover:text-[#1A1B3A] underline underline-offset-4 flex items-center gap-1.5">
                    <RotateCcw size={11}/> Clear all ({activeCount})
                  </button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
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
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
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
          loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', columnGap: '24px', rowGap: '40px' }}>
              {Array.from({ length: 6 }).map((_, i) => <ListingCardSkeleton key={i}/>)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState query={query} city={city} onClear={() => { setQuery(''); clearAllFilters(); }} onChangeCity={onChangeCity}/>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', columnGap: '24px', rowGap: '40px' }}>
              {filtered.map(l => <ListingCard key={l.id} listing={l} navigate={navigate} toggleShortlist={toggleShortlist} shortlisted={shortlist.includes(l.id)}/>)}
            </div>
          )
        ) : <MapView listings={filtered} navigate={navigate}/>}
      </div>
    </div>
  );
};

const EmptyState = ({ query, city, onClear, onChangeCity }) => (
  <div className="text-center py-20 bg-white border border-dashed border-stone-300 rounded-3xl px-6">
    <div className="font-display italic text-[44px] text-stone-300">Nothing here yet</div>
    <p className="mt-3 text-stone-500 text-[14px] max-w-md mx-auto">
      {query
        ? <>We couldn't find homes matching <em className="italic">"{query}"</em> in {city?.name} with these filters.</>
        : <>No homes match these filters in {city?.name}.</>
      }
    </p>
    <div className="mt-6 flex flex-wrap gap-2 justify-center">
      <button onClick={onClear}
        className="font-medium" style={{ fontSize: '13px', padding: '10px 18px', backgroundColor: '#1A1B3A', color: '#ffffff', borderRadius: '999px', border: 'none', cursor: 'pointer' }}>
        Clear filters
      </button>
      {city && CITIES.filter(c => c.name !== city.name).slice(0, 3).map(c => (
        <button key={c.name} onClick={() => onChangeCity(c)}
          className="font-medium" style={{ fontSize: '13px', padding: '10px 18px', backgroundColor: '#ffffff', color: '#1A1B3A', borderRadius: '999px', border: '1px solid #E7E5E4', cursor: 'pointer' }}>
          Try {c.name}
        </button>
      ))}
    </div>
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
  const [imgIdx, setImgIdx] = useState(0);
  const [showShare, setShowShare] = useState(false);

  // Keyboard nav for gallery
  useEffect(() => {
    if (!listing) return;
    const gallery = getListingGallery(listing);
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setImgIdx(i => (i + 1) % gallery.length);
      else if (e.key === 'ArrowLeft') setImgIdx(i => (i - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [listing?.id]);

  // Reset gallery index when listing changes
  useEffect(() => { setImgIdx(0); }, [listing?.id]);

  if (!listing) return <NotFoundPage navigate={navigate}/>;
  const shortlisted = shortlist.includes(listing.id);
  const gallery = getListingGallery(listing);
  const currentView = gallery[imgIdx];

  // Similar listings (same city, different listing, max 3)
  const similar = listings.filter(l => l.id !== listing.id && l.city === listing.city).slice(0, 3);

  // Mock nearby amenities (would come from backend in production)
  const nearby = [
    { type: 'Schools',    icon: GraduationCap, items: ['Bombay Scottish · 0.4 km', 'Dhirubhai Ambani School · 1.2 km'] },
    { type: 'Transport',  icon: Train,          items: ['Bandra Station · 0.8 km', 'Bandra Worli Sea Link · 0.3 km'] },
    { type: 'Hospitals',  icon: Stethoscope,    items: ['Lilavati Hospital · 0.6 km', 'Holy Family · 1.1 km'] },
    { type: 'Shopping',   icon: ShoppingBag,    items: ['Linking Road · 0.2 km', 'Palladium Mall · 4.5 km'] },
  ];

  return (
    <div className="bg-[#FAF7F2]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-8">
        <button onClick={() => navigate({ name: 'search' })} className="flex items-center gap-2 text-[13px] text-stone-600 hover:text-[#1A1B3A] mb-5">
          <ArrowLeft size={14}/> Back to search
        </button>

        {/* Gallery: main image + thumbnail strip */}
        <div className="rounded-3xl overflow-hidden relative group" style={{ height: 'clamp(320px, 50vh, 540px)' }}>
          <ListingImage listing={listing} imgIndex={imgIdx} className="w-full h-full"/>

          {/* Top-left tags */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {listing.featured && <Tag tone="featured"><Star size={10} fill="currentColor"/> Editor's pick</Tag>}
            {listing.verified && <Tag tone="verified"><Check size={10}/> Verified by nest</Tag>}
          </div>

          {/* Top-right actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={() => setShowShare(true)}
              className="w-11 h-11 rounded-full flex items-center justify-center backdrop-blur transition bg-white/80 text-stone-700 hover:bg-white">
              <Share2 size={16}/>
            </button>
            <button onClick={() => toggleShortlist(listing.id)}
              className="w-11 h-11 rounded-full flex items-center justify-center backdrop-blur transition"
              style={shortlisted ? { backgroundColor: '#FFD66B', color: '#1A1B3A' } : { backgroundColor: 'rgba(255,255,255,0.8)', color: '#3F3F46' }}>
              <Heart size={17} fill={shortlisted ? 'currentColor' : 'none'}/>
            </button>
          </div>

          {/* Prev/next */}
          {gallery.length > 1 && (
            <>
              <button onClick={() => setImgIdx((imgIdx - 1 + gallery.length) % gallery.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur transition opacity-0 group-hover:opacity-100"
                style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                <ArrowLeft size={18}/>
              </button>
              <button onClick={() => setImgIdx((imgIdx + 1) % gallery.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur transition opacity-0 group-hover:opacity-100"
                style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                <ArrowRight size={18}/>
              </button>
            </>
          )}

          {/* Bottom: image counter + view name */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur" style={{ backgroundColor: 'rgba(26, 27, 58, 0.8)', color: '#ffffff' }}>
            <span className="text-[12px] font-medium">{currentView.name}</span>
            <span className="text-[11px] opacity-60">·</span>
            <span className="text-[12px] opacity-80">{imgIdx + 1} of {gallery.length}</span>
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
          {gallery.map((view, i) => (
            <button key={view.name} onClick={() => setImgIdx(i)}
              className="flex-shrink-0 rounded-xl overflow-hidden relative transition"
              style={{
                width: '110px', height: '78px',
                border: i === imgIdx ? '3px solid #1A1B3A' : '3px solid transparent',
                opacity: i === imgIdx ? 1 : 0.7,
              }}>
              <ListingImage listing={listing} imgIndex={i} className="w-full h-full"/>
              <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                <span style={{ fontSize: '9px', color: '#ffffff', fontWeight: 500 }}>{view.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Share modal */}
      {showShare && (
        <Modal onClose={() => setShowShare(false)}>
          <div className="p-8">
            <span className="text-[11px] tracking-[0.2em] uppercase text-stone-500">Share</span>
            <h2 className="font-display text-[28px] text-[#1A1B3A] mt-1 leading-tight">{listing.title}</h2>
            <p className="text-[13px] text-stone-500 mt-1">{listing.locality}, {listing.city}</p>
            <div className="mt-6 flex items-center gap-2 p-3 bg-stone-50 border border-stone-200 rounded-xl">
              <span className="text-[12px] text-stone-600 truncate flex-1">nest.homes/listing/{listing.id}</span>
              <button onClick={() => { navigator.clipboard?.writeText(`nest.homes/listing/${listing.id}`); }}
                className="text-[12px] px-3 py-1.5 rounded-lg font-medium" style={{ backgroundColor: '#1A1B3A', color: '#ffffff' }}>
                Copy
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px', marginTop: '16px' }}>
              {['WhatsApp', 'Email', 'Message'].map(method => (
                <button key={method} className="px-3 py-3 border border-stone-200 rounded-xl text-[13px] hover:border-[#1A1B3A] transition">{method}</button>
              ))}
            </div>
          </div>
        </Modal>
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12 detail-grid">
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
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

          {/* Floor plan */}
          <section className="mt-12">
            <h2 className="font-display text-[32px] text-[#1A1B3A] mb-5">Floor plan</h2>
            <div className="rounded-3xl overflow-hidden border border-stone-200 bg-white p-6">
              <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                {/* Outer walls */}
                <rect x="40" y="40" width="720" height="420" fill="none" stroke="#1A1B3A" strokeWidth="4"/>
                {/* Living room (large) */}
                <rect x="40" y="40" width="380" height="240" fill="#FAF7F2"/>
                <text x="230" y="160" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="22" fill="#1A1B3A">Living</text>
                <text x="230" y="185" textAnchor="middle" fontSize="12" fill="#666">22' × 18'</text>
                {/* Kitchen */}
                <rect x="420" y="40" width="200" height="180" fill="#FAF7F2"/>
                <line x1="420" y1="40" x2="420" y2="220" stroke="#1A1B3A" strokeWidth="3"/>
                <text x="520" y="125" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="20" fill="#1A1B3A">Kitchen</text>
                <text x="520" y="148" textAnchor="middle" fontSize="11" fill="#666">14' × 11'</text>
                {/* Dining */}
                <rect x="620" y="40" width="140" height="180" fill="#FAF7F2"/>
                <line x1="620" y1="40" x2="620" y2="220" stroke="#1A1B3A" strokeWidth="3"/>
                <text x="690" y="125" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="18" fill="#1A1B3A">Dining</text>
                <text x="690" y="146" textAnchor="middle" fontSize="11" fill="#666">10' × 12'</text>
                {/* Master Bedroom */}
                <rect x="40" y="280" width="280" height="180" fill="#FAF7F2"/>
                <line x1="40" y1="280" x2="320" y2="280" stroke="#1A1B3A" strokeWidth="3"/>
                <text x="180" y="365" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="20" fill="#1A1B3A">Master Bedroom</text>
                <text x="180" y="388" textAnchor="middle" fontSize="11" fill="#666">16' × 14'</text>
                {/* Bedroom 2 */}
                <rect x="320" y="280" width="220" height="180" fill="#FAF7F2"/>
                <line x1="320" y1="280" x2="540" y2="280" stroke="#1A1B3A" strokeWidth="3"/>
                <line x1="320" y1="220" x2="320" y2="460" stroke="#1A1B3A" strokeWidth="3"/>
                <text x="430" y="365" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="20" fill="#1A1B3A">Bedroom 2</text>
                <text x="430" y="388" textAnchor="middle" fontSize="11" fill="#666">12' × 13'</text>
                {/* Bedroom 3 */}
                <rect x="540" y="220" width="220" height="240" fill="#FAF7F2"/>
                <line x1="540" y1="220" x2="540" y2="460" stroke="#1A1B3A" strokeWidth="3"/>
                <text x="650" y="335" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="20" fill="#1A1B3A">Bedroom 3</text>
                <text x="650" y="358" textAnchor="middle" fontSize="11" fill="#666">11' × 14'</text>
                {/* Door swings */}
                <path d="M 200 280 A 30 30 0 0 1 230 310" fill="none" stroke="#1A1B3A" strokeOpacity="0.4" strokeWidth="1.5"/>
                <path d="M 430 280 A 25 25 0 0 1 455 305" fill="none" stroke="#1A1B3A" strokeOpacity="0.4" strokeWidth="1.5"/>
                <path d="M 540 320 A 25 25 0 0 1 565 345" fill="none" stroke="#1A1B3A" strokeOpacity="0.4" strokeWidth="1.5"/>
              </svg>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[12px] text-stone-600">
                <span>Carpet area: <span className="font-medium text-[#1A1B3A]">{listing.area} sq.ft</span></span>
                <span>Built-up: <span className="font-medium text-[#1A1B3A]">{Math.round(listing.area * 1.2)} sq.ft</span></span>
                <button className="text-[#1A1B3A] font-medium underline underline-offset-4">Download PDF</button>
              </div>
            </div>
          </section>

          {/* Nearby amenities */}
          <section className="mt-12">
            <h2 className="font-display text-[32px] text-[#1A1B3A] mb-5">What's nearby</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
              {nearby.map(n => {
                const Icon = n.icon;
                return (
                  <div key={n.type} className="bg-white border border-stone-200 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFF4D6' }}>
                        <Icon size={16} style={{ color: '#5A3D00' }} strokeWidth={2}/>
                      </div>
                      <p className="font-display text-[18px] text-[#1A1B3A]">{n.type}</p>
                    </div>
                    <ul className="space-y-1.5">
                      {n.items.map(i => <li key={i} className="text-[13px] text-stone-700">{i}</li>)}
                    </ul>
                  </div>
                );
              })}
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

      {/* Similar listings */}
      {similar.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-20">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-stone-500">You may also like</p>
              <h2 className="font-display text-[36px] text-[#1A1B3A] mt-1 leading-none">Similar homes in {listing.city}</h2>
            </div>
            <button onClick={() => navigate({ name: 'search' })} className="text-[14px] font-medium text-[#1A1B3A] hover:underline underline-offset-4">See more →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', columnGap: '24px', rowGap: '32px' }}>
            {similar.map(l => (
              <ListingCard key={l.id} listing={l} navigate={navigate} toggleShortlist={toggleShortlist} shortlisted={shortlist.includes(l.id)}/>
            ))}
          </div>
        </section>
      )}

      <Footer/>
    </div>
  );
};

// ---------- 404 / Not found ----------
const NotFoundPage = ({ navigate }) => (
  <div className="max-w-[800px] mx-auto px-6 py-24 text-center min-h-[70vh] flex flex-col items-center justify-center">
    <div className="relative w-16 h-16 mb-8">
      <div className="absolute inset-0 rounded-2xl rotate-3" style={{ backgroundColor: '#1A1B3A' }}/>
      <div className="absolute inset-0 rounded-2xl -rotate-3 flex items-center justify-center" style={{ backgroundColor: '#FFD66B', mixBlendMode: 'multiply' }}/>
    </div>
    <p className="tracking-[0.2em] uppercase text-stone-500" style={{ fontSize: '11px' }}>404</p>
    <h1 className="font-display leading-[0.95] text-[#1A1B3A] mt-3" style={{ fontSize: 'clamp(48px, 8vw, 96px)' }}>
      This <em className="italic">home</em><br/>has moved on.
    </h1>
    <p className="text-stone-600 mt-6 max-w-md" style={{ fontSize: '16px' }}>
      The listing you're looking for either sold, was withdrawn, or never existed. The market moves quickly on us too.
    </p>
    <div className="mt-10 flex gap-3 flex-wrap justify-center">
      <button onClick={() => navigate({ name: 'home' })}
        className="font-medium transition" style={{ fontSize: '14px', padding: '14px 24px', backgroundColor: '#1A1B3A', color: '#ffffff', borderRadius: '999px', border: 'none', cursor: 'pointer' }}>
        Back to home
      </button>
      <button onClick={() => navigate({ name: 'search' })}
        className="font-medium transition" style={{ fontSize: '14px', padding: '14px 24px', backgroundColor: '#ffffff', color: '#1A1B3A', borderRadius: '999px', border: '2px solid #1A1B3A', cursor: 'pointer' }}>
        Browse all homes
      </button>
    </div>
  </div>
);

// ---------- Shortlist ----------
const ShortlistPage = ({ navigate, listings, toggleShortlist, shortlist, intent, onOpenIntent, user }) => {
  const items = listings.filter(l => shortlist.includes(l.id));
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12 min-h-screen">
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-12 min-h-screen">
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
  const [visitDate, setVisitDate] = useState(null);
  const [visitTime, setVisitTime] = useState(null);

  useEffect(() => { if (open) { setSubmitted(false); setMessage(''); setVisitDate(null); setVisitTime(null); } }, [open]);
  if (!open || !listing) return null;

  if (!intent || intent !== 'serious') {
    return (
      <Modal onClose={onClose}>
        <div className="p-10 text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-2xl rotate-6" style={{ backgroundColor: '#FFD66B' }}/>
            <div className="absolute inset-0 rounded-2xl -rotate-6 flex items-center justify-center" style={{ backgroundColor: '#1A1B3A' }}><Sparkles size={24} style={{ color: '#FFD66B' }}/></div>
          </div>
          <h2 className="font-display text-[32px] text-[#1A1B3A] leading-tight">A quick step before we connect you</h2>
          <p className="text-[14px] text-stone-600 mt-3 max-w-sm mx-auto leading-relaxed">
            We only share leads with dealers when buyers are <span className="font-medium text-[#1A1B3A]">ready to engage</span>. Update your status to continue.
          </p>
          {intent && <div className="mt-5 inline-block"><p className="text-[11px] text-stone-500 mb-1.5">Current status</p><IntentBadge intent={intent} onClick={() => {}} size="sm"/></div>}
          <button onClick={() => { onClose(); onPromptIntent(); }} className="mt-7 font-medium" style={{ fontSize: '14px', padding: '14px 28px', backgroundColor: '#1A1B3A', color: '#ffffff', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>Update my status</button>
        </div>
      </Modal>
    );
  }

  // Generate next 7 days for visit picker
  const today = new Date();
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
  const timeSlots = ['10:00 AM', '11:30 AM', '1:00 PM', '3:00 PM', '4:30 PM', '6:00 PM'];

  const canSubmit = mode === 'callback' || (mode === 'visit' && visitDate && visitTime);

  const submit = () => {
    onSubmit({ listingId: listing.id, mode, message, visitDate, visitTime });
    setSubmitted(true);
  };

  return (
    <Modal onClose={onClose} wide={mode === 'visit'}>
      <div className="p-8 sm:p-10">
        {submitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#E8F3E8' }}><Check size={26} style={{ color: '#2D5A2D' }} strokeWidth={2.5}/></div>
            <h2 className="font-display text-[32px] text-[#1A1B3A]">{mode === 'visit' ? 'Visit confirmed' : "You're on the list"}</h2>
            <p className="text-[14px] text-stone-600 mt-3 max-w-sm mx-auto leading-relaxed">
              {mode === 'visit' && visitDate && visitTime
                ? <>Your dealer will see you on <span className="font-medium text-[#1A1B3A]">{visitDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}</span> at <span className="font-medium text-[#1A1B3A]">{visitTime}</span>. We'll confirm by SMS within an hour.</>
                : <>A dealer from our bench will reach out within <span className="font-medium text-[#1A1B3A]">4 hours</span>.</>
              }
            </p>
            <button onClick={onClose} className="mt-7 font-medium" style={{ fontSize: '13px', padding: '12px 28px', backgroundColor: '#1A1B3A', color: '#ffffff', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>Done</button>
          </div>
        ) : (
          <>
            <span className="text-[11px] tracking-[0.2em] uppercase text-stone-500">{mode === 'visit' ? 'Schedule a visit' : 'Request a callback'}</span>
            <h2 className="font-display text-[28px] sm:text-[32px] text-[#1A1B3A] mt-1 leading-tight">{listing.title}</h2>
            <p className="text-[13px] text-stone-500 mt-1">{listing.locality}, {listing.city}</p>

            <div className="mt-5 p-4 border border-stone-200 rounded-2xl space-y-2 text-[13px]" style={{ backgroundColor: '#FAF7F2' }}>
              <div className="flex justify-between items-center"><span className="text-stone-500">Contact</span><span className="font-medium">{user?.phone}</span></div>
              <div className="flex justify-between items-center"><span className="text-stone-500">Status</span><IntentBadge intent="serious" onClick={() => {}} size="sm"/></div>
            </div>

            {mode === 'visit' && (
              <>
                <p className="text-[12px] tracking-[0.15em] uppercase text-stone-500 font-medium mt-6 mb-3">Pick a day</p>
                <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
                  {days.map((d, i) => {
                    const isSel = visitDate && d.toDateString() === visitDate.toDateString();
                    return (
                      <button key={i} onClick={() => setVisitDate(d)}
                        className="flex-shrink-0 rounded-xl text-center transition"
                        style={{
                          padding: '12px 14px', minWidth: '70px',
                          backgroundColor: isSel ? '#1A1B3A' : '#ffffff',
                          color: isSel ? '#ffffff' : '#1A1B3A',
                          border: `2px solid ${isSel ? '#1A1B3A' : '#E7E5E4'}`,
                          cursor: 'pointer',
                        }}>
                        <p style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                        <p className="font-display" style={{ fontSize: '22px', lineHeight: 1, marginTop: '4px' }}>{d.getDate()}</p>
                        <p style={{ fontSize: '10px', opacity: 0.7, marginTop: '2px' }}>{d.toLocaleDateString('en-US', { month: 'short' })}</p>
                      </button>
                    );
                  })}
                </div>

                {visitDate && (
                  <>
                    <p className="text-[12px] tracking-[0.15em] uppercase text-stone-500 font-medium mt-5 mb-3">Pick a time</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '8px' }}>
                      {timeSlots.map(t => {
                        const isSel = visitTime === t;
                        return (
                          <button key={t} onClick={() => setVisitTime(t)}
                            className="rounded-lg text-center transition"
                            style={{
                              padding: '10px',
                              fontSize: '13px',
                              backgroundColor: isSel ? '#1A1B3A' : '#ffffff',
                              color: isSel ? '#ffffff' : '#1A1B3A',
                              border: `1.5px solid ${isSel ? '#1A1B3A' : '#E7E5E4'}`,
                              cursor: 'pointer',
                            }}>
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </>
            )}

            <label className="block mt-5 text-[12px] text-stone-600 mb-2">Anything specific? <span className="text-stone-400">(optional)</span></label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={mode === 'visit' ? 'Any specific questions or requirements?' : 'A good time to call?'} rows={3} className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl outline-none text-[14px] focus:border-[#1A1B3A] resize-none transition"/>

            <button onClick={submit} disabled={!canSubmit}
              className="w-full mt-5 font-medium"
              style={{
                fontSize: '14px', padding: '16px',
                backgroundColor: canSubmit ? '#1A1B3A' : '#D6D3D1',
                color: '#ffffff',
                borderRadius: '12px',
                border: 'none',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                opacity: canSubmit ? 1 : 0.6,
              }}>
              {mode === 'visit' ? 'Confirm visit' : 'Send to our dealer'}
            </button>
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

// ---------- About / How it works ----------
const AboutPage = ({ navigate }) => (
  <div className="bg-[#FAF7F2] min-h-screen">
    {/* Hero */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-1/4 rounded-full blur-3xl" style={{ width: '400px', height: '400px', backgroundColor: '#FFD66B', opacity: 0.18 }}/>
        <div className="absolute top-40 right-1/4 rounded-full blur-3xl" style={{ width: '500px', height: '500px', backgroundColor: '#FFB5A7', opacity: 0.18 }}/>
      </div>
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 pb-12 text-center">
        <span className="tracking-[0.2em] uppercase text-stone-500" style={{ fontSize: '11px' }}>How it works</span>
        <h1 className="font-display leading-[0.95] tracking-tight mt-3" style={{ color: '#1A1B3A', fontSize: 'clamp(48px, 9vw, 110px)' }}>
          We're not <em className="italic">another</em><br/>
          property <span className="relative inline-block">
            <span className="relative z-10">portal.</span>
            <span className="absolute inset-x-0 z-0" style={{ backgroundColor: '#FFD66B', bottom: '0.12em', height: '0.22em', transform: 'rotate(-1deg)' }}/>
          </span>
        </h1>
        <p className="mt-8 leading-relaxed text-stone-600 max-w-2xl mx-auto" style={{ fontSize: 'clamp(15px, 1.6vw, 19px)' }}>
          Property platforms in India are broken. Listings are bait, leads are fake, and buyers are spammed by twenty dealers within a minute of clicking a button. We built nest to fix this.
        </p>
      </div>
    </section>

    {/* The model in 4 steps */}
    <section className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-10 py-16">
      <div className="space-y-8">
        {[
          { num: '01', title: 'We control supply', body: 'Unlike portals where anyone can post anything, every nest listing is sourced and verified by our own team. We visit, we photograph, we confirm the paperwork. If it\'s on nest, it\'s real.' },
          { num: '02', title: 'You tell us your intent', body: 'When you sign up, you tell us where you stand: just browsing, exploring for the next few months, or ready to buy now. This is the entire premise of the platform.' },
          { num: '03', title: 'Only hot leads reach dealers', body: 'When you\'re "Ready to buy" and request a callback, we route you to one — exactly one — vetted dealer from our hand-picked bench. They\'ve been waiting for a serious buyer.' },
          { num: '04', title: 'Casual browsers stay protected', body: 'If your intent is "Just browsing" or "Exploring soon," nothing happens. You browse, you save, you research. No phone calls. No texts. No spam. Ever.' },
        ].map((step, i) => (
          <div key={step.num} className="flex gap-6 sm:gap-10 items-start">
            <span className="font-display italic flex-shrink-0" style={{ fontSize: 'clamp(48px, 8vw, 80px)', color: '#E5D5BC', lineHeight: 1 }}>{step.num}</span>
            <div className="flex-1 pt-2">
              <h3 className="font-display text-[#1A1B3A]" style={{ fontSize: 'clamp(24px, 3vw, 32px)', lineHeight: 1.1 }}>{step.title}</h3>
              <p className="mt-2 text-stone-700 leading-relaxed" style={{ fontSize: '15px' }}>{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* FAQ */}
    <section className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-10 py-16">
      <p className="text-[11px] tracking-[0.2em] uppercase text-stone-500 text-center">Common questions</p>
      <h2 className="font-display text-center text-[#1A1B3A] mt-2 leading-none" style={{ fontSize: 'clamp(36px, 5vw, 52px)' }}>Things you might be wondering</h2>

      <div className="mt-12 space-y-3">
        {[
          { q: 'Is nest free for buyers?', a: 'Yes, completely. Buyers never pay nest a rupee. Dealers and developers pay for the platform.' },
          { q: 'Why phone OTP and no passwords?', a: 'Phone numbers are how Indian real estate actually works. They\'re also harder to fake than email, which protects everyone from spam.' },
          { q: 'What if I want to change my intent?', a: 'Anytime. Tap the colored status pill in the top nav or visit your profile. Your past actions don\'t change — but new behaviour will.' },
          { q: 'How are dealers vetted?', a: 'Every dealer on our bench is interviewed in person, has been in the market for at least 5 years, and has a track record we can verify. We rotate out dealers with poor response or feedback.' },
          { q: 'Can I see who\'s viewed my contact?', a: 'When you submit a lead, you see exactly which dealer it\'s assigned to. You can rate them after the conversation, and that rating affects whether they stay on our bench.' },
        ].map(item => (
          <details key={item.q} className="bg-white border border-stone-200 rounded-2xl group">
            <summary className="cursor-pointer px-6 py-5 flex items-center justify-between gap-4 list-none">
              <span className="font-display text-[#1A1B3A]" style={{ fontSize: '20px' }}>{item.q}</span>
              <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-open:rotate-45" style={{ backgroundColor: '#FFF4D6' }}>
                <Plus size={16} style={{ color: '#5A3D00' }}/>
              </span>
            </summary>
            <div className="px-6 pb-5 -mt-1 text-stone-700 leading-relaxed" style={{ fontSize: '14px' }}>
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-10 py-16 text-center">
      <div className="rounded-3xl p-10 sm:p-16" style={{ backgroundColor: '#1A1B3A' }}>
        <p className="tracking-[0.2em] uppercase" style={{ fontSize: '11px', color: '#FFD66B' }}>Ready</p>
        <h2 className="font-display leading-[0.95] mt-3" style={{ fontSize: 'clamp(36px, 5vw, 64px)', color: '#ffffff' }}>
          Find your <em className="italic" style={{ color: '#FFD66B' }}>next home</em>
        </h2>
        <p className="mt-4 leading-relaxed max-w-md mx-auto" style={{ fontSize: '15px', color: '#D1D1D6' }}>
          Browse verified homes. Tell us when you're ready. We'll handle the rest.
        </p>
        <button onClick={() => navigate({ name: 'search' })}
          className="mt-8 font-medium transition"
          style={{ fontSize: '15px', padding: '16px 32px', backgroundColor: '#FFD66B', color: '#1A1B3A', borderRadius: '999px', border: 'none', cursor: 'pointer' }}>
          Start browsing →
        </button>
      </div>
    </section>

    <Footer/>
  </div>
);

const Footer = () => (
  <footer className="mt-20" style={{ backgroundColor: '#1A1B3A', color: '#ffffff' }}>
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16">
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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-5 flex justify-between items-center" style={{ fontSize: '12px', color: '#A1A1AA' }}>
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
  const [recentSearches, setRecentSearches] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);

  const navigate = (r) => {
    setRoute(r);
    if (r.name === 'listing') setViewedIds(prev => new Set(prev).add(r.id));
    window.scrollTo(0, 0);
  };

  const addRecentSearch = (search) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(r => r.query !== search.query || r.city !== search.city);
      return [search, ...filtered].slice(0, 10);
    });
  };

  const toggleSavedSearch = (search) => {
    setSavedSearches(prev => {
      const exists = prev.find(s => s.id === search.id);
      return exists ? prev.filter(s => s.id !== search.id) : [search, ...prev];
    });
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
        /* Shimmer for skeleton loaders */
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Responsive show/hide — bypass Tailwind responsive prefixes which aren't reliable here */
        /* Mobile (< 1024px) */
        .show-mobile      { display: flex; }
        .show-mobile-inline { display: inline; }
        .hide-mobile      { display: none; }
        /* Desktop (>= 1024px) */
        @media (min-width: 1024px) {
          .show-mobile    { display: none; }
          .show-mobile-inline { display: none; }
          .hide-mobile    { display: flex; }
        }
        /* Small-and-up labels: hide below 640px */
        .show-sm-up       { display: none; }
        @media (min-width: 640px) {
          .show-sm-up     { display: inline; }
        }
        /* Medium-and-up: hide below 768px */
        .show-md-up       { display: none; }
        .hide-md-up       { display: block; }
        @media (min-width: 768px) {
          .show-md-up     { display: block; }
          .hide-md-up     { display: none; }
        }
      `}</style>

      <TopNav navigate={navigate} shortlistCount={shortlist.length} user={user} onOpenAuth={() => setAuthOpen(true)} intent={intent} onOpenIntent={() => setIntentOpen(true)} city={city} onChangeCity={setCity}/>

      {route.name === 'home' && <HomePage navigate={navigate} listings={MOCK_LISTINGS} toggleShortlist={toggleShortlist} shortlist={shortlist} intent={intent} onOpenIntent={() => setIntentOpen(true)} user={user} city={city} onChangeCity={setCity}/>}
      {route.name === 'search' && <SearchPage navigate={navigate} route={route} listings={MOCK_LISTINGS} toggleShortlist={toggleShortlist} shortlist={shortlist} intent={intent} onOpenIntent={() => setIntentOpen(true)} user={user} city={city} onChangeCity={setCity} recentSearches={recentSearches} addRecentSearch={addRecentSearch} savedSearches={savedSearches} toggleSavedSearch={toggleSavedSearch}/>}
      {route.name === 'listing' && <ListingDetailPage navigate={navigate} route={route} listings={MOCK_LISTINGS} toggleShortlist={toggleShortlist} shortlist={shortlist} user={user} onContactDealer={handleContactDealer} intent={intent} onOpenIntent={() => setIntentOpen(true)}/>}
      {route.name === 'shortlist' && <ShortlistPage navigate={navigate} listings={MOCK_LISTINGS} toggleShortlist={toggleShortlist} shortlist={shortlist} intent={intent} onOpenIntent={() => setIntentOpen(true)} user={user}/>}
      {route.name === 'profile' && <ProfilePage user={user} intent={intent} navigate={navigate} onChangeIntent={() => setIntentOpen(true)} onSignOut={() => { setUser(null); setIntent(null); navigate({ name: 'home' }); }} viewedCount={viewedIds.size} shortlist={shortlist} savedSearches={savedSearches} toggleSavedSearch={toggleSavedSearch}/>}
      {route.name === 'about' && <AboutPage navigate={navigate}/>}
      {!['home','search','listing','shortlist','profile','about'].includes(route.name) && <NotFoundPage navigate={navigate}/>}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSignIn={handleSignIn}/>
      <IntentModal open={intentOpen} onClose={() => setIntentOpen(false)} onSelect={setIntent} currentIntent={intent}/>
      <ContactModal open={contactState.open} onClose={() => setContactState({ ...contactState, open: false })} listing={contactState.listing} mode={contactState.mode} user={user} intent={intent} onSubmit={handleLeadSubmit} onPromptIntent={() => setIntentOpen(true)}/>
    </div>
  );
}
