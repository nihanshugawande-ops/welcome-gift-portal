export interface DeityItem {
  id: string;
  name: string;
  title: string;
  mantra: string;
  description: string;
  devotionalFact: string;
  symbolism: string;
  image: string;
  fallbackGradient: string;
}

export interface NavratriForm {
  day: number;
  name: string;
  formName: string;
  significance: string;
  color: string;
  colorHex: string;
  description: string;
  mantra: string;
  mount: string;
  weapon: string;
}

export interface IndiaLandmark {
  id: string;
  name: string;
  location: string;
  state: string;
  category: string;
  description: string;
  image: string;
  attribution: string;
  bestTimeToVisit: string;
}

export interface ArtItem {
  id: string;
  title: string;
  category: string;
  promptConcept: string;
  description: string;
  colorPalette: string[];
  image: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: 'Science' | 'Technology' | 'Space' | 'Indian History' | 'General Knowledge' | 'AI & Innovation' | 'Inspirational Stories' | 'Interesting Facts';
  summary: string;
  fullContent: string;
  readTime: string;
  keyFact: string;
}

export interface BrainTeaser {
  id: number;
  question: string;
  hint: string;
  answer: string;
  explanation: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// -------------------------------------------------------------
// 1. GOD & SPIRITUALITY DATA
// -------------------------------------------------------------
export const DEITIES: DeityItem[] = [
  {
    id: 'ganesha',
    name: 'Lord Ganesha',
    title: 'The Remover of Obstacles & Lord of New Beginnings',
    mantra: 'Om Gam Ganapataye Namaha',
    description: 'Revered as the supreme patron of intellect, arts, wisdom, and auspicious beginnings. Invoked before any journey, ceremony, or new undertaking.',
    devotionalFact: 'Lord Ganesha inscribed the sacred epic Mahabharata as sage Vyasa dictated it without stopping.',
    symbolism: 'The large elephant head symbolizes supreme intelligence, while the trunk represents high adaptability and strength.',
    image: 'https://images.unsplash.com/photo-1567591414240-e59325988366?auto=format&fit=crop&w=800&q=80',
    fallbackGradient: 'from-amber-600 via-orange-600 to-rose-700',
  },
  {
    id: 'shiva',
    name: 'Lord Shiva',
    title: 'Mahadeva, The Auspicious Cosmic Transformer',
    mantra: 'Om Namah Shivaya',
    description: 'The supreme yogi and cosmic protector who transcends time, embodying deep meditation, inner peace, cosmic dance (Nataraja), and pure consciousness.',
    devotionalFact: 'Lord Shiva drinks the Halahala poison to protect all cosmic creation, turning his throat blue (Neelkantha).',
    symbolism: 'The Trishula (trident) represents the mastery over creation, preservation, and transformation, as well as the three Gunas.',
    image: 'https://images.unsplash.com/photo-1596766367351-872f094eb8ec?auto=format&fit=crop&w=800&q=80',
    fallbackGradient: 'from-sky-700 via-indigo-900 to-slate-900',
  },
  {
    id: 'krishna',
    name: 'Lord Krishna',
    title: 'The Divine Teacher of the Bhagavad Gita & Embodiment of Love',
    mantra: 'Hare Krishna, Hare Krishna, Krishna Krishna, Hare Hare',
    description: 'The supreme embodiment of divine joy, selfless duty, and unconditional love. Deliverer of the timeless wisdom of the Bhagavad Gita at Kurukshetra.',
    devotionalFact: 'Krishna delivered the 700 verses of the Bhagavad Gita to Arjuna in the middle of the battlefield, teaching Nishkama Karma.',
    symbolism: 'The divine flute represents the sacred human soul hollowed of ego, producing enchanting spiritual music.',
    image: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=800&q=80',
    fallbackGradient: 'from-blue-600 via-teal-700 to-emerald-900',
  },
  {
    id: 'rama',
    name: 'Lord Rama',
    title: 'Maryada Purushottama, The Ideal of Righteousness',
    mantra: 'Sri Rama Jaya Rama Jaya Jaya Rama',
    description: 'The personification of dharma, truth, humility, and noble governance. Revered for steadfast adherence to righteousness under every life test.',
    devotionalFact: 'The kingdom of Ayodhya under Lord Rama (Ramrajya) remains the eternal golden standard of justice and welfare for all living beings.',
    symbolism: 'The bow and arrow symbolize unwavering focus, self-restraint, and courage in defending universal truth.',
    image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&w=800&q=80',
    fallbackGradient: 'from-amber-500 via-rose-600 to-amber-800',
  },
  {
    id: 'durga',
    name: 'Goddess Durga',
    title: 'Maa Durga, The Supreme Embodiment of Shakti & Protection',
    mantra: 'Om Dum Durgayei Namaha',
    description: 'The invincible divine mother and primordial energy of the cosmos. Victorious over negative forces and the protector of devotion, peace, and truth.',
    devotionalFact: 'She manifested through the unified divine brilliance (Tejas) of all celestial powers to conquer Mahishasura.',
    symbolism: 'Riding the lion represents absolute mastery over fear, pride, and emotional impulse with divine grace.',
    image: 'https://images.unsplash.com/photo-1601056639638-c53a7894a86e?auto=format&fit=crop&w=800&q=80',
    fallbackGradient: 'from-rose-600 via-red-700 to-amber-700',
  },
  {
    id: 'lakshmi',
    name: 'Goddess Lakshmi',
    title: 'Goddess of Prosperity, Abundance, and Spiritual Wealth',
    mantra: 'Om Shreem Mahalakshmiyei Namaha',
    description: 'The graceful consort of Lord Vishnu, bestower of both material prosperity and spiritual enlightenment, auspicious fortune, and contentment.',
    devotionalFact: 'Emerged from the Samudra Manthan (Churning of the Cosmic Ocean) seated on a blooming lotus, blessing the universe with abundance.',
    symbolism: 'The four hands signify Dharma (righteousness), Kama (desire), Artha (wealth), and Moksha (spiritual liberation).',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    fallbackGradient: 'from-amber-400 via-rose-500 to-pink-700',
  },
  {
    id: 'hanuman',
    name: 'Lord Hanuman',
    title: 'Sankat Mochan, The Epitome of Devotion & Heroic Strength',
    mantra: 'Om Hanumate Namaha',
    description: 'The supreme devotee of Lord Rama, embodying boundless strength, selfless service, deep humility, courage, and unconditional devotion.',
    devotionalFact: 'Leaped across the southern ocean and brought the Sanjeevani mountain to save Lakshmana during the epic war.',
    symbolism: 'Carrying the Dronagiri mountain symbolizes the willingness to uplift every burden for the sake of the righteous.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    fallbackGradient: 'from-orange-600 via-amber-600 to-red-800',
  },
];

// -------------------------------------------------------------
// 2. NAVRATRI SPECIAL DATA (Nine Forms of Maa Durga)
// -------------------------------------------------------------
export const NAVRATRI_FORMS: NavratriForm[] = [
  {
    day: 1,
    name: 'Maa Shailaputri',
    formName: 'Daughter of the Mountains',
    significance: 'Embodies determination, patient strength, and root grounding (Muladhara Chakra).',
    color: 'Royal Yellow',
    colorHex: '#eab308',
    description: 'Born as the daughter of the King of Mountains (Himavat). She rides Nandi the bull and holds a trident in her right hand and a lotus in her left.',
    mantra: 'Vande Vanchhitalabhaya Chandrardhakritashekharam, Vrisharudham Shuladharam Shailaputrim Yashasvinim',
    mount: 'Nandi Bull',
    weapon: 'Trident (Trishula) & Sacred Lotus',
  },
  {
    day: 2,
    name: 'Maa Brahmacharini',
    formName: 'The Ascetic of Penance',
    significance: 'Teaches unwavering penance, inner discipline, patience, and virtue (Swadhisthana Chakra).',
    color: 'Pure White & Green',
    colorHex: '#10b981',
    description: 'Represents thousands of years of intense spiritual discipline. She walks barefoot holding a Japa Mala (rosary) and a Kamandalu (water pot).',
    mantra: 'Dadhana Karapadmabhyam Akshamala Kamandalu, Devi Prasidatu Mayi Brahmacharinyanuttama',
    mount: 'None (Walks Barefoot in Divine Meditation)',
    weapon: 'Japa Mala (Rosary) & Kamandalu',
  },
  {
    day: 3,
    name: 'Maa Chandraghanta',
    formName: 'The Bell-Crescent Goddess',
    significance: 'Dispels fear, bestows peace, bravery, and alertness against negative energies (Manipura Chakra).',
    color: 'Radiant Grey / Silver',
    colorHex: '#94a3b8',
    description: 'Adorned with a half-moon shaped like a bell on her forehead. Armed with celestial weapons to shield devotees while radiating infinite serenity.',
    mantra: 'Pindaja Pravararudha Chandakopastrakairyuta, Prasadam Tanute Mahyam Chandraghanteti Vishruta',
    mount: 'Tigress',
    weapon: 'Bow, Arrow, Mace, Sword, Trishula & Bell',
  },
  {
    day: 4,
    name: 'Maa Kushmanda',
    formName: 'Creator of the Cosmic Universe',
    significance: 'Source of cosmic warmth, energy, vision, and inner radiance (Anahata Chakra).',
    color: 'Vibrant Orange',
    colorHex: '#f97316',
    description: 'Created the cosmic universe with her radiant divine smile. She resides in the core of Surya (the Sun) and illuminates all directions.',
    mantra: 'Surasampurna Kalasham Rudhiraplutameva Cha, Dadhana Hastapadmabhyam Kushmanda Shubhadastu Me',
    mount: 'Lion',
    weapon: 'Eight hands holding Chakra, Mace, Lotus, Bow, Rosary & Amrita Pot',
  },
  {
    day: 5,
    name: 'Maa Skandamata',
    formName: 'Mother of Lord Kartikeya (Skanda)',
    significance: 'Bestows maternal protection, boundless affection, and pure knowledge (Vishuddha Chakra).',
    color: 'Auspicious White',
    colorHex: '#f8fafc',
    description: 'Holding infant Lord Skanda (Kartikeya) in her lap, seated on a divine lotus. Devotees who revere her simultaneously receive the blessings of Skanda.',
    mantra: 'Simhasanagata Nityam Padmanchita Karadvaya, Shubhadastu Sada Devi Skandamata Yashasvini',
    mount: 'Lion & Lotus Throne',
    weapon: 'Sacred Lotuses (Padma)',
  },
  {
    day: 6,
    name: 'Maa Katyayani',
    formName: 'The Fierce Warrior of Sage Katyayana',
    significance: 'Destroys sorrow, eliminates obstacles to righteous marriage, and brings victory (Ajna Chakra).',
    color: 'Passionate Red',
    colorHex: '#ef4444',
    description: 'Manifested from the spiritual anger of the gods to annihilate the demon Mahishasura. She possesses a fierce golden glow and carries a shining sword.',
    mantra: 'Chandrahasojjvalakara Shardulavaravahana, Katyayani Shubham Dadyad Devi Danavaghatini',
    mount: 'Fierce Lion',
    weapon: 'Chandrahasa (Sacred Curved Sword) & Lotus',
  },
  {
    day: 7,
    name: 'Maa Kalaratri',
    formName: 'The Destroyer of Darkness & Ignorance',
    significance: 'Annihilates darkness, fears, and ghosts; known as Shubhankari (the bringer of ultimate auspiciousness).',
    color: 'Royal Dark Blue',
    colorHex: '#3b82f6',
    description: 'Having a dark complexion, unbound hair, and three glowing eyes. Despite her fierce countenance, her right hands grant fearless protection and boons.',
    mantra: 'Ekaveni Japakarnapura Nagna Kharasthita, Lamboshti Karnikakarni Tailabhyaktasharirini',
    mount: 'Donkey',
    weapon: 'Iron Cleaver, Vajra & Divine Mudras of Boon-giving',
  },
  {
    day: 8,
    name: 'Maa Mahagauri',
    formName: 'The Pure White Radiance',
    significance: 'Purifies past karmas, bestows profound peace, prosperity, and truth (Sahasrara Chakra).',
    color: 'Serene Pink',
    colorHex: '#ec4899',
    description: 'Extremely fair as a conch, jasmine flower, or pure snow. Rejuvenated after sacred penance, she wears pure white robes and rides a white bull.',
    mantra: 'Shwete Vrishesamarudha Shwetambaradhara Shuchih, Mahagauri Shubham Dadyan Mahadev Pramodada',
    mount: 'White Bull',
    weapon: 'Trident & Damru (Drum)',
  },
  {
    day: 9,
    name: 'Maa Siddhidatri',
    formName: 'The Bestower of All Supernatural Siddhis',
    significance: 'Grants the 8 classical supernatural Siddhis (Anima, Mahima, etc.) and complete spiritual fulfillment.',
    color: 'Deep Purple',
    colorHex: '#a855f7',
    description: 'Lord Shiva attained all eight Siddhis by worshipping her. Seated on a lotus in full bloom, she showers supreme wisdom and eternal liberation.',
    mantra: 'Siddha Gandharva Yakshadyairasurairamarairapi, Sevyamana Sada Bhuyat Siddhida Siddhidayini',
    mount: 'Lotus Flower & Lion',
    weapon: 'Chakra, Gada (Mace), Shankha (Conch) & Lotus',
  },
];

// -------------------------------------------------------------
// 3. BEAUTIFUL INDIA DATA
// -------------------------------------------------------------
export const INDIA_LANDMARKS: IndiaLandmark[] = [
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    location: 'Agra',
    state: 'Uttar Pradesh',
    category: 'Historical Marvel',
    description: 'A sublime UNESCO World Heritage Site of pure white Makrana marble, acclaimed globally as the jewel of Indo-Islamic architecture and symmetry.',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    attribution: 'Unsplash Community / Public Heritage Documentation',
    bestTimeToVisit: 'October to March (Sunrise view recommended)',
  },
  {
    id: 'varanasi-ghats',
    name: 'Varanasi Ghats & Ganga Aarti',
    location: 'Varanasi (Kashi)',
    state: 'Uttar Pradesh',
    category: 'Spiritual Center',
    description: 'One of the oldest continuously inhabited cities on Earth. The twilight Ganga Aarti along Dashashwamedh Ghat creates an unforgettable spiritual resonance.',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    attribution: 'Unsplash Community / Cultural Archive',
    bestTimeToVisit: 'November to February (Evening Aarti)',
  },
  {
    id: 'kashmir-valleys',
    name: 'Kashmir Valleys & Dal Lake',
    location: 'Srinagar & Gulmarg',
    state: 'Jammu & Kashmir',
    category: 'Natural Landscape',
    description: 'Revered historically as "Paradise on Earth", known for calm Shikara boats on Dal Lake, snow-capped Himalayan peaks, and saffron gardens.',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    attribution: 'Unsplash Community / Travel License',
    bestTimeToVisit: 'April to October (Floral bloom & Winter snow)',
  },
  {
    id: 'kedarnath',
    name: 'Kedarnath Jyotirlinga Temple',
    location: 'Rudraprayag',
    state: 'Uttarakhand',
    category: 'Sacred Himalayan Shrine',
    description: 'Perched at 3,583 meters against the mighty Garhwal Himalayan peaks, Kedarnath is one of the twelve sacred Jyotirlingas of Lord Shiva.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    attribution: 'Public Domain Himalayan Documentation',
    bestTimeToVisit: 'May to June & September to October',
  },
  {
    id: 'rajasthan-palaces',
    name: 'Hawa Mahal & City Palace',
    location: 'Jaipur',
    state: 'Rajasthan',
    category: 'Royal Heritage',
    description: 'The "Palace of Winds" features 953 intricately carved honeycomb jharokhas of pink and red sandstone, blending Rajput and Mughal majesty.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    attribution: 'Unsplash Community / Architectural Heritage',
    bestTimeToVisit: 'October to March',
  },
  {
    id: 'meenakshi-temple',
    name: 'Meenakshi Amman Temple',
    location: 'Madurai',
    state: 'Tamil Nadu',
    category: 'Dravidian Architecture',
    description: 'An architectural masterpiece boasting 14 towering gopurams decorated with thousands of brightly colored mythological stone sculptures.',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=800&q=80',
    attribution: 'Public Heritage Archives',
    bestTimeToVisit: 'October to March',
  },
  {
    id: 'western-ghats-munnar',
    name: 'Munnar Tea Hills & Western Ghats',
    location: 'Idukki',
    state: 'Kerala',
    category: 'Biodiversity Hotspot',
    description: 'Rolling emerald tea plantations, mist-covered hills, and rare flora like the Neelakurinji flower in the UNESCO biodiversity hotspot.',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
    attribution: 'Unsplash Community / Nature Photography',
    bestTimeToVisit: 'September to March',
  },
  {
    id: 'qutub-minar',
    name: 'Qutub Minar & Iron Pillar',
    location: 'New Delhi',
    state: 'Delhi',
    category: 'Historical Monument',
    description: 'A 73-meter towering fluted minaret of red sandstone built in 1192, featuring the 1,600-year-old rust-resistant Gupta Empire iron pillar.',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    attribution: 'Unsplash Community / National Heritage',
    bestTimeToVisit: 'November to February',
  },
];

