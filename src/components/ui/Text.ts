import { Component } from '~/libs/component'

export interface Props {
    value: string | number
    tag?: string
}

export class Text extends Component<Props> {
    static defaultProps = {
        value: '',
        tag: 'i',
    }

    #value = ''

    get value() {
        return this.#value
    }

    render() {
        const { tag } = this.props

        this.setValue(this.props.value)

        return `<${tag} id="${this.uid}">${this.value}</${tag}>`
    }

    public setValue(nextValue: string | number) {
        const value = String(nextValue)
        this.#value = value

        if (this.el) {
            this.el.innerText = this.#value
        }
    }
}

export default Text
