
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
}

export const QUESTIONS = {
    "playground": [
        {
            id: "q1",
            question: "How many children do you see?",
            helpPhrases: ["Not quite! there are four children in the playground. Can you say four?"],
            answers: ["four", "4", "for", "fore", "fall"]
        },
        {
            id: "q2",
            question: "What color is the slide?",
            helpPhrases: ["That's not right, the slide is orange. Can you say orange?"],
            answers: ["orange", "red"]
        },
        {
            id: "q3",
            question: "What is the puppy playing with?",
            helpPhrases: ["Did you say ball?"],
            answers: ["ball", "bowl", "bored", "bore" , "gold" , "bull" , "call" , "gall"]
        },
        {
            id: "q4",
            question: "What are the children building in the sandbox?",
            helpPhrases: ["Not quite! the children are building a castle. Can you say castle?"],
            answers: ["castle", 'sand castle' , "kasu" , "ekasu", "picasso"]
        },
        {
            id: "q5",
            question: "Is there a boy or a girl on the swing?",
            helpPhrases: ["Not really, There is a girl on the swing. Can you say girl?"],
            answers: ["girl"]
        },
        {
            id: "q6",
            question: "What color is the grass?",
            helpPhrases: ["Did i hear you say green?"],
            answers: ["green"]
        },
        {
            id: "q7",
            question: "What is the girl in the sandbox wearing on her head?",
            helpPhrases: ["That's not right, the girl in the sandbox is wearing a hat. Can you say hat?"],
            answers: ["hat", "heart", "hot", "hut" , "art" , "at"]
        },
    ],
    "bathroom": [
        {
            id: "q1",
            question: "What room is this?",
            helpPhrases: ["Not really, this a a bathroom, did i hear you say bathroom?"],
            answers: ["bathroom", "bath room"]
        },
        {
            id: "q2",
            question: "What is the girl doing?",
            helpPhrases: ["No, the girl is brushing, can you say brushing?"],
            answers: ["brushing", "brushing teeth", "cleaning teeth"]
        },
        {
            id: "q3",
            question: "What toy is floating in the tub?",
            helpPhrases: ["Not quite!, the toy in the tub is a rubber duck, can you say rubber duck?"],
            answers: ["duck", "rubber duck", "toy", "toil"]
        },
        {
            id: "q4",
            question: "How many towels are on the wall?",
            helpPhrases: ["That's not right, did you say two?"],
            answers: ["two", "2"]
        },
        {
            id: "q5",
            question: "What color are the girl's pajamas?",
            helpPhrases: ["Not quite!, the girl's  pajamas is pink, can you say pink?"],
            answers: ["pink"]
        },
        {
            id: "q6",
            question: "Where do you go to take a bath?",
            helpPhrases: ["Not quite!, you take a bath in a bathtub, can you say bathtub?"],
            answers: ["bathtub", "bath tub", "bathroom tub"]
        },
        {
            id: "q7",
            question: "What is the girl standing on",
            helpPhrases: ["Did i hear you say stool?"],
            answers: ["stool", "step stool"]
        },
    ],
    "letter": "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter, i) => ({
        id: `q${i + 1}`,
        question: `Now find the letter ${letter}`,
        helpPhrases: [
            `Try again! Look for ${letter}.`,
            `Not quite.Find the letter ${letter}.`,
            `Keep looking for ${letter}!`
        ],
        answers: [`${letter}`]
    }))
}