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
