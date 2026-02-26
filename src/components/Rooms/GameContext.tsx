import { DIFFICULTY, QUESTIONS, type QuestionType } from "@/lib/client/questions";
import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

type RoomType = keyof typeof QUESTIONS

type GameContextType = {
    currentQuestionIndex: number,
    setCurrentQuestionIndex: Dispatch<SetStateAction<number>>,
    currentRoom: RoomType,
    setCurrentRoom: Dispatch<SetStateAction<RoomType>>,
    readyForNewRoom: boolean,
    setReadyForNewRoom: Dispatch<SetStateAction<boolean>>,
    questionFailureCount: number,
    setQuestionFailureCount: Dispatch<SetStateAction<number>>,
    conversationPaused: boolean
    setConversationPaused: Dispatch<SetStateAction<boolean>>,
    questions: QuestionType[],
    setQuestions: Dispatch<SetStateAction<QuestionType[]>>,
    updateQuestions: (room: RoomType) => QuestionType[],
    QUESTIONS_PER_ROOM: number,
}

export const GameContext = createContext({} as GameContextType)

export const GameProvider = ({ children }: { children?: ReactNode }) => {

    //Streak of correct answers. Resets to 0 when we get a wrong answer
    const [correctStreak, setCorrectStreak] = useState(0)

    //Streak of wrong answers. Resets to 0 when we get a correct answer
    const [failureStreak, setFailureStreak] = useState(0)

    //Current difficulty level. Changes based on the user's performance
    const [difficulty, setDifficulty] = useState(DIFFICULTY.MEDIUM)

    //Total number of correct answers. Does not reset when we get a wrong answer
    const [correctCount, setCorrectCount] = useState(0)

    //Id's of questions that have been asked. Used to avoid repeating questions
    const [askedQuestions, setAskedQuestions] = useState<string[]>([])

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    //The current question that the user is trying to answer. Null if there are no more questions or if we are waiting for the next room
    const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null)

    //The current room that the user is in. Changes when we move to a new room
    const [currentRoom, setCurrentRoom] = useState<keyof typeof QUESTIONS>("playground");


    //Whether the user has indicated that they are ready to move on to the next room. Used to trigger the transition to the next room after the current questions are done
    const [readyForNewRoom, setReadyForNewRoom] = useState(false)

    //How many times the user has failed to answer the current question correctly. Resets when we get a new question
    const [questionFailureCount, setQuestionFailureCount] = useState(0)

    const [conversationPaused, setConversationPaused] = useState(false)

    const [questions, setQuestions] = useState<QuestionType[]>([])

    const QUESTIONS_PER_ROOM = 9;

    const updateQuestions = (room: RoomType) => {
        // Pick 6 random letters including target
        const allQuestions = QUESTIONS[room];
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        const randomQuestions = shuffled.slice(0, 10);
        const questions = [...randomQuestions].sort(() => Math.random() - 0.5);

        setQuestions(questions)

        return questions
    }

    const getNextQuestion = () => {

        const found = QUESTIONS[currentRoom].find(q => !askedQuestions.includes(q.id) && q.difficulty === difficulty)

        setCurrentQuestion(found || null)

        return found
    }

    //Reset failure count whenever we have a new question
    useEffect(() => {
        setQuestionFailureCount(0)
    }, [currentQuestionIndex])

    useEffect(() => {

        if(failureStreak > 0) setCorrectStreak(0)

        if (failureStreak >= 2) {
            switch (difficulty) {
                case DIFFICULTY.EASY:
                    setDifficulty(DIFFICULTY.EASY)
                    break;
                case DIFFICULTY.MEDIUM:
                    setDifficulty(DIFFICULTY.EASY)
                    break;
                case DIFFICULTY.HARD:
                    setDifficulty(DIFFICULTY.MEDIUM)
                    break;
            }
        }
    }, [failureStreak , setCorrectStreak])

    useEffect(() => {

        if(correctStreak > 0) setFailureStreak(0)

        if (correctStreak >= 2) {
            switch (difficulty) {
                case DIFFICULTY.EASY:
                    setDifficulty(DIFFICULTY.MEDIUM)
                    break;
                case DIFFICULTY.MEDIUM:
                    setDifficulty(DIFFICULTY.HARD)
                    break;
                case DIFFICULTY.HARD:
                    setDifficulty(DIFFICULTY.HARD)
                    break;
            }
        }
    }, [correctStreak , setCorrectStreak])

    return (
        <GameContext.Provider value={{
            readyForNewRoom,
            setReadyForNewRoom,
            currentQuestionIndex,
            setCurrentQuestionIndex,
            currentRoom,
            setCurrentRoom,
            questionFailureCount,
            setQuestionFailureCount,
            conversationPaused,
            setConversationPaused,
            questions,
            setQuestions,
            updateQuestions,
            QUESTIONS_PER_ROOM
        }}>
            {children}
        </GameContext.Provider>
    )
}


export const useGameContext = () => useContext<GameContextType>(GameContext)