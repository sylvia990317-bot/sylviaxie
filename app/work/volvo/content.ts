/**
 * Sources: public/volvo/Portfolio_C4.pdf, the 2022 Chalmers report and
 * Slutpresentation_kandidatarbetet.pptx. Page references below are PDF page indices.
 * Sylvia confirmed 2022 and participation across all phases in a team of five.
 * Concept intentions must never be presented as measured health or safety outcomes.
 */
export const asset = (name: string) => `/volvo/assets/${name}`;

export const project = {
  title: "AURORA",
  tagline: "Alone, but not lonely.",
  description: "Light, sound and a sense of connection for life inside a long-haul truck.",
  meta: [
    { label: "Collaboration", value: "Chalmers × Volvo Trucks" },
    { label: "Project", value: "Bachelor’s thesis / 2022" },
    { label: "Team", value: "Five design students" },
    { label: "My role", value: "Research, analysis & concept development" },
  ],
};

export const chapters = [
  { id: "research", label: "Research" },
  { id: "development", label: "Development" },
  { id: "concept", label: "Concept" },
  { id: "reflection", label: "Reflection" },
];

export const brief = {
  title: "A workplace. A living space.",
  body: [
    "Volvo Trucks asked us to explore an interior environment for future electric long-haul trucks that would appeal to the next generation of drivers.",
    "For someone spending days away from home, the cab is more than a place to drive. It is where they eat, unwind and sleep. Our starting point was to understand what life in that space asks of people, and what young people would want from it.",
  ],
  question: "How could the cab support the person beyond the driving task?",
};

// Report pp. 43–47 and portfolio pp. 6–7. These are distinct samples, not a total.
export const research = {
  title: "Two groups, one future cab.",
  intro: "Today’s drivers understand the realities of the job. Tomorrow’s drivers bring a different set of expectations. We needed to hear from both.",
  groups: [
    {
      name: "Today’s drivers", tag: "The lived experience", image: "driver.webp",
      width: 1200, height: 800, alt: "A truck driver at the wheel, in a Volvo Trucks photograph",
      question: "What does living and working on the road feel like?",
      findings: [
        "Time away can make it difficult to take part in everyday family life.",
        "Drivers personalise the cab to make a small, shared space feel like their own.",
        "Rest stops and evenings bring different needs from the hours spent driving.",
      ],
    },
    {
      name: "Tomorrow’s drivers", tag: "The next generation", image: "young-people.webp",
      width: 988, height: 1476, alt: "Two young people outdoors, a reference photograph from the project presentation",
      question: "What would make this a life they could imagine choosing?",
      findings: [
        "Being away from family was a barrier to considering long-haul driving as a lasting career.",
        "Digital contact was familiar, but staying connected still mattered.",
        "A sense of belonging and opportunities for personalisation shaped our direction.",
      ],
    },
  ],
  methods: [
    { number: "7", label: "Experienced drivers interviewed" },
    { number: "9", label: "Transport students interviewed" },
    { number: "4", label: "Cab observations" },
  ],
  synthesis: "We grouped interview and survey responses in separate KJ analyses, then compared the patterns. This helped us connect the realities of the profession with the expectations of its future drivers.",
  caption: "Original KJ analysis of driver research. Responses were grouped into themes such as social connection, safety, hygiene and life in the cab.",
  surveys: "The initial surveys received 109 responses from young people and 124 from drivers. A separate follow-up on loneliness received 47 driver responses. These were separate studies; the counts do not represent unique participants across the project.",
};

export const focus = {
  title: "Being alone is not always feeling lonely.",
  intro: "Our research opened up six problem areas. In discussion with Volvo, we chose loneliness as a focus: it connected current drivers’ experiences with young people’s concerns, and offered room to rethink the interior.",
  areas: ["Perception of the profession", "Safety", "Hygiene & access to water", "Cab layout & interior", "Work environment", "Loneliness"],
  distinctions: [
    { title: "Being alone", subtitle: "Objective isolation", body: "Distance from family and friends is part of long-haul work. We explored ways to make everyday contact easier while away." },
    { title: "Feeling lonely", subtitle: "Subjective loneliness", body: "The feeling varies between people and situations. We explored how a more familiar, comfortable cab could support emotional wellbeing." },
  ],
  conclusion: "Two design intentions: a place that feels more like home, and small moments of connection with the people who matter.",
  context: "Drivers described evenings and nights, when the truck was parked, as particularly lonely moments. This shifted our attention toward life between journeys.",
};

// Report pp. 49–50, 67–71: 17-person concept survey did not identify a clear
// semantic-scale winner. Final selection combined evidence and Volvo discussions.
export const development = {
  title: "Atmosphere meets connection.",
  intro: "We explored four approaches to loneliness: family life, mood, a community of drivers, and stimulation during time off. Brainstorming and concept comparison brought us to four proposals.",
  approaches: ["Family life", "Mood", "Community", "Stimulation"],
  concepts: [
    { name: "LUX", purpose: "Change the atmosphere", body: "Integrated lighting that gives the cab a sense of space and lets drivers choose a setting that feels right.", image: "concept-lux.webp", alt: "LUX concept sketch showing blue lighting around a truck cab", width: 1107, height: 761 },
    { name: "InMotion", purpose: "Change the surroundings", body: "Screens and sound bring moving patterns and nature-inspired environments into the cab.", image: "concept-inmotion.webp", alt: "InMotion concept sketch with forest imagery across cab surfaces", width: 1143, height: 783 },
    { name: "InTouch", purpose: "Take part in home life", body: "A communication platform with shared calendars, video calls and ways to join everyday family activities.", image: null, alt: "", width: 0, height: 0 },
    { name: "Embrace", purpose: "Send a feeling", body: "A wearable concept using warmth, light and vibration to send a subtle greeting between loved ones.", image: "concept-embrace.webp", alt: "Embrace concept sketches showing a greeting bracelet on a driver’s wrist", width: 1846, height: 881 },
  ],
  decision: "LUX + Embrace → AURORA",
  reasoning: "A 17-person concept survey and discussions with Volvo helped us evaluate the directions. Ratings were similar across the four proposals, so we looked beyond a single score. We combined LUX’s atmosphere with Embrace’s idea of a felt greeting, bringing both intentions into the cab itself.",
  tradeoff: "InTouch also attracted interest, but comparable communication tools already existed. Combining environmental lighting with non-verbal contact gave us a more distinctive direction to develop.",
};

