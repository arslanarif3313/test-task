export const TEAM_PROFILES = ["Faizan Shafqat", "Arslan Arif"] as const;

export type TeamProfile = (typeof TEAM_PROFILES)[number];

export const isKnownProfile = (name: string): name is TeamProfile =>
  TEAM_PROFILES.includes(name as TeamProfile);
