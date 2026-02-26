export type QuestionType = {
  id: string;
  question: string;
  helpPhrases: string[];
  answers: string[];
  difficulty: DIFFICULTY;
};

export enum DIFFICULTY {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export const ROOM_INTRO_MESSAGE = {
  playground: "Let's look at the playground",
  bathroom: "Let's look at the picture here.",
  letter: "Let's look at these letters.",
};

export const GENERAL_TEXT = {
  greeting:
    "Hello! I'm so happy to see you! Would you like to play a game with me?",
  "refuse-to-play": "Aww, maybe next time! Have a great day!",
  "did-not-catch":
    "I didn't quite catch that. Do you want to play a game with me?",
  congratulations:
    "Wow! You did amazing! You're so smart! Great job playing with me!",
  "lets-start": "Yay! Let's start the game",
  "play-more": "Wow! You did amazing! Great job! Do you want to play more?",
};

export const DIFFICULTY_TRANSITION_MESSAGES = {
  "easy-to-medium": "Let's try some tougher questions.",
  "medium-to-hard": "How about we switch it up a bit.",
  "medium-to-easy": "Why don't we try an easier question?",
  "hard-to-medium": "Let's try some simpler questions?",
};

export const QUESTIONS = {
  playground: [
    {
      question: "How many children do you see?",
      helpPhrases: ["There are four children. Can you say four?"],
      answers: ["four", "4", "fore", "fall"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "What color is the grass?",
      helpPhrases: ["The grass is green."],
      answers: ["green"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "How many trees do you see?",
      helpPhrases: ["There are two trees, can you say two"],
      answers: ["two", "2", "too", "to"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "What color is the sky?",
      helpPhrases: ["The sky is blue, can you say blue?"],
      answers: ["blue", "blew", "blu"],
      difficulty: DIFFICULTY.MEDIUM,
    },
        {
      question: "What is the puppy playing with?",
      helpPhrases: ["The puppy is playing with a ball, did i hear you say bal"],
      answers: ["ball", "bawl", "bale", "bowl", "bored", "bore", "gold", "bull", "call", "gall"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "What color is the slide?",
      helpPhrases: ["Not quite!, the slide is orange, can you say orange?"],
      answers: ["orange", "red", "range", "arrange", "door hinge"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "What are the children building in the sandbox?",
      helpPhrases: ["They are building a sandcastle, can you say sandcastle?"],
      answers: ["castle", "sandcastle", 'sand castle', "kasu", "ekasu", "picasso"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "Is there a girl or a boy on the swing?",
      helpPhrases: ["A girl is on the swing, can you say girl?"],
      answers: ["girl", "a girl", "gurl", "grill", "curl"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What is the girl in the sandbox wearing on her head?",
      helpPhrases: ["She is wearing a hat, can you say hat?"],
      answers: ["hat", "a hat", "hatted", "hatter", "hatterr", "at", "at", "heart", "hot", "that", "hut"],
      difficulty: DIFFICULTY.HARD,
    },
  ].map((q, i) => ({ ...q, id: `q${i + 1}` })),

  bathroom: [
    {
      question: "What room is this?",
      helpPhrases: ["Not really, this a a bathroom, did i hear you say bathroom?"],
      answers: ["bathroom", "bath room", "bathroom room"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "What is the girl doing?",
      helpPhrases: ["No, the girl is brushing, can you say brushing?"],
      answers: ["brushing", "brushing teeth", "brushing her teeth", "brushing the teeth", "brushing tooth", "brushing her tooth"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "What toy is floating in the tub?",
      helpPhrases: ["Not quite!, the toy in the tub is a rubber duck, can you say rubber duck?"],
      answers: ["duck" , "toy", "rubber duck", "rubber ducky", "duck toy", "duck in the tub", "suck"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "How many towels are on the wall?",
      helpPhrases: ["There are two towels did i hear you say two?"],
      answers: ["two", "2", "too", "to"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "Where do you take a bath?",
      helpPhrases: ["Not quite!, you take a bath in a bathtub, can you say bathtub?"],
      answers: ["bathtub", "tub", "bath", "bath tub", "bathroom tub"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "What do you use to go potty?",
      helpPhrases: ["Not really!, You use a toilet, can you say toilet?"],
      answers: ["toilet", "potty"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "What do you wash your hands in?",
      helpPhrases: ["You wash your hands in a sink, can you say sink?"],
      answers: ["sink"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What do you turn on for water?",
      helpPhrases: ["You turn on the faucet, can you say faucet?"],
      answers: ["faucet", "tap", "water faucet", "sink faucet"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What is the girl standing on?",
      helpPhrases: ["She is standing on a stool, did i hear you say stool?"],
      answers: ["stool", "a stool", "stool in the bathroom", "bathroom stool"],
      difficulty: DIFFICULTY.HARD,
    },
  ].map((q, i) => ({ ...q, id: `q${i + 1}` })),
  letter: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter, i) => ({
    id: `q${i + 1}`,
    question: `Now find the letter ${letter}`,
    difficulty: i < 8 ? DIFFICULTY.EASY : i < 16 ? DIFFICULTY.MEDIUM : DIFFICULTY.HARD,
    helpPhrases: [
      `Try again! Look for ${letter}.`,
      `Not quite.Find the letter ${letter}.`,
      `Keep looking for ${letter}!`,
    ],
    answers: [`${letter}`],
  })),
};
