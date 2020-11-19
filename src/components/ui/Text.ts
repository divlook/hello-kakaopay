import { Component } from '~/libs/component'

export interface Props {
    value: string | number
}

export class Text extends Component<Props> {
    static defaultProps = {
        value: '',
    }

    #value = ''

    get value() {
        return this.#value
    }

    render() {
        this.setValue(this.props.value)

        return `<i id="${this.uid}">${this.value}</i>`
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