// -------------------------------------------------------------
// 4. AI ART GALLERY DATA
// -------------------------------------------------------------
export const AI_ART_ITEMS: ArtItem[] = [
  {
    id: 'art-1',
    title: 'The Golden City of Floating Lanterns',
    category: 'Fantasy Worlds',
    promptConcept: 'Majestic ancient city floating over clouds during sunset, illuminated with millions of amber lanterns, hyper-detailed oil painting aesthetic.',
    description: 'A tranquil fantasy world depicting harmony between celestial architecture, warm golden illumination, and atmospheric clouds.',
    colorPalette: ['#f59e0b', '#d97706', '#78350f', '#1e293b'],
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'art-2',
    title: 'Nebula Over the Cosmic Cradle',
    category: 'Space and Galaxies',
    promptConcept: 'Stunning spiral galaxy emitting violet, turquoise and rose hues, surrounded by newborn diamond stars, photorealistic cosmic rendering.',
    description: 'A journey into the deep cosmos exploring interstellar nurseries where new suns and planets are born across billions of years.',
    colorPalette: ['#8b5cf6', '#ec4899', '#06b6d4', '#0f172a'],
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'art-3',
    title: 'Solarpunk Metropolis 2099',
    category: 'Futuristic Cities',
    promptConcept: 'Biophilic eco-city featuring living green skyscrapers, crystal sky-trains, solar glass towers, and crystal waterfalls.',
    description: 'An optimistic architectural vision of future humanity co-existing with flourishing vertical forests and clean solar energy.',
    colorPalette: ['#10b981', '#059669', '#3b82f6', '#f8fafc'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'art-4',
    title: 'The Bioluminescent Enchanted Forest',
    category: 'Nature',
    promptConcept: 'Ancient deep forest where giant ferns and waterfalls glow with gentle turquoise luminescence beneath a starlit canopy.',
    description: 'Celebrates the mystique of untouched natural wilderness bathed in soft bioluminescent glows and tranquil waters.',
    colorPalette: ['#06b6d4', '#14b8a6', '#047857', '#022c22'],
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'art-5',
    title: 'Prismatic Cybernetic Lotus',
    category: 'Digital Art',
    promptConcept: 'Holographic fractal lotus blooming in digital cyberspace, iridescent fiber optic petals refract rainbow light in dark void.',
    description: 'A synthesis of traditional spiritual iconography and modern algorithmic geometric fractals rendered in iridescent light.',
    colorPalette: ['#ec4899', '#a855f7', '#6366f1', '#18181b'],
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'art-6',
    title: 'Festival of Eternal Divine Lights',
    category: 'Festival Art',
    promptConcept: 'Traditional Indian temple courtyard during Diwali, thousands of clay diyas creating warm geometric reflections on water mirrors.',
    description: 'Captures the festive warmth of lights dispelling darkness, celebrating triumph, inner joy, and community togetherness.',
    colorPalette: ['#ea580c', '#f59e0b', '#fbbf24', '#451a03'],
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'art-7',
    title: 'Alpine Mirror of the Sunset Peaks',
    category: 'Beautiful Landscapes',
    promptConcept: 'Crystal clear alpine lake reflecting snow-covered peaks bathed in alpenglow pink and amber sky, high dynamic range landscape.',
    description: 'Serene mountain wilderness untouched by human noise, showcasing the pristine peace of high-altitude reflection pools.',
    colorPalette: ['#fb7185', '#fda4af', '#38bdf8', '#0c4a6e'],
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  },
];

// -------------------------------------------------------------
// 5. KNOWLEDGE CORNER DATA
// -------------------------------------------------------------
export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'k-1',
    title: 'The Chandrayaan-3 Triumph: Soft Landing on the Lunar South Pole',
    category: 'Space',
    summary: 'How ISRO accomplished history by becoming the very first nation to land successfully near the mysterious south pole of the Moon.',
    fullContent: `On August 23, 2023, India's Chandrayaan-3 lander 'Vikram' achieved a historic soft touchdown on the lunar south polar region. 
    
    The lunar south pole is of immense scientific interest globally due to permanently shadowed craters that harbor significant reserves of water ice. This ice can provide drinking water, breathable oxygen, and hydrogen rocket fuel for future manned Mars missions. 
    
    ISRO's Pragyan rover successfully deployed and detected sulfur, aluminum, calcium, iron, titanium, and oxygen on the lunar surface, confirming critical elemental compositions with frugal engineering excellence.`,
    readTime: '3 min read',
    keyFact: 'August 23 is now officially celebrated annually in India as National Space Day.',
  },
  {
    id: 'k-2',
    title: 'Aryabhata, Zero, and the Roots of Modern Mathematics',
    category: 'Indian History',
    summary: 'The revolutionary contribution of ancient Indian mathematicians to the place-value decimal system and astronomical calculation.',
    fullContent: `In the 5th century CE, the legendary mathematician-astronomer Aryabhata composed the Aryabhatiya in Pataliputra (modern Patna). He approximated Pi (π) to 3.1416, declared that the Earth rotates on its own axis daily, and accurately calculated the solar year to 365.358 days.
    
    Concurrently, Indian scholars formalized the concept of Shunya (zero) not merely as an empty placeholder, but as a fully operating number with its own mathematical rules (formalized by Brahmagupta in 628 CE), forming the indispensable bedrock of modern digital computing.`,
    readTime: '4 min read',
    keyFact: 'Without zero and the decimal positional system, modern computer binary code would be mathematically impossible.',
  },
  {
    id: 'k-3',
    title: 'How Neural Networks & Artificial Intelligence Actually Learn',
    category: 'AI & Innovation',
    summary: 'A clear, intuitive look at backpropagation, weights, and transformer models driving the modern AI revolution.',
    fullContent: `Artificial Neural Networks are inspired by biological brain neurons. When a model processes an image or text, it passes data through layers of interconnected mathematical nodes (weights and biases).
    
    During training, the system compares its prediction against the known ground truth, calculates the error (loss function), and uses an optimization algorithm called Gradient Descent with Backpropagation to subtly tweak billions of internal parameters. 
    
    The revolutionary 2017 'Transformer' architecture introduced Self-Attention, allowing models to weigh the context of all words in a sentence simultaneously rather than word-by-word.`,
    readTime: '4 min read',
    keyFact: 'Modern large models contain hundreds of billions of parameters fine-tuned through mathematical gradient updates.',
  },
  {
    id: 'k-4',
    title: 'The Miraculous Physics of James Webb Space Telescope',
    category: 'Science',
    summary: 'Unveiling how infrared gold mirrors allow astronomers to peer over 13.5 billion years into the earliest cosmic dawn.',
    fullContent: `The James Webb Space Telescope (JWST) orbits the Sun at Lagrange Point 2 (L2), 1.5 million kilometers from Earth. Because the expansion of the universe stretches light from distant ancient stars into the infrared spectrum (cosmological redshift), JWST was equipped with 18 hexagonal beryllium mirrors plated with a microscopic layer of pure 24-karat gold.
    
    Its 5-layer tennis-court-sized sunshield keeps instruments chilled below -233°C (-388°F), allowing it to capture sharp images of galaxies formed just 300 million years after the Big Bang.`,
    readTime: '3 min read',
    keyFact: 'The gold plating on all 18 primary mirrors combined uses only about 48 grams of gold, thinner than human hair!',
  },
  {
    id: 'k-5',
    title: 'The Great Living Chola Temples: Granite Engineering Wonders',
    category: 'Indian History',
    summary: 'How Tamil builders erected the 66-meter Brihadeeswarar Temple in 1010 CE without mortar or modern cranes.',
    fullContent: `Constructed by Raja Raja Chola I in Thanjavur, the Brihadisvara Temple remains one of the greatest architectural accomplishments in world history. Built entirely from 130,000 tons of hard granite in a region with no natural granite quarries for 50 miles, the temple's Vimana (tower) rises 66 meters.
    
    Atop the tower sits an 80-ton single block of granite dome (Kumbam). Historians believe it was rolled to the top using a 6-kilometer inclined ramp supported by elephants and timber scaffolds, standing intact for over 1,000 years through major earthquakes.`,
    readTime: '4 min read',
    keyFact: 'The temple was assembled with interlocking dry-stone masonry with zero cement or mortar.',
  },
  {
    id: 'k-6',
    title: 'The Science of Gratitude: How Kindness Rewires the Brain',
    category: 'Inspirational Stories',
    summary: 'Neuroscience findings on how regular appreciation and gift-giving enhance neuroplasticity and emotional longevity.',
    fullContent: `Clinical neuroscience demonstrates that expressing sincere gratitude releases dopamine and serotonin—two neurotransmitters responsible for happiness, bonding, and emotional resilience.
    
    Studies conducted at Harvard and UC Berkeley showed that individuals who maintain a gratitude practice or engage in selfless acts of giving experience lower cortisol (stress hormone) levels, improved cardiovascular health, and stronger social cohesion. In giving a gift, the giver often experiences equal or greater neurological reward than the recipient.`,
    readTime: '3 min read',
    keyFact: 'Brain scans reveal increased activation in the prefrontal cortex for weeks after practicing intentional kindness.',
  },
];

