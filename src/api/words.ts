import 'isomorphic-fetch'
import { useLocalCache } from '~/libs/utils'
import * as msg from '~/libs/msg'

export interface Word {
    second: number
    text: string
}

// prettier-ignore
export const apiUrl = 'https://my-json-server.typicode.com/kakaopay-fe/resources/words'

export const getWordsApi = async () => {
    const cache = useLocalCache<Word[]>('get-words-api')

    if (cache.check()) {
        return cache.get() as Word[]
    }

    return fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(msg.error)
            }
            return response.json()
        })
        .then((data: Word[]) => {
            cache.set(data)
            return data
        })
}
