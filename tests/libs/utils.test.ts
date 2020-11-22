import {
    debounce,
    getGameData,
    removeGameData,
    saveGameData,
    timer,
    useLocalCache,
} from '~/libs/utils'

describe('useLocalCache', () => {
    describe('error', () => {
        test('파라미터 key를 입력하지 않으면 에러가 발생합니다.', () => {
            expect(() => {
                // @ts-expect-error
                useLocalCache()
            }).toThrow()
        })
        test('파라미터 ttl이 1보다 작으면 에러가 발생합니다.', () => {
            expect(() => {
                useLocalCache('key', 0)
            }).toThrow()
        })
    })
    describe('success', () => {
        test(`캐시가 유효하면 "true"를 반환합니다.`, () => {
            const cache = useLocalCache('key', 1)

            cache.set('test')

            expect(cache.check()).toBeTruthy()
        })
        test(`만료시간을 초과하면 "false"를 반환합니다.`, () => {
            const now = Date.now()
            const cache = useLocalCache('key', 1)

            // 현재시간 설정
            Date.now = jest.fn(() => now)

            cache.set('test')

            // 현재시간 조작
            Date.now = jest.fn(() => now + 1001)

            expect(cache.check()).toBeFalsy()
        })
        test('파라미터 ttl을 입력하지 않으면 기본값은 1초입니다.', () => {
            const now = Date.now()
            const ttl = 1
            const ms = ttl * 1000
            const cache = useLocalCache('key')

            // 현재시간 설정
            Date.now = jest.fn(() => now)
            cache.set('test')

            // 현재시간 조작
            Date.now = jest.fn(() => now + ms)
            expect(cache.check()).toBeTruthy()

            // 만료시간을 초과
            Date.now = jest.fn(() => now + ms + 1)
            expect(cache.check()).toBeFalsy()
        })
    })
    describe('useLocalCache().get', () => {
        test('캐시가 유효하면 data를 반환합니다', () => {
            const cache = useLocalCache('key')
            const data = { test: 'data' }
            cache.set(data)
            cache.check()
            expect(cache.get()).toEqual(data)
        })
        test('캐시가 만료되면 null을 반환합니다.', () => {
            const now = Date.now()
            const ttl = 2
            const ms = ttl * 1000
            const cache = useLocalCache('key', ttl)
            const data = { test: 'data' }

            // 현재시간 설정
            Date.now = jest.fn(() => now)
            cache.set(data)

            // 현재시간 조작
            Date.now = jest.fn(() => now + ms + 1000)
            cache.check()

            expect(cache.get()).toBeNull()
        })
    })
})

describe('debounce', () => {
    test.todo('debounce')
})

describe('timer', () => {
    test.todo('timer')
})

describe('saveGameData', () => {
    test.todo('saveGameData')
})

describe('getGameData', () => {
    test.todo('getGameData')
})

describe('removeGameData', () => {
    test.todo('removeGameData')
})
