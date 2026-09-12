export type Project = {
  slug: string;
  cardLabel: string;
  subtitle: string;
  comingSoon: boolean;
  href?: string;
  image?: string;
  tags?: string[];
};

// TODO(sylvia): replace with real tags per project.
const PLACEHOLDER_TAGS = ["Placeholder tag", "2026"];

export const projects: Project[] = [
  {
    slug: "halogrip",
    cardLabel: "01 / Robotaxi Emergency Steering",
    subtitle: "Emergency steering for autonomous vehicles",
    comingSoon: false,
    href: "/work/halogrip",
    image: "/home/projects/halogrip-cover.png",
    tags: PLACEHOLDER_TAGS,
  },
  {
    slug: "maritime-hmi",
    cardLabel: "02 / Maritime HMI Design",
    subtitle: "Remote operations for autonomous passenger ferries",
    comingSoon: false,
    href: "/work/maritime-hmi",
    image: "/maritime-hmi/roc/operators-hero.webp",
    tags: ["Remote operations", "Interface design", "2026"],
  },
  {
    slug: "volvo",
    cardLabel: "03 / Truck Sensory Design",
    subtitle: "AURORA: light, sound and connection for life on the road",
    comingSoon: false,
    href: "/work/volvo",
    image: "/volvo/assets/aurora-cab.webp",
    tags: ["Sensory design", "User research", "2022"],
  },
  {
    slug: "post-harvest",
    cardLabel: "04 / Post Harvest",
    subtitle: "Rethinking maize drying with farmers in Seme",
    comingSoon: false,
    href: "/work/post-harvest",
    image: "/home/projects/corn-hands.jpg",
    tags: ["Field research", "Concept development", "2024"],
  },
];
