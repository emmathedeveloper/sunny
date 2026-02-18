
export const PRAISE_MESSAGES = ["Great job!" , "Perfect!" , "That's right!" , "Good work!"]

export const AGREEMENT_PHRASES = ['yes' , 'sure' , 'ok' , 'yay' , "let's go"]

export const getRandomItem = <T>(items: T[]) => {

    const rand = Math.floor(Math.random() * items.length)

    return items[rand]
}

export const userAgreed = (text: string) => AGREEMENT_PHRASES.some(p => text.toLowerCase().includes(p))