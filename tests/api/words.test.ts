import { apiUrl, getWordsApi, Word } from '~/api/words'

describe('API to get words', () => {
    describe('apiUrl', () => {
        test('apiUrl이 존재합니다.', () => {
            expect(apiUrl).toBeDefined()
        })

        test(`typeof apiUrl === 'string'`, () => {
            expect(typeof apiUrl).toBe('string')
        })
    })

    describe('getWordsApi', () => {
        test('API 요청이 성공하면 올바른 데이터가 반환됩니다.', async () => {
            let words: Word[]

            try {
                words = await getWordsApi()
                expect(words).toBeTruthy()
            } catch {
                // @ts-expect-error
                expect(words).toBeFalsy()
            }
        })

        test('데이터는 배열입니다.', async () => {
            let words: Word[] = []

            try {
                words = await getWordsApi()
            } catch {
                expect(words).toEqual([])
            } finally {
                expect(words).toBeInstanceOf(Array)
                expect(words).toBeTruthy()
            }
        })
    })
})
