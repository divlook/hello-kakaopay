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

    #text = this.defaultProps.text

    get text() {
        return this.#text
    }

    render() {
        const scope = this
        const disabled = this.props.disabled

        this.setText(this.props.text)

        this.onMounted(() => {
            this.el?.addEventListener('click', onClick)
        })

        this.onBeforeUnmount(() => {
            this.el?.removeEventListener('click', onClick)
            this.#text = this.defaultProps.text
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

        function onClick(e: MouseEvent) {
            scope.props.onClick?.(e)
        }
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
}

export default Button
