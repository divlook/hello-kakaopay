import { apiUrl, getWordsApi } from '~/api/words'

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
        test('올바른 데이터가 반환됩니다.', async () => {
            const words = await getWordsApi()
            expect(words).toBeTruthy()
        })

        test('데이터가 배열입니다.', async () => {
            const words = await getWordsApi()
            expect(words).toBeInstanceOf(Array)
        })
    })
})
