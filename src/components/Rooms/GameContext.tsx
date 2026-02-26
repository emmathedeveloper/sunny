import { DIFFICULTY, QUESTIONS, type QuestionType } from "@/lib/client/questions";
import { createContext, useCallback, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

export type RoomType = keyof typeof QUESTIONS

type GameContextType = {
    currentQuestion: QuestionType | null,
    setCurrentQuestion: Dispatch<SetStateAction<QuestionType | null>>
    currentQuestionIndex: number,
    setCurrentQuestionIndex: Dispatch<SetStateAction<number>>,
    failureStreak: number,
    setFailureStreak: Dispatch<SetStateAction<number>>,
    correctStreak: number,
    setCorrectStreak: Dispatch<SetStateAction<number>>,
    correctCount: number,
    setCorrectCount: Dispatch<SetStateAction<number>>,
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
    getNextQuestion: (room: RoomType, excludeAsked?: string[]) => QuestionType | undefined,
    resetForNextRoom: () => void
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

    const QUESTIONS_PER_ROOM = 5;

    const updateQuestions = (room: RoomType) => {
        // Pick 6 random letters including target
        const allQuestions = QUESTIONS[room];
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        const randomQuestions = shuffled.slice(0, 10);
        const questions = [...randomQuestions].sort(() => Math.random() - 0.5);

        setQuestions(questions)

        return questions
    }

    const getNextQuestion = useCallback((room?: RoomType, excludeAsked?: string[]) => {
        const roomToUse = room ?? currentRoom;
        const askedToUse = excludeAsked ?? askedQuestions;


        if (currentQuestion) {
            setAskedQuestions(p => ([...p, currentQuestion.id]))
        }

        const found = QUESTIONS[roomToUse].find(
            q => !askedToUse.includes(q.id) &&
                q.difficulty === difficulty &&
                q.id !== currentQuestion?.id
        )

        if (found) {
            setCurrentQuestion({ ...found })
        } else {
            setCurrentQuestion(null)
        }

        return found
    }, [currentRoom, askedQuestions, difficulty, currentQuestion, setAskedQuestions, setCurrentQuestion])

    const resetForNextRoom = () => {
        setAskedQuestions([])
        setCurrentQuestion(null)
        setCurrentQuestionIndex(0)
        setFailureStreak(0)
        setCorrectStreak(0)
        setDifficulty(DIFFICULTY.MEDIUM)
        setCorrectCount(0)

        console.log("Resetting for next room")
    }

    //Reset failure count whenever we have a new question
    useEffect(() => {
        setQuestionFailureCount(0)
    }, [currentQuestionIndex])

    useEffect(() => {

        //Once a question is failed, reset correct streak
        if (failureStreak > 0) setCorrectStreak(0)

        //Reduce difficulty if child has failed two questions in a row
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
    }, [failureStreak, setCorrectStreak])

    useEffect(() => {

        //Once a question is passed, reset failure streak
        if (correctStreak > 0) setFailureStreak(0)

        //Increase difficulty if child has passed two questions in a row
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
    }, [correctStreak, setCorrectStreak])

    return (
        <GameContext.Provider value={{
            QUESTIONS_PER_ROOM,
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
            currentQuestion,
            setCurrentQuestion,
            setQuestions,
            updateQuestions,
            failureStreak,
            setFailureStreak,
            correctStreak,
            setCorrectStreak,
            getNextQuestion,
            correctCount,
            setCorrectCount,
            resetForNextRoom
        }}>
            {children}
        </GameContext.Provider>
    )
}


export const useGameContext = () => useContext<GameContextType>(GameContext)