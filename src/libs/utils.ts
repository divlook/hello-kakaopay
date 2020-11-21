export const useLocalCache = <Data>(key: string, active = false) => {
    let data: Data

    return {
        check() {
            if (active) {
                const row = localStorage.getItem(key)
                if (row) {
                    try {
                        data = JSON.parse(row)
                        return true
                    } catch {
                        return false
                    }
                }
            }
            return false
        },
        get() {
            console.log(`cache[${key}]가 사용되었습니다.`)
            return data
        },
        set(nextData: Data) {
            if (active && nextData) {
                localStorage.setItem(key, JSON.stringify(nextData))
            }
        },
    }
}

/**
 * Debounce
 *
 * @param ms 기본값: 300
 */
export const debounce = (cb: () => void, ms = 300) => {
    let handel: any
    return () => {
        clearTimeout(handel)
        handel = setTimeout(cb, ms)
    }
}

/**
 * Timer
 *
 * @param ms 기본값: 1000
 */
export const timer = (cb: (count: number) => void, ms = 1000) => {
    let handel: any

    return {
        start,
        stop,
    }

    function start(count: number) {
        stop()
        cb(count)

        if (--count >= 0) {
            handel = setTimeout(() => {
                start(count)
            }, ms)
        }
    }

    function stop() {
        clearTimeout(handel)
    }
}

export interface GameData {
    playtime: number
    score: number
}

export const saveGameData = (data: GameData) => {
    const key = 'gamedata'
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
        const key = 'gamedata'
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
    const key = 'gamedata'
    localStorage.removeItem(key)
}
