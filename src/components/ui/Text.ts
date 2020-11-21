import { Component } from '~/libs/component'

export interface Props {
    value: string | number
    tag?: string
    hidden?: boolean
}

export class Text extends Component<Props> {
    defaultProps = {
        value: '',
        tag: 'i',
        hidden: false,
    }

    #value = ''

    get value() {
        return this.#value
    }

    render() {
        const { tag, hidden } = this.props

        this.setValue(this.props.value)

        return `
            <${tag}
                id="${this.uid}"
                ${hidden ? 'hidden' : ''}
            >
                ${this.value}
            </${tag}>
        `
    }

    setValue(nextValue: string | number) {
        const value = String(nextValue)
        this.#value = value

        if (this.el) {
            this.el.innerText = this.#value
        }
    }
}

export default Text
