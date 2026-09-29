import {
  ArrowUpDown, Award, Baby, BadgeCheck, Building2, Bus, Cake, CalendarCheck, CalendarHeart, Car, Cctv, Dumbbell,
  Eye, Factory, FileCheck, Flame, Flower2, Footprints, Gamepad2, Gem, GraduationCap, Handshake, HardHat, HeartHandshake,
  HeartPulse, House, Image, KeyRound, Landmark, Leaf, Lightbulb, Maximize, MessageSquare, PiggyBank, Plug, Route,
  Scale, Shield, ShieldCheck, Sparkles, Stethoscope, Store, Target, Trees, TrendingUp, Trophy, Truck, UserCheck, Users,
  Utensils, Wallet, Waves, Zap, TrainFront, ShoppingBag, Hospital, School, Navigation, Sprout, Tent, Puzzle, Presentation,
  Telescope, Armchair, Droplets, Sofa, Phone, DoorOpen, CookingPot, Ruler, MoveHorizontal, Package, Layers, Sun, IndianRupee,
  Bed, Bath, type LucideProps,
} from "lucide-react";

const MAP = {
  "arrow-up-down": ArrowUpDown, award: Award, baby: Baby, "badge-check": BadgeCheck, building: Building2, bus: Bus,
  cake: Cake, "calendar-check": CalendarCheck, "calendar-heart": CalendarHeart, car: Car, cctv: Cctv, dumbbell: Dumbbell,
  eye: Eye, factory: Factory, "file-check": FileCheck, flame: Flame, flower: Flower2, footprints: Footprints,
  gamepad: Gamepad2, gem: Gem, "graduation-cap": GraduationCap, handshake: Handshake, "hard-hat": HardHat,
  "heart-handshake": HeartHandshake, "heart-pulse": HeartPulse, home: House, image: Image, "key-round": KeyRound,
  landmark: Landmark, leaf: Leaf, lightbulb: Lightbulb, maximize: Maximize, "message-square": MessageSquare,
  "piggy-bank": PiggyBank, plug: Plug, route: Route, scale: Scale, shield: Shield, "shield-check": ShieldCheck,
  sparkles: Sparkles, stethoscope: Stethoscope, store: Store, target: Target, trees: Trees, "trending-up": TrendingUp,
  trophy: Trophy, truck: Truck, "user-check": UserCheck, users: Users, utensils: Utensils, wallet: Wallet, waves: Waves,
  zap: Zap, transport: TrainFront, shopping: ShoppingBag, health: Hospital, education: School, road: Navigation, park: Trees,
  sprout: Sprout, tent: Tent, puzzle: Puzzle, presentation: Presentation, telescope: Telescope, armchair: Armchair,
  droplets: Droplets, sofa: Sofa, phone: Phone, "door-open": DoorOpen, "cooking-pot": CookingPot, ruler: Ruler,
  "move-horizontal": MoveHorizontal, package: Package, layers: Layers, sun: Sun, "indian-rupee": IndianRupee, bed: Bed, bath: Bath,
} as const;

export type IconName = keyof typeof MAP;

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const C = MAP[name as IconName] ?? Sparkles;
  return <C aria-hidden strokeWidth={1.5} {...props} />;
}
