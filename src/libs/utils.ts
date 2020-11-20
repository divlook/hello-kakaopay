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