// -------------------------------------------------------------
// 6. FUN ZONE & GAMES DATA
// -------------------------------------------------------------
export const BRAIN_TEASERS: BrainTeaser[] = [
  {
    id: 1,
    question: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
    hint: 'Think about mountainous canyons or empty halls.',
    answer: 'An Echo',
    explanation: 'An echo has no mouth or physical body, yet reflects sound waves back when carried across spaces.',
  },
  {
    id: 2,
    question: 'You see a boat filled with people. It has not sunk, but when you look again you don’t see a single person on the boat. Why?',
    hint: 'Pay close attention to the word "single".',
    answer: 'All the people on the boat were married!',
    explanation: 'Every individual on the boat was married, so there was not a "single" person aboard.',
  },
  {
    id: 3,
    question: 'The more you take, the more you leave behind. What are they?',
    hint: 'You make them with your feet as you walk.',
    answer: 'Footsteps',
    explanation: 'Every step you take leaves another footstep behind you on the path.',
  },
  {
    id: 4,
    question: 'What belongs to you, but other people use it much more than you do?',
    hint: 'It was given to you when you were born.',
    answer: 'Your Name',
    explanation: 'Your name belongs exclusively to your identity, yet others use it continuously to address you.',
  },
  {
    id: 5,
    question: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?',
    hint: 'Sailors and explorers use me to navigate.',
    answer: 'A Map',
    explanation: 'A geographical map illustrates cities, elevations, and oceans without physical inhabitants.',
  },
];