export const themes = [
  { id: "northern-lights", name: "Northern lights", color: "#68a99a", title: "A still winter night.", body: "Blue-green light moves through the cab, taking its cue from the northern lights. In the written concept, this theme is silent.", image: "mood-northern-lights.webp", nature: "nature-northern-lights.webp", natureAlt: "Green northern lights above a mountain landscape", sound: "No sound in the written concept" },
  { id: "fire", name: "Fire", color: "#cf8950", title: "The warmth of a fireside.", body: "Glowing reds, oranges and yellows suggest a fireplace or campfire. The proposed crackling sound adds a familiar setting after a day on the road.", image: "mood-fire.webp", nature: "nature-fire.webp", natureAlt: "Orange flames and glowing logs in a fire", sound: "Proposed sound: a crackling fire" },
  { id: "forest", name: "Forest", color: "#779568", title: "Light through the trees.", body: "Deep green and shifting white light echo sunlight through a canopy. Wind, birds and rain were proposed as the accompanying sounds.", image: "mood-forest.webp", nature: "nature-forest.webp", natureAlt: "Sunlight filtering through a green forest canopy", sound: "Proposed sound: wind, birds and rain" },
  { id: "sea", name: "Sea", color: "#648da8", title: "A moment by the water.", body: "Variations of blue light take inspiration from the sea. The concept pairs them with the sound of waves to suggest calm and stillness.", image: "mood-sea.webp", nature: "nature-sea.webp", natureAlt: "Ripples across deep blue sea water", sound: "Proposed sound: waves" },
  { id: "sunset", name: "Sunset", color: "#b58087", title: "Time to wind down.", body: "Warm orange, pink and violet tones evoke the end of the day. Birds and crickets were proposed to accompany the transition into rest.", image: "mood-sunset.webp", nature: "nature-sunset.webp", natureAlt: "Pink, violet and orange clouds at sunset", sound: "Proposed sound: birds and crickets" },
];

export const modes = {
  title: "A cab that adapts to life on the road.",
  intro: "AURORA brings light, sound and non-verbal communication into one interior concept. Four modes support different parts of the day; a fifth feature carries a greeting from someone close.",
  default: "The proposed default mode shifts from cool morning light to warmer, dimmer light in the evening. It explores how the cab could support a daily rhythm, rather than keep the same atmosphere all day.",
  secondary: [
    { name: "Activity mode", title: "Make time off feel different.", body: "During entertainment, the proposed light strips pick up colours from the screen and the cab speakers carry the sound. The intention is to make a break feel more immersive." },
    { name: "Driving mode", title: "Let the driving task come first.", body: "The concept automatically dims the selected lighting and switches off dashboard lighting while driving. This is a design intention to limit distraction; it still needs testing in use." },
  ],
};

export const greeting = {
  title: "A greeting you can feel.",
  intro: "A small signal that someone is thinking of you. The greeting translates a message from a loved one into a movement of light through the space around the driver.",
  steps: [
    { title: "Someone sends a thought.", body: "A heart message from a contact chosen by the driver triggers the proposed greeting." },
    { title: "The cab carries it to you.", body: "Red light travels forward and gathers around the steering wheel. A brief sound and warmth in the wheel are proposed to add a sense of touch." },
    { title: "Send a greeting back.", body: "The driver could reply by voice, keeping the phone out of their hands." },
  ],
  caption: "Original concept animation: light moves from the sleeping area toward the driver. It illustrates the visual sequence; warmth, messaging and voice control were proposed features, not a working prototype.",
};

// Report pp. 51 and 82: 32 respondents, 59% long-haul; >90% preferred availability.
export const evaluation = {
  title: "An encouraging response. More to learn.",
  statistic: "90%+",
  statisticLabel: "would prefer to have the concept available in their cab",
  sample: "Final concept survey · 32 respondents · 59% long-haul drivers",
  body: "The final survey asked drivers to respond to visualisations and descriptions. The response showed interest in the concept, but it did not measure a change in loneliness, sleep or driving performance.",
  next: [
    { title: "Build it in a cab", body: "Prototype the placement, brightness and transitions of the light, alongside the sound and warmth of a greeting." },
    { title: "Evaluate it in use", body: "Study distraction and comfort during driving, then explore everyday experience over a longer period." },
    { title: "Design the controls", body: "Develop and test how settings could fit into the existing cab display and voice interaction." },
  ],
  reflection: "This project taught me to work with uncertainty before rushing toward a solution. Connecting drivers’ everyday experiences with a younger generation’s expectations helped me see how research can turn an open brief into a specific design direction. Translating an emotional need into something tangible strengthened my interest in user research.",
  team: "Lydia Antblad, Tea Emilsson, Vera Isaksson, Amanda Olsby and Sylvia Xie.",
};
