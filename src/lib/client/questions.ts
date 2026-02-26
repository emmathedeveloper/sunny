
export const ROOM_INTRO_MESSAGE = {
    "playground": "Let's look at the playground",
    "bathroom": "Let's look at the picture here.",
    "letter": "Let's look at these letters."
}

export const GENERAL_TEXT = {
    'greeting': "Hello! I'm so happy to see you! Would you like to play a game with me?",
    'refuse-to-play': 'Aww, maybe next time! Have a great day!',
    'did-not-catch': "I didn't quite catch that. Do you want to play a game with me?",
    'congratulations': "Wow! You did amazing! You're so smart! Great job playing with me!",
    'lets-start': "Yay! Let's start the game",
    'play-more': 'Wow! You did amazing! Great job! Do you want to play more?'
}

export type QuestionType = {
    id: string;
    question: string;
    helpPhrases: string[];
    answers: string[];
    difficulty: DIFFICULTY;
}

export enum DIFFICULTY {
    EASY,
    MEDIUM,
    HARD
}

export const QUESTIONS = {
    "playground": [
        {
            question: "How many children do you see?",
            helpPhrases: ["Not quite! there are four children in the playground. Can you say four?"],
            answers: ["four", "4", "for", "fore", "fall"],
            difficulty: DIFFICULTY.EASY,
        },
        {
            question: "What color is the slide?",
            helpPhrases: ["That's not right, the slide is orange. Can you say orange?"],
            answers: ["orange", "red"],
            difficulty: DIFFICULTY.MEDIUM,
        },
        {
            question: "What is the puppy playing with?",
            helpPhrases: ["Did you say ball?"],
            answers: ["ball", "bowl", "bored", "bore", "gold", "bull", "call", "gall"],
            difficulty: DIFFICULTY.MEDIUM,
        },
        {
            question: "What are the children building in the sandbox?",
            helpPhrases: ["Not quite! the children are building a castle. Can you say castle?"],
            answers: ["castle", 'sand castle', "kasu", "ekasu", "picasso"],
            difficulty: DIFFICULTY.HARD,
        },
        {
            question: "Is there a boy or a girl on the swing?",
            helpPhrases: ["Not really, There is a girl on the swing. Can you say girl?"],
            answers: ["girl"],
            difficulty: DIFFICULTY.HARD,
        },
        {
            question: "What color is the grass?",
            helpPhrases: ["Did i hear you say green?"],
            answers: ["green"],
            difficulty: DIFFICULTY.EASY,
        },
        {
            question: "What is the girl in the sandbox wearing on her head?",
            helpPhrases: ["That's not right, the girl in the sandbox is wearing a hat. Can you say hat?"],
            answers: ["hat", "heart", "hot", "hut", "art", "at"],
            difficulty: DIFFICULTY.HARD,
        },
        {
            question: "How many trees do you see?",
            helpPhrases: ["Not quite! there are two trees in the playground. Can you say two?"],
            answers: ["two", "2", "too", "to"],
            difficulty: DIFFICULTY.EASY,
        },
        {
            question: "What color is the sky?",
            helpPhrases: ["Did i hear you say blue?"],
            answers: ["blue" , "blew" , "blu"],
            difficulty: DIFFICULTY.MEDIUM,
        },
    ].map((q, i) => ({ ...q, id: `q${i + 1}` })),
    "bathroom": [
        {
            question: "What room is this?",
            helpPhrases: ["Not really, this a a bathroom, did i hear you say bathroom?"],
            answers: ["bathroom", "bath room"],
            difficulty: DIFFICULTY.EASY,
        },
        {
            question: "What is the girl doing?",
            helpPhrases: ["No, the girl is brushing, can you say brushing?"],
            answers: ["brushing", "brushing teeth", "cleaning teeth"],
            difficulty: DIFFICULTY.EASY,
        },
        {
            question: "What toy is floating in the tub?",
            helpPhrases: ["Not quite!, the toy in the tub is a rubber duck, can you say rubber duck?"],
            answers: ["duck", "rubber duck", "toy", "toil"],
            difficulty: DIFFICULTY.EASY,
        },
        {
            question: "What color are the girl's pajamas?",
            helpPhrases: ["Not quite!, the girl's  pajamas is pink, can you say pink?"],
            answers: ["pink"],
            difficulty: DIFFICULTY.EASY,
        },
        {
            question: "How many towels are on the wall?",
            helpPhrases: ["That's not right, did you say two?"],
            answers: ["two", "2"],
            difficulty: DIFFICULTY.MEDIUM,
        },
        {
            question: "Where do you go to take a bath?",
            helpPhrases: ["Not quite!, you take a bath in a bathtub, can you say bathtub?"],
            answers: ["bathtub", "bath tub", "bathroom tub"],
            difficulty: DIFFICULTY.MEDIUM,
        },
        {
            question: "Where do you use to go potty?",
            helpPhrases: ["Not quite!, you go to the toilet to go potty, can you say toilet?"],
            answers: ["toilet", "potty"],
            difficulty: DIFFICULTY.MEDIUM,
        },
        {
            question: "Where do you go to take a bath?",
            helpPhrases: ["Not quite!, you take a bath in a bathtub, can you say bathtub?"],
            answers: ["bathtub", "bath tub", "bathroom tub"],
            difficulty: DIFFICULTY.MEDIUM,
        },
        {
            question: "What is the girl standing on?",
            helpPhrases: ["Did i hear you say stool?"],
            answers: ["stool", "step stool"],
            difficulty: DIFFICULTY.HARD,
        },
        {
            question: "What do you wash your hands in?",
            helpPhrases: ["Did i hear you say sink?"],
            answers: ["sink", "bathroom sink"],
            difficulty: DIFFICULTY.HARD,
        },
        {
            question: "What do you turn on to get water?",
            helpPhrases: ["Did i hear you say faucet?"],
            answers: ["faucet", "tap"],
            difficulty: DIFFICULTY.HARD,
        },
    ].map((q, i) => ({ ...q, id: `q${i + 1}` })),
    "letter": "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter, i) => ({
        id: `q${i + 1}`,
        question: `Now find the letter ${letter}`,
        difficulty: DIFFICULTY.EASY,
        helpPhrases: [
            `Try again! Look for ${letter}.`,
            `Not quite.Find the letter ${letter}.`,
            `Keep looking for ${letter}!`
        ],
        answers: [`${letter}`]
    }))
}