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
    describe('파라미터 테스트', () => {
        test('debounce(() => {}, 1000)', () => {
            expect(debounce(() => {}, 1000)).toBeTruthy()
        })
        test('debounce(() => {})', () => {
            expect(debounce(() => {})).toBeTruthy()
        })
    })
    describe('callback 테스트', () => {
        beforeEach(() => {
            jest.useFakeTimers()
        })
        afterEach(() => {
            jest.clearAllTimers()
        })
        test('첫번째 콜백만 실행됩니다.', () => {
            const callback = jest.fn()
            const method = debounce(callback, 1000)
            method()
            method()
            method()
            jest.runOnlyPendingTimers()
            expect(callback).toBeCalledTimes(1)
        })
        test('1초 안에 여러번 호출시 첫번째 콜백만 실행됩니다.', () => {
            const callback = jest.fn()
            const method = debounce(callback, 1000)
            method()
            setTimeout(() => method(), 500)
            setTimeout(() => method(), 700)
            setTimeout(() => method(), 800)
            jest.runAllTimers()
            expect(callback).toHaveBeenCalledTimes(1)
        })
        test('1초가 지난 후 재호출하면 다음 콜백이 실행됩니다.', () => {
            const callback = jest.fn()
            const method = debounce(callback, 1000)
            method()
            setTimeout(() => method(), 1300)
            jest.runAllTimers()
            expect(callback).toHaveBeenCalledTimes(2)
        })
    })
})

describe('timer', () => {
    describe('파라미터 테스트', () => {
        test('timer(() => {}, 1000)', () => {
            expect(timer(() => {}, 1000)).toBeTruthy()
        })
        test('timer(() => {})', () => {
            expect(timer(() => {})).toBeTruthy()
        })
    })
    describe('메서드 테스트', () => {
        beforeEach(() => {
            jest.useFakeTimers()
        })
        afterEach(() => {
            jest.clearAllTimers()
        })
        describe('start()', () => {
            test('start(10)로 호출되는 첫번째 콜백 count는 10입니다.', () => {
                const resolve = jest.fn()
                const method = timer((count) => resolve(count))

                method.start(10)

                expect(resolve).toBeCalledWith(10)
            })
            test('start(10)로 호출되는 콜백수는 11입니다.', () => {
                const resolve = jest.fn()
                const method = timer((count) => resolve(count))

                method.start(10)
                jest.runAllTimers()

                expect(resolve).toBeCalledTimes(11)
            })
            test('start(n: number)로 호출되는 마지막 콜백 count는 항상 0입니다.', () => {
                const resolve = jest.fn()
                const method = timer((count) => resolve(count))

                method.start(10)
                jest.runAllTimers()

                expect(resolve).toBeCalledWith(0)
            })
            test('start(10) -> 5초 -> start(10) = count 17', () => {
                const resolve = jest.fn()
                const method = timer((count) => resolve(count))

                method.start(10)
                jest.advanceTimersToNextTimer(5)
                expect(resolve).toBeCalledTimes(6)

                method.start(10)
                jest.runAllTimers()
                expect(resolve).toBeCalledTimes(17)
            })
        })
        describe('stop()', () => {
            test('start(10) -> 5초 -> stop() = count 6', () => {
                const resolve = jest.fn()
                const method = timer((count) => resolve(count))

                method.start(10)
                jest.advanceTimersToNextTimer(5)

                method.stop()
                expect(resolve).toBeCalledTimes(6)

                jest.advanceTimersToNextTimer(5)
                expect(resolve).toBeCalledTimes(6)
            })
        })
    })
})

describe('gamedata', () => {
    afterEach(() => {
        removeGameData()
    })
    describe('saveGameData', () => {
        test('유효한 파라미터', () => {
            saveGameData({ playtime: 1000, score: 1000 })
        })
        test('파라미터가 유효하지 않으면 에러가 발생합니다.', () => {
            expect(() => {
                // @ts-expect-error
                saveGameData()
            }).toThrow()
            expect(() => {
                // @ts-expect-error
                saveGameData({ playtime: 1000 })
            }).toThrow()
            expect(() => {
                // @ts-expect-error
                saveGameData({ playtime: '1000' })
            }).toThrow()
            expect(() => {
                // @ts-expect-error
                saveGameData({ score: 1000 })
            }).toThrow()
            expect(() => {
                // @ts-expect-error
                saveGameData({ score: '1000' })
            }).toThrow()
        })
    })

    describe('getGameData', () => {
        test('데이터가 없으면 null을 반환합니다.', () => {
            expect(getGameData()).toBeNull()
            expect(() => getGameData()).not.toThrow()
        })
        test('데이터가 있으면 해당 데이터를 반환합니다.', () => {
            const data = { playtime: 1000, score: 1000 }
            saveGameData(data)
            expect(getGameData()).toEqual(data)
        })
    })

    describe('removeGameData', () => {
        test('저장된 데이터를 삭제합니다.', () => {
            const data = { playtime: 1000, score: 1000 }
            saveGameData(data)
            expect(getGameData()).toEqual(data)
            removeGameData()
            expect(getGameData()).toBeNull()
        })
        test('데이터 유무에 상관없이 호출할 수 있습니다.', () => {
            expect(() => removeGameData()).not.toThrow()
        })
    })
})
