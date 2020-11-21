import { Component } from '~/libs/component'
import { Text } from '~/components/ui/Text'
import { Button } from '~/components/ui/Button'
import { Input } from '~/components/ui/Input'
import { Context } from '~/components/Router'
import { getWordsApi, Word } from '~/api/words'
import { debounce, saveGameData, getGameData, timer } from '~/libs/utils'

export class Main extends Component {
    childs = {
        keyword: new Text(),
        message: new Text(),
        remainTime: new Text(),
        score: new Text(),
        button: new Button(),
        input: new Input(),
    }

    #words: Word[] = []
    #isPlaying = false
    /**
     * 단어의 index
     * - 범위 : 0 ~ 단어수
     * - 게임 시작전에는 -1
     */
    #wordIndex = -1
    #remainSecond = 0
    #result = {
        playtime: 0,
        score: 0,
    }

    render(ctx: Context) {
        const scope = this
        const {
            keyword,
            message,
            remainTime,
            score,
            button,
            input,
        } = this.childs
        const playGame = debounce(playGameCallback)
        const gameTimer = timer(gameTimerCallback)
        const gameData = getGameData()

        keyword.setProps({ value: '문제 단어' })
        message.setProps({ tag: 'h3', value: '' })
        remainTime.setProps({ value: 0 })
        score.setProps({ value: 0 })
        button.setProps({
            text: '시작',
            onClick: () => onClickButton(),
        })
        input.setProps({
            placeholder: '입력',
            disabled: true,
            onEnter: () => submitWord(),
            onInput: () => setMessage(''),
        })

        this.onMounted(() => {
            if (gameData) {
                ctx.push('/complete')
                return
            }
            message.hide()
        })

        return `
            <div id="${this.uid}" class="page">
                <div class="header">
                    <div>남은 시간 : ${remainTime.render()}초</div>
                    <div>점수 : ${score.render()}점</div>
                </div>

                <div class="notice">
                    <h1>${keyword.render()}</h1>
                    ${message.render()}
                </div>

                <div class="input">
                    ${input.render()}
                </div>

                <div class="action">
                    ${button.render()}
                </div>
            </div>
        `

        function onClickButton() {
            if (scope.#isPlaying) {
                resetGame()
            } else {
                playGame()
            }
        }

        function setMessage(msg?: string) {
            const { message } = scope.childs

            if (msg) {
                message.setValue(msg)
                message.show()
                return
            }

            message.setValue('')
            message.hide()
        }

        async function playGameCallback() {
            const { score, button, input } = scope.childs

            scope.#isPlaying = true
            scope.#words = await getWordsApi()

            scope.#result.playtime = 0
            scope.#result.score = scope.#words.length

            button.setText('초기화')
            input.disable(false)
            score.setValue(scope.#result.score)

            nextWord()
        }

        async function resetGame() {
            const { keyword, remainTime, score, button, input } = scope.childs

            scope.#isPlaying = false
            scope.#words = []
            scope.#wordIndex = -1
            gameTimer.stop()
            setMessage('')
            scope.#result.playtime = 0
            scope.#result.score = 0

            keyword.setValue('문제 단어')
            button.setText('시작')
            remainTime.setValue(0)
            score.setValue(0)
            input.setValue('')
            input.disable()
        }

        function gameTimerCallback(count: number) {
            const { remainTime, score } = scope.childs

            remainTime.setValue(count)
            scope.#remainSecond = count

            if (count > 0) {
                return
            }

            score.setValue(--scope.#result.score)
            alert('시간이 초과하였습니다.')
            nextWord()
        }

        function nextWord() {
            const { keyword, input } = scope.childs
            const wordIndex = ++scope.#wordIndex
            const currentWord = scope.#words[wordIndex]

            if (currentWord) {
                gameTimer.start(currentWord.second)
                keyword.setValue(currentWord.text)
                setMessage('')
                input.setValue('')
                input.focus()
                return
            }

            gameTimer.stop()
            saveGameData(scope.#result)
            ctx.push('/complete')
        }

        function submitWord() {
            const { input } = scope.childs
            const wordIndex = scope.#wordIndex
            const currentWord = scope.#words[wordIndex]

            if (!currentWord) {
                return
            }

            if (!input.value) {
                setMessage('단어를 입력해주세요.')
                return
            }

            if (input.value !== currentWord.text) {
                setMessage('땡~! 틀렸습니다.')
                return
            }

            scope.#result.playtime += currentWord.second - scope.#remainSecond
            nextWord()
        }
    }
}

export default Main
