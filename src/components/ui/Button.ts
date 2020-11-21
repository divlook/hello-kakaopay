import { Component } from '~/libs/component'

export interface Props {
    text: string
    disabled?: boolean
    onClick?: (e: MouseEvent) => void
}

export class Button extends Component<Props> {
    defaultProps = {
        text: '버튼',
        disabled: false,
    }

    #text = ''

    get text() {
        return this.#text
    }

    render() {
        this.setText(this.props.text)

        const disabled = this.props.disabled

        this.onMounted(() => {
            this.el?.addEventListener('click', this.onClick)
        })

        this.onBeforeUnmount(() => {
            this.el?.removeEventListener('click', this.onClick)
        })

        return `
            <button
                id="${this.uid}"
                type="button"
                ${disabled ? 'disabled' : ''}
            >
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

    disable(disabled = true) {
        const el = this.el as HTMLButtonElement
        if (el) {
            el.disabled = disabled
        }
    }

    private onClick = (e: MouseEvent) => {
        this.props.onClick?.(e)
    }
}

export default Button
