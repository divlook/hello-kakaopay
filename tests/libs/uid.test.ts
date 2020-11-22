import { genUid } from '~/libs/uid'

describe('getUid', () => {
    test(`첫번째 uid는 "uid-1"입니다.`, () => {
        const uid = genUid()
        expect(uid).toBe('uid-1')
    })

    test(`두번째 uid는 "uid-2"입니다.`, () => {
        const uid = genUid()
        expect(uid).toBe('uid-2')
    })
})
