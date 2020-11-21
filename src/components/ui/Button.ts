import { Component } from '~/libs/component'

export interface Props {
    text: string
    onClick?: (e: MouseEvent) => void
}

export class Button extends Component<Props> {
    defaultProps = {
        text: '버튼',
    }

    #text = ''

    get text() {
        return this.#text
    }

    render() {
        this.setText(this.props.text)

        this.onMounted(() => {
            this.el?.addEventListener('click', this.onClick)
        })

        this.onBeforeUnmount(() => {
            this.el?.removeEventListener('click', this.onClick)
        })

        return `
            <button id="${this.uid}" type="button">
                ${this.text}
            </button>
        `
    }

    setText(nextValue: string) {
        this.#text = nextValue

        if (this.el) {
            this.el.innerText = this.#text
        }
    }

    private onClick = (e: MouseEvent) => {
        this.props.onClick?.(e)
    }
}

export default Button
