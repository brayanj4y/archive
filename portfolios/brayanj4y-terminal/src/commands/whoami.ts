// whoami.ts
export interface WhoamiQuestion {
  hints: string[];
  answer: string;
}

export const WHOAMI_QUESTIONS: WhoamiQuestion[] = [
  {
    hints: [
      "I live in a castle,",
      "wear a crown,",
      "and rule my kingdom —"
    ],
    answer: "king"
  },
  {
    hints: [
      "I swing from buildings,",
      "save the city,",
      "and wear a mask —"
    ],
    answer: "spiderman"
  },
  {
    hints: [
      "I solve mysteries,",
      "have a faithful sidekick,",
      "and roam the night —"
    ],
    answer: "batman"
  },
  {
    hints: [
      "I’m green and smash things,",
      "but have a soft side,",
      "you better watch out —"
    ],
    answer: "hulk"
  },
  {
    hints: [
      "I travel through space,",
      "have a trusty lightsaber,",
      "and fight the dark side —"
    ],
    answer: "luke skywalker"
  },
];

// helper to format hints for terminal
export const formatWhoamiHints = (question: WhoamiQuestion): string[] => {
  const hints = [...question.hints];
  hints[hints.length - 1] += "<span class='command'> Who am I?</span>";
  hints.unshift("<br>");
  hints.push("<br>");
  return hints;
};
