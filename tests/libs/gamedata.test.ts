import { getGameData, removeGameData, saveGameData } from '~/libs/gamedata'

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
