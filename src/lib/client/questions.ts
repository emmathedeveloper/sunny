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
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "Is the sun out?",
      helpPhrases: ["Yes, the sun is shining, can you say yes?"],
      answers: ["yes", "yeah", "yep", "yup", "ya"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "Is there a dog?",
      helpPhrases: ["Yes, there is a dog, can you say dog?"],
      answers: ["dog", "a dog", "doggie", "doggie dog"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "What is the puppy playing with?",
      helpPhrases: ["The puppy is playing with a ball, did i hear you say bal"],
      answers: ["ball", "bawl", "bale", "bowl", "bored", "bore", "gold", "bull", "call", "gall"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "Are the children happy?",
      helpPhrases: ["Yes, they are happy, can you say happy?"],
      answers: ["happy", "happier", "happiness", "happily", "happy children"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "Is the slide big?",
      helpPhrases: ["Yes, it is big, can you say yes?"],
      answers: ["yes", "yeah", "yep", "yup", "ya"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "What color is the slide?",
      helpPhrases: ["Not quite!, the slide is orange, can you say orange?"],
      answers: ["orange", "red", "range", "arrange", "door hinge"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "What are the children building?",
      helpPhrases: ["They are building a sandcastle, can you say sandcastle?"],
      answers: ["castle", "sandcastle", 'sand castle', "kasu", "ekasu", "picasso"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "Who is on the swing?",
      helpPhrases: ["A girl is on the swing, can you say girl?"],
      answers: ["girl", "a girl", "gurl", "grill", "curl"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "Where is the puppy?",
      helpPhrases: ["The puppy is on the grass, can you say grass?"],
      answers: ["grass", "on the grass", "gass", "glass", "grease"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "What are the children playing on?",
      helpPhrases: ["Not quite!, They are playing on the playground, can you say playground?"],
      answers: ["playground", "play ground", "playground area"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "Is the sandbox full of sand?",
      helpPhrases: ["Yes, it is full of sand."],
      answers: ["yes", "yeah", "yep", "yup", "ya"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "What do you use to slide down?",
      helpPhrases: ["You use the slide, can you say slide?"],
      answers: ["slide", "the slide", "slid", "slight", "slit"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "Are the trees tall?",
      helpPhrases: ["Yes, the trees are tall."],
      answers: ["yes", "yeah", "yep", "yup", "ya"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "What is under the trees?",
      helpPhrases: ["Not quite!,Grass is under the trees, can you say grass?"],
      answers: ["grass", "on the grass", "gass", "glass", "grease"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "What is the girl in the sandbox wearing?",
      helpPhrases: ["She is wearing a hat, can you say hat?"],
      answers: ["hat", "a hat", "hatted", "hatter", "hatterr", "at", "at", "heart", "hot", "that", "hut"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What are the children using to build?",
      helpPhrases: ["They are using sand, can you say sand?"],
      answers: ["sand", "sanded", "sanded", "sanded", "sandwich", "hand", "stand", "land", "and"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "Is the playground busy or empty?",
      helpPhrases: ["It is busy, can you say busy?"],
      answers: ["busy", "buzzy", "bus", "buzz", "busy playground", "bee", "bus stop", "busy area"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What shape is the ball?",
      helpPhrases: ["The ball is round, can you say round?"],
      answers: ["round", "round ball", "round shape", "bound", "found", "hound", "mound", "pound", "sphere", "fere", "fare", "fur"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What do you call a small dog?",
      helpPhrases: ["Not quite!, A small dog is called a puppy, can you say puppy?"],
      answers: ["puppy", "small dog", "pup", "pupper", "puppie", "pupie", "pup puppy", "pup dog"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "Why are the children smiling?",
      helpPhrases: ["Because they are having fun."],
      answers: ["fun", "having fun", "fun time", "enjoying", "enjoying themselves", "happy", "happiness", "playing"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What do you wear to protect your head?",
      helpPhrases: ["Not quite!, You wear a hat, can you say hat?"],
      answers: ["hat", "a hat", "hatted", "hatter", "hatterr", "at", "at", "heart", "hot", "that", "hut"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What can you climb in a playground?",
      helpPhrases: ["You can climb a ladder, can you say ladder?"],
      answers: ["ladder", "a ladder", "ladder to the slide", "ladder on the playground", "ladder to the playground"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What do children use to dig sand?",
      helpPhrases: ["Not quite!, They use a shovel, can you say shovel?"],
      answers: ["shovel", "a shovel", "shovelled", "shoveller", "shovel to dig sand"],
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
      question: "What toy is in the tub?",
      helpPhrases: ["Not quite!, the toy in the tub is a rubber duck, can you say rubber duck?"],
      answers: ["duck", "rubber duck", "rubber ducky", "duck toy", "duck in the tub", "suck"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "What color are her pajamas?",
      helpPhrases: ["They are pink."],
      answers: ["pink", "pink pajamas", "pink pajama", "pink jammies", "pink jammy", "pink pjs", "pink pj's"  ],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "Is there water in the tub?",
      helpPhrases: ["Yes, there is water."],
      answers: ["yes", "yeah", "yep", "yup", "ya"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "Is she standing?",
      helpPhrases: ["Yes, she is standing."],
      answers: ["yes", "yeah", "yep", "yup", "ya"],
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
      answers: ["yes", "yeah", "yep", "yup", "ya"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "Is there a mirror?",
      helpPhrases: ["Yes, there is a mirror."],
      answers: ["yes", "yeah", "yep", "yup", "ya"],
      difficulty: DIFFICULTY.EASY,
    },
    {
      question: "How many towels are on the wall?",
      helpPhrases: ["There are two towels did i hear you say two?"],
      answers: ["two", "2", "too", "to"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "Where do you wash your hands?",
      helpPhrases: ["You wash your hands in the sink, did i hear you say sink?"],
      answers: ["sink", "the sink", "sink area", "sink in the bathroom"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "Where do you take a bath?",
      helpPhrases: ["Not quite!, you take a bath in a bathtub, can you say bathtub?"],
      answers: ["bathtub", "tub", "bath", "bath tub", "bathroom tub"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "What do you use to dry your body?",
      helpPhrases: ["Not really!, You use a towel, can you say towel?"],
      answers: ["towel", "a towel", "towel on the wall", "towel hanging on the wall"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "What do you look at to see yourself?",
      helpPhrases: ["Not really, You look in a mirror, can you say mirror?"],
      answers: ["mirror", "a mirror", "mirror in the bathroom", "bathroom mirror"],
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
      helpPhrases: ["You turn on the faucet, can you say faucet?"],
      answers: ["faucet", "tap", "water faucet", "sink faucet"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "Is the bathroom clean?",
      helpPhrases: ["Yes, it is clean, can you say yes?"],
      answers: ["yes", "yeah", "yep", "yup", "ya"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "Where is the duck?",
      helpPhrases: ["The duck is in the tub, did i hear you say tub?"],
      answers: ["tub", "bathtub", "bath", "bath tub", "bathroom tub"],
      difficulty: DIFFICULTY.MEDIUM,
    },
    {
      question: "What is the girl standing on?",
      helpPhrases: ["She is standing on a stool, did i hear you say stool?"],
      answers: ["stool", "a stool", "stool in the bathroom", "bathroom stool"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "Why do we brush our teeth?",
      helpPhrases: ["To keep them clean, did i hear you say clean?"],
      answers: ["clean", "keep them clean", "clean teeth", "cleaning teeth", "klin", "klean", "cleen", "cleen teeth"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What keeps the water inside the tub?",
      helpPhrases: ["The drain plug keeps it in, did i hear you say plug?"],
      answers: ["plug", "drain plug", "plug in the drain", "plug in the tub", "drain plug in the tub", "plog", "plog in the drain", "plog in the tub", "frog", "plog in the plug"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What do you use to wash your body?",
      helpPhrases: ["You use soap, did i hear you say soap?"],
      answers: ["soap", "a bar of soap", "soap in the bathroom", "bathroom soap"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What do you use to brush your teeth?",
      helpPhrases: ["You use a toothbrush, did i hear you say toothbrush?"],
      answers: ["toothbrush", "a toothbrush", "tooth brush", "toothbrush in the bathroom", "bathroom toothbrush"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "Where does dirty water go?",
      helpPhrases: ["It goes down the drain, did i hear you say drain?"],
      answers: ["drain", "the drain", "drain in the bathroom", "bathroom drain"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What do you use to clean the floor?",
      helpPhrases: ["You use a mop, did i hear you say mop?"],
      answers: ["mop", "a mop", "mop in the bathroom", "bathroom mop"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "Why do we wash our hands?",
      helpPhrases: ["To remove germs, did i hear you say germs?"],
      answers: ["germs", "remove germs", "washing hands to remove germs", "hand washing to remove germs", "germs on our hands", "germs on our body", "gem"],
      difficulty: DIFFICULTY.HARD,
    },
    {
      question: "What do you use to comb your hair?",
      helpPhrases: ["You use a comb, did i hear you say comb?"],
      answers: ["comb", "a comb", "comb in the bathroom", "bathroom comb"],
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
