import { Component } from '~/libs/component'
import { Text } from '~/components/ui/Text'
import { Button } from '~/components/ui/Button'
import { Input } from '~/components/ui/Input'
import { getWordsApi, Word } from '~/api/words'
import { debounce, timer } from '~/libs/utils'

export class Main extends Component {
    childs = {
        keyword: new Text({ value: '문제 단어' }),
        message: new Text({ tag: 'h3', value: '' }),
        remainTime: new Text({ value: 0 }),
        score: new Text({ value: 0 }),
        button: new Button({
            text: '시작',
            onClick: () => this.onClickButton(),
        }),
        input: new Input({
            placeholder: '입력',
            disabled: true,
            onEnter: () => this.submitWord(),
            onInput: () => this.setMessage(''),
        }),
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
        isComplete: false,
        playtime: 0,
        score: 0,
    }

    render() {
        const {
            keyword,
            message,
            remainTime,
            score,
            button,
            input,
        } = this.childs

        this.onMounted(() => {
            message.hide()
        })

        return `
            <div class="page">
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
    }

    private onClickButton = () => {
        if (this.#isPlaying) {
            this.resetGame()
        } else {
            this.playGame()
        }
    }

    private setMessage(msg?: string) {
        const { message } = this.childs

        if (msg) {
            message.setValue(msg)
            message.show()
            return
        }

        message.setValue('')
        message.hide()
    }

    private playGame = debounce(async () => {
        const { score, button, input } = this.childs

        this.#isPlaying = true
        this.#words = await getWordsApi()

        this.#result.playtime = 0
        this.#result.score = this.#words.length

        button.setText('초기화')
        input.disable(false)
        score.setValue(this.#result.score)

        this.nextWord()
    })

    private resetGame = async () => {
        const { keyword, remainTime, score, button, input } = this.childs

        this.#isPlaying = false
        this.#words = []
        this.#wordIndex = -1
        this.gameTimer.stop()
        this.setMessage('')
        this.#result.playtime = 0
        this.#result.score = 0
        this.#result.isComplete = false

        keyword.setValue('문제 단어')
        button.setText('시작')
        remainTime.setValue(0)
        score.setValue(0)
        input.setValue('')
        input.disable()
    }

    private gameTimer = timer(async (count) => {
        const { remainTime, score } = this.childs

        remainTime.setValue(count)
        this.#remainSecond = count

        if (count > 0) {
            return
        }

        score.setValue(--this.#result.score)
        alert('시간이 초과하였습니다.')
        this.nextWord()
    })

    private nextWord = async () => {
        const { keyword, input } = this.childs
        const wordIndex = ++this.#wordIndex
        const currentWord = this.#words[wordIndex]

        if (currentWord) {
            this.gameTimer.start(currentWord.second)
            keyword.setValue(currentWord.text)
            this.setMessage('')
            input.setValue('')
            input.focus()
            return
        }

        // TODO: 결과페이지로 이동
        this.gameTimer.stop()
        this.#result.isComplete = true

        // TODO: 라우터 만든 후 이건 삭제
        input.setValue('')
        input.disable()
        keyword.setValue(`${this.#result.playtime}/${this.#result.score} : ${Math.round(this.#result.playtime / this.#result.score)}`)
        this.setMessage('끝')
    }

    private submitWord = async () => {
        const { input } = this.childs
        const wordIndex = this.#wordIndex
        const currentWord = this.#words[wordIndex]

        if (!currentWord) {
            return
        }

        if (!input.value) {
            this.setMessage('단어를 입력해주세요.')
            return
        }

        if (input.value !== currentWord.text) {
            this.setMessage('땡~! 틀렸습니다.')
            return
        }

        this.#result.playtime += currentWord.second - this.#remainSecond
        this.nextWord()
    }
}

export default Main
