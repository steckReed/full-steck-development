import { AnimationDefinition, Target, TargetAndTransition, VariantLabels } from 'framer-motion';

export interface ProjectsProps {
  name          : string;
  desc          : string;
  ribbon        : string;
  url           : string;
  github        ?: string;
  status        ?: string;
  referenceLink ?: string;
  tags          ?: string[];
}

export interface MTGCardProps {
  object: string;
  id: string;
  oracle_id: string;
  multiverse_ids: number[];
  mtgo_id: number;
  arena_id:number;
  tcgplayer_id: number;
  cardmarket_id: number;
  name: string;
  lang: string;
  released_at: string;
  uri: string;
  scryfall_uri: string;
  layout: string;
  highres_image: boolean;
  image_status: string;
  image_uris: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  mana_cost: string;
  cmc: number;
  type_line: string;
  oracle_text: string;
  power: string;
  toughness: string;
  colors: string[];
  color_identity: string[];
  keywords: string[];
  legalities: {
    [key: string]: string;
  };
  games: string[];
  reserved: boolean;
  foil: boolean;
  nonfoil: boolean;
  finishes: string[];
  oversized: boolean;
  promo: boolean;
  reprint: boolean;
  variation: boolean;
  set_id: string;
  set: string;
  set_name: string;
  set_type: string;
  set_uri: string;
  set_search_uri: string;
  scryfall_set_uri: string;
  rulings_uri: string;
  prints_search_uri: string;
  collector_number: string;
  digital: boolean;
  rarity: string;
  card_back_id: string;
  artist: string;
  artist_ids: string[];
  illustration_id: string;
  border_color: string;
  frame: string;
  frame_effects: string[];
  security_stamp:string;
  full_art: boolean;
  textless: boolean;
  booster: boolean;
  story_spotlight: boolean;
  edhrec_rank: number;
  preview: {
    source: string;
    source_uri: string;
    previewed_at: string;
  };
  prices: {
    usd: string;
    usd_foil: string;
    usd_etched: string | null;
    eur: string;
    eur_foil: string;
    tix: string;
  };
  related_uris: {
    gatherer: string;
    tcgplayer_infinite_articles: string;
    tcgplayer_infinite_decks: string;
    edhrec: string;
  };
  purchase_uris: {
    tcgplayer: string;
    cardmarket: string;
    cardhoarder: string;
  };
  
  all_parts?: RelatedMTGCardProps[];
}

interface RelatedMTGCardProps {
  object: string;
  id: string;
  component: string;
  name: string;
  type_line: string;
  uri: string;
}

interface AnimationStep {
  animate     ?: AnimationDefinition;
  transition  ?: any; // Transition$1
}

export interface AnimationSequence {
  animStartOn : string;
  animations  : AnimationStep[]
  id          ?: string;
  initial     ?: boolean | Target | VariantLabels;
  exit        ?: TargetAndTransition | VariantLabels;
}


export interface AgileTimelineTicketsProps {
  id            : string;
  size          : TicketSizes;
  status        : TicketTypes;
  text          : string;
  loadingBarId  ?: string;
}


export type TicketTypes = 'not started' | 'working on it' | 'on hold' | 'completed';
export type TicketSizes = 'lg' | 'sm';

interface TicketStatusInfo {
  color : string;
  desc  : string;
}

export const TicketStatusMap: Record<TicketTypes, TicketStatusInfo> = {
  'not started': {
    color : '#F9F7F4',
    desc  : 'Not Started ⏳',
  },
  'working on it': {
    color : '#F7630C',
    desc  : 'Working on it 🚀',
  },
  'on hold': {
    color : '#E81224',
    desc  : 'On Hold ⛔',
  },
  'completed': {
    color : '#16C60C',
    desc  : 'Completed 🎉',
  },
};

export interface VersionControlTicket {
  ticketNum: string;
  text: string;
  triggerKey: string;
  triggerDelay: number;
  status: TicketTypes[];
}

export interface VersionControlTickets {
  [key: string]: VersionControlTicket;
}
