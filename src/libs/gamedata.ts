export interface GameData {
    playtime: number
    score: number
}

export const key = 'gamedata'

export const saveGameData = (data: GameData) => {
    const { playtime, score } = data

    if (!playtime || typeof playtime !== 'number') {
        throw new Error('유효한 데이터가 아닙니다. (playtime)')
    }

    if (!score || typeof score !== 'number') {
        throw new Error('유효한 데이터가 아닙니다. (number)')
    }

    localStorage.setItem(key, JSON.stringify(data))
}

export const getGameData = () => {
    try {
        const data = localStorage.getItem(key)

        if (!data) {
            return null
        }

        const json = JSON.parse(data)
        const { playtime, score } = json

        if (!playtime || typeof playtime !== 'number') {
            throw new Error('유효한 데이터가 아닙니다. (playtime)')
        }

        if (!score || typeof score !== 'number') {
            throw new Error('유효한 데이터가 아닙니다. (score)')
        }

        return {
            playtime,
            score,
        }
    } catch (error) {
        console.error(error)
        return null
    }
}

export const removeGameData = () => {
    localStorage.removeItem(key)
}