export const GK_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which is the oldest known mountain range in India?',
    options: ['Himalayan Range', 'Aravalli Range', 'Western Ghats', 'Satpura Range'],
    correctIndex: 1,
    explanation: 'The Aravalli Range is one of the oldest geological mountain ranges in the world, dating back to the Proterozoic eon.',
  },
  {
    id: 2,
    question: 'What is the speed of light in vacuum?',
    options: ['150,000 km/s', '300,000 km/s', '450,000 km/s', '30,000 km/s'],
    correctIndex: 1,
    explanation: 'Light travels at approximately 299,792 kilometers per second (commonly rounded to 300,000 km/s) in a vacuum.',
  },
  {
    id: 3,
    question: 'Which river is known as the "Dakshin Ganga" (Ganges of the South)?',
    options: ['Krishna', 'Kaveri', 'Godavari', 'Narmada'],
    correctIndex: 2,
    explanation: 'The Godavari is referred to as Dakshin Ganga because of its large basin, sacred status, and extensive length.',
  },
  {
    id: 4,
    question: 'Who is recognized as the father of the Indian Space Program?',
    options: ['Dr. A.P.J. Abdul Kalam', 'Dr. Vikram Sarabhai', 'Dr. Homi Bhabha', 'Prof. Satish Dhawan'],
    correctIndex: 1,
    explanation: 'Dr. Vikram Sarabhai spearheaded the establishment of ISRO and the Thumba Equatorial Rocket Launching Station.',
  },
  {
    id: 5,
    question: 'What is the national motto of India inscribed below the National Emblem?',
    options: ['Jai Hind', 'Vande Mataram', 'Satyameva Jayate', 'Jan Gan Man'],
    correctIndex: 2,
    explanation: '"Satyameva Jayate" (Truth Alone Triumphs) is taken from the sacred Mundaka Upanishad.',
  },
];

export const FRIENDSHIP_QUOTES: string[] = [
  '"A real friend is one who walks in when the rest of the world walks out." — Walter Winchell',
  '"Friendship is born at that moment when one person says to another: What! You too? I thought I was the only one." — C.S. Lewis',
  '"There is nothing on this earth more to be prized than true friendship." — Thomas Aquinas',
  '"In the sweetness of friendship let there be laughter, and sharing of pleasures." — Khalil Gibran',
  '"A true friend warms you with their presence, trusts you with their secrets, and remembers you in their prayers." — Traditional Proverb',
  '"The greatest gift of life is friendship, and I have received it." — Hubert H. Humphrey',
  '"Good friends are like stars; you do not always see them, but you know they are always there."',
  '"A sweet friendship refreshes the soul." — Proverbs 27:9',
];

export const DAILY_SURPRISES = [
  {
    title: '🌟 Daily Wisdom',
    content: 'When you arise in the morning, think of what a precious privilege it is to be alive—to breathe, to think, to enjoy, to love.',
    author: 'Marcus Aurelius',
  },
  {
    title: '🧠 Fascinating Fact',
    content: 'Honey found in ancient Egyptian tombs over 3,000 years old is still completely preserved and edible due to low moisture and natural acidity.',
    author: 'Archaeological Science',
  },
  {
    title: '💝 Friendship Reflection',
    content: 'Reach out to one friend you haven’t spoken with in a while today. A short 2-minute message can brighten their entire week.',
    author: 'Welcome Gift Daily Tip',
  },
  {
    title: '🕊️ Peaceful Thought',
    content: 'Peace comes from within. Do not seek it without. A quiet mind sees reality with crystalline clarity.',
    author: 'Buddha',
  },
];
