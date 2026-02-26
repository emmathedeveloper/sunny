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

export type QuestionType = {
  id: string;
  question: string;
  helpPhrases: string[];
  answers: string[];
  difficulty: DIFFICULTY;
};

export enum DIFFICULTY {
  EASY,
  MEDIUM,
  HARD,
}

export const QUESTIONS = {
  playground: [
    // the easy one eve
    {
      question: "How many children do you see?",
      helpPhrases: ["There are four children. Can you say four?"],
      answers: ["four", "4"],
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
      helpPhrases: ["There are two trees."],
      answers: ["two", "2"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "What color is the sky?",
      helpPhrases: ["The sky is blue."],
      answers: ["blue"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "Is the sun out?",
      helpPhrases: ["Yes, the sun is shining."],
      answers: ["yes"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "Is there a dog?",
      helpPhrases: ["Yes, there is a dog."],
      answers: ["yes"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "What is the puppy playing with?",
      helpPhrases: ["The puppy is playing with a ball."],
      answers: ["ball"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "Are the children happy?",
      helpPhrases: ["Yes, they are happy."],
      answers: ["yes"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "Is the slide big?",
      helpPhrases: ["Yes, it is big."],
      answers: ["yes"],
      difficulty: DIFFICULTY.EASY,
    },

    // the medium one eve
    {
      question: "What color is the slide?",
      helpPhrases: ["The slide is orange."],
      answers: ["orange"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "What are the children building?",
      helpPhrases: ["They are building a sandcastle."],
      answers: ["castle", "sandcastle"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "Who is on the swing?",
      helpPhrases: ["A girl is on the swing."],
      answers: ["girl"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "Where is the puppy?",
      helpPhrases: ["The puppy is on the grass."],
      answers: ["grass"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "What are the children playing on?",
      helpPhrases: ["They are playing on the playground."],
      answers: ["playground"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "Is the sandbox full of sand?",
      helpPhrases: ["Yes, it is full of sand."],
      answers: ["yes"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "What do you use to slide down?",
      helpPhrases: ["You use the slide."],
      answers: ["slide"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "Are the trees tall?",
      helpPhrases: ["Yes, the trees are tall."],
      answers: ["yes"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "What is under the trees?",
      helpPhrases: ["Grass is under the trees."],
      answers: ["grass"],
      difficulty: DIFFICULTY.MEDIUM,
    },

    // the hard one eve
    {
      question: "What is the girl in the sandbox wearing?",
      helpPhrases: ["She is wearing a hat."],
      answers: ["hat"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What are the children using to build?",
      helpPhrases: ["They are using buckets."],
      answers: ["bucket", "buckets"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "Is the playground busy or empty?",
      helpPhrases: ["It is busy."],
      answers: ["busy"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What shape is the ball?",
      helpPhrases: ["The ball is round."],
      answers: ["round"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What do you call a small dog?",
      helpPhrases: ["A small dog is called a puppy."],
      answers: ["puppy"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "Why are the children smiling?",
      helpPhrases: ["Because they are having fun."],
      answers: ["fun"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What do you wear to protect your head?",
      helpPhrases: ["You wear a hat."],
      answers: ["hat"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What can you climb in a playground?",
      helpPhrases: ["You can climb a ladder."],
      answers: ["ladder"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What do children use to dig sand?",
      helpPhrases: ["They use a shovel."],
      answers: ["shovel"],
      difficulty: DIFFICULTY.HARD,
    },
  ].map((q, i) => ({ ...q, id: `q${i + 1}` })),

  bathroom: [
    // the easy one nigga
    {
      question: "What room is this?",
      helpPhrases: ["This is a bathroom."],
      answers: ["bathroom"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "What is the girl doing?",
      helpPhrases: ["She is brushing her teeth."],
      answers: ["brushing", "brushing teeth"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "What toy is in the tub?",
      helpPhrases: ["It is a duck."],
      answers: ["duck"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "What color are her pajamas?",
      helpPhrases: ["They are pink."],
      answers: ["pink"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "Is there water in the tub?",
      helpPhrases: ["Yes, there is water."],
      answers: ["yes"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "Is she standing?",
      helpPhrases: ["Yes, she is standing."],
      answers: ["yes"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "Is the duck yellow?",
      helpPhrases: ["Yes, it is yellow."],
      answers: ["yes"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "Is there a sink?",
      helpPhrases: ["Yes, there is a sink."],
      answers: ["yes"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "Is there a mirror?",
      helpPhrases: ["Yes, there is a mirror."],
      answers: ["yes"],
      difficulty: DIFFICULTY.EASY,
    },

    // the medium one nigga
    {
      question: "How many towels are on the wall?",
      helpPhrases: ["There are two towels."],
      answers: ["two", "2"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "Where do you wash your hands?",
      helpPhrases: ["You wash your hands in the sink."],
      answers: ["sink"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "Where do you take a bath?",
      helpPhrases: ["You take a bath in a bathtub."],
      answers: ["bathtub"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "What do you use to dry your body?",
      helpPhrases: ["You use a towel."],
      answers: ["towel"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "What do you look at to see yourself?",
      helpPhrases: ["You look in a mirror."],
      answers: ["mirror"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "What do you sit on in the bathroom?",
      helpPhrases: ["You sit on a toilet."],
      answers: ["toilet"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "What do you turn on for water?",
      helpPhrases: ["You turn on the faucet."],
      answers: ["faucet", "tap"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "Is the bathroom clean?",
      helpPhrases: ["Yes, it is clean."],
      answers: ["yes"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "Where is the duck?",
      helpPhrases: ["The duck is in the tub."],
      answers: ["tub", "bathtub"],
      difficulty: DIFFICULTY.MEDIUM,
    },

    // the hard one nigga
    {
      question: "What is the girl standing on?",
      helpPhrases: ["She is standing on a stool."],
      answers: ["stool"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "Why do we brush our teeth?",
      helpPhrases: ["To keep them clean."],
      answers: ["clean"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What keeps the water inside the tub?",
      helpPhrases: ["The drain plug keeps it in."],
      answers: ["plug"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What do you use to wash your body?",
      helpPhrases: ["You use soap."],
      answers: ["soap"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What do you use to brush your teeth?",
      helpPhrases: ["You use a toothbrush."],
      answers: ["toothbrush"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "Where does dirty water go?",
      helpPhrases: ["It goes down the drain."],
      answers: ["drain"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What do you use to clean the floor?",
      helpPhrases: ["You use a mop."],
      answers: ["mop"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "Why do we wash our hands?",
      helpPhrases: ["To remove germs."],
      answers: ["germs"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What do you use to comb your hair?",
      helpPhrases: ["You use a comb."],
      answers: ["comb"],
      difficulty: DIFFICULTY.HARD,
    },
  ].map((q, i) => ({ ...q, id: `q${i + 1}` })),
  letter: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter, i) => ({
    id: `q${i + 1}`,
    question: `Now find the letter ${letter}`,
    difficulty: DIFFICULTY.EASY,
    helpPhrases: [
      `Try again! Look for ${letter}.`,
      `Not quite.Find the letter ${letter}.`,
      `Keep looking for ${letter}!`,
    ],
    answers: [`${letter}`],
  })),
};
