import { useLocalCache } from '~/libs/utils'

export interface Word {
    second: number
    text: string
}

const isProd = process.env.NODE_ENV === 'production'

// prettier-ignore
export const apiUrl = 'https://my-json-server.typicode.com/kakaopay-fe/resources/words'

export const getWordsApi = () => {
    const cache = useLocalCache<Word[]>('get-words-api', !isProd)

    if (cache.check()) {
        return cache.get()
    }

    return fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error('서버 에러가 발생하였습니다.')
            }
            return response.json()
        })
        .then((data: Word[]) => {
            cache.set(data)
            return data
        })
        .catch((error) => {
            if (error.message) {
                alert(error.message)
            }
            console.error(error)
            return [] as Word[]
        })
}
