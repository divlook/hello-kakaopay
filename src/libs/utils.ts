export interface LocalCache<Data = any> {
    data: Data
    /**
     * 만료시간
     * - 단위 : ms
     */
    expires: number
}

/**
 * Local cache
 *
 * @param ttl 캐시를 유지시킬 시간
 * - 단위 : 초
 * - 기본값 : 1
 * - 최소값 : 1
 */
export const useLocalCache = <Data>(key: string, ttl = 1) => {
    let cache: LocalCache<Data> | null
    let checked = false

    if (!key) {
        throw new Error('LocalCache를 사용하기 위해서는 key가 필요합니다.')
    }

    if (ttl < 1) {
        throw new Error('ttl 최소값은 1초입니다.')
    }

    return {
        check() {
            const row = localStorage.getItem(key)
            checked = true

            if (!row) {
                return false
            }

            try {
                const json: typeof cache = JSON.parse(row)
                const data = json?.data
                const expires = json?.expires ?? 0

                if (!data) {
                    localStorage.removeItem(key)
                    return false
                }

                if (expires < Date.now()) {
                    localStorage.removeItem(key)
                    return false
                }

                cache = json

                return true
            } catch {
                return false
            }
        },
        get() {
            console.log(`cache[${key}]가 사용되었습니다.`)

            if (!checked) {
                this.check()
            }

            checked = false

            return cache ? cache.data : null
        },
        set(nextData: Data) {
            if (nextData) {
                const ms = ttl * 1000
                const nextCache: LocalCache<Data> = {
                    data: nextData,
                    expires: Date.now() + ms,
                }
                localStorage.setItem(key, JSON.stringify(nextCache))
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
