import { QUESTIONS, type QuestionType } from "@/lib/client/questions";
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
    updateQuestions: (room: RoomType) => QuestionType[]
}

export const GameContext = createContext({} as GameContextType)


export const GameProvider = ({ children }: { children?: ReactNode }) => {

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const [currentRoom, setCurrentRoom] = useState<keyof typeof QUESTIONS>("playground");

    const [readyForNewRoom, setReadyForNewRoom] = useState(false)

    const [questionFailureCount, setQuestionFailureCount] = useState(0)

    const [conversationPaused, setConversationPaused] = useState(false)

    const [questions, setQuestions] = useState<QuestionType[]>([])

    const updateQuestions = (room: RoomType) => {
        // Pick 6 random letters including target
        const allQuestions = QUESTIONS[room];
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        const randomQuestions = shuffled.slice(0, 10);
        const questions = [...randomQuestions].sort(() => Math.random() - 0.5);

        setQuestions(questions)

        return questions
    }

    //Reset failure count whenever we have a new question
    useEffect(() => {
        setQuestionFailureCount(0)
    }, [currentQuestionIndex])

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
            updateQuestions
        }}>
            {children}
        </GameContext.Provider>
    )
}


export const useGameContext = () => useContext<GameContextType>(GameContext)