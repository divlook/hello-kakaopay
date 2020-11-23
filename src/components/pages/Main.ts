import { Component } from '~/libs/component'
import { Text } from '~/components/ui/Text'
import { Button } from '~/components/ui/Button'
import { Input } from '~/components/ui/Input'
import { Context } from '~/components/Router'
import { getWordsApi, Word } from '~/api/words'
import { debounce, timer } from '~/libs/utils'
import { saveGameData, getGameData } from '~/libs/gamedata'
import * as msg from '~/libs/msg'

export class Main extends Component {
    childs = {
        keyword: new Text(),
        message: new Text(),
        remainTime: new Text(),
        score: new Text(),
        resetButton: new Button(),
        submitButton: new Button(),
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
            resetButton,
            submitButton,
            input,
        } = this.childs
        const playGame = debounce(playGameCallback)
        const gameTimer = timer(gameTimerCallback)
        const gameData = getGameData()

        keyword.setProps({ value: '문제 단어' })
        message.setProps({ tag: 'h3', value: '', hidden: true })
        remainTime.setProps({ value: 0 })
        score.setProps({ value: 0 })
        resetButton.setProps({
            text: '초기화',
            hidden: true,
            onClick: () => onClickResetButton(),
        })
        submitButton.setProps({
            text: '시작',
            type: 'submit',
            onClick: () => onClickSubmitButton(),
        })
        input.setProps({
            placeholder: '입력',
            disabled: true,
            onEnter: () => submitWord(),
            onInput: () => setMessage(msg.pleaseEnter),
        })

        this.onMounted(() => {
            if (gameData) {
                ctx.push('/complete')
                return
            }
        })

        this.onBeforeUnmount(() => {
            resetGame()
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
                    ${resetButton.render()}
                    ${submitButton.render()}
                </div>
            </div>
        `

        function onClickResetButton() {
            resetGame()
        }

        function onClickSubmitButton() {
            if (scope.#isPlaying) {
                submitWord()
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
            const { score, submitButton, resetButton, input } = scope.childs

            submitButton.disable()
            setMessage(msg.importingData)
            scope.#isPlaying = true
            scope.#words = await getWordsApi()
            submitButton.disable(false)
            setMessage()

            scope.#result.playtime = 0
            scope.#result.score = scope.#words.length

            resetButton.show()
            submitButton.setText('제출')
            input.disable(false)
            score.setValue(scope.#result.score)

            nextWord()
        }

        async function resetGame() {
            const {
                keyword,
                remainTime,
                score,
                resetButton,
                submitButton,
                input,
            } = scope.childs

            scope.#isPlaying = false
            scope.#words = []
            scope.#wordIndex = -1
            scope.#remainSecond = 0
            scope.#result.playtime = 0
            scope.#result.score = 0

            gameTimer.stop()
            setMessage('')

            keyword.setValue('문제 단어')
            resetButton.hide()
            submitButton.setText('시작')
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
            alert(msg.theTimeHasExpired)
            nextWord()
        }

        function nextWord() {
            const { keyword, input } = scope.childs
            const wordIndex = ++scope.#wordIndex
            const currentWord = scope.#words[wordIndex]

            if (currentWord) {
                gameTimer.start(currentWord.second)
                keyword.setValue(currentWord.text)
                setMessage(msg.pleaseEnter)
                input.setValue('')
                input.focus()
                return
            }

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
                setMessage(msg.pleaseEnterAWord)
                input.focus()
                return
            }

            if (input.value !== currentWord.text) {
                setMessage(msg.wrong)
                input.focus()
                return
            }

            scope.#result.playtime += currentWord.second - scope.#remainSecond
            nextWord()
        }
    }
}

export default Main
