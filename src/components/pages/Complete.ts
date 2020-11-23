import { Component } from '~/libs/component'
import { getGameData, removeGameData } from '~/libs/gamedata'
import { Button } from '~/components/ui/Button'
import { Context } from '~/components/Router'

export class Complete extends Component {
    childs = {
        button: new Button(),
    }

    render(ctx: Context) {
        const { button } = this.childs
        const gameData = getGameData()
        const score = gameData?.score ?? 0
        const playtime = gameData?.playtime ?? 0
        const averageTime = Math.round(playtime / score)

        button.setProps({
            text: '다시 시작',
            onClick: () => replay(),
        })

        this.onMounted(() => {
            if (!gameData) {
                ctx.push('/')
            }
        })

        return `
            <div id="${this.uid}" class="page">
                <div class="header">
                    <h2>Mission Complete!</h2>
                </div>

                <div class="notice">
                    <h1>당신의 점수는 ${score}점입니다.</h1>
                    <h3>단어당 평균 답변 시간은 ${averageTime}초입니다.</h3>
                </div>

                <div class="action">
                    ${button.render()}
                </div>
            </div>
        `

        function replay() {
            removeGameData()
            ctx.push('/')
        }
    }
}

export default Complete
