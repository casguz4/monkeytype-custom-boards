type TypingStats = {
  completedTests: number;
  startedTests: number;
  timeTyping: number;
};
type TimeStats = {
  acc: number;
  consistency: number;
  difficulty: "normal" | "expert" | "master";
  lazyMode: false;
  language: string;
  punctuation: false;
  raw: number;
  wpm: number;
  numbers: false;
  timestamp: number;
};
type Time = Record<"15" | "30" | "60" | "120", TimeStats[]>;
type Words = Record<"10" | "25" | "50" | "100", TimeStats[] | []>;
// eslint-disable-next-line  @typescript-eslint/no-unused-vars
type UserProfile = {
  name: string;
  addedAt: number;
  typingStats: TypingStats;
  personalBests: {
    time: Time;
    words: Words;
  };
  xp: number;
  streak: number;
  maxStreak: number;
  isPremium: boolean;
  allTimeLbs: {
    time: Time;
  };
  uid: string;
};
