import { Component } from '~/libs/component'

export interface Props {
    /** default: 'text' */
    type?: 'text' | 'number'
    placeholder?: string
    value?: string
    disabled?: boolean
    onInput?: (e: InputEvent) => void
    onEnter?: () => void
}

const allowedTypes = new Set(['text', 'number'])

export class Input extends Component<Props> {
    defaultProps = {
        type: 'text',
        placeholder: '',
        value: '',
        disabled: false,
    }

    #type = ''
    #placeholder = ''
    #value = ''

    get type() {
        return this.#type as 'text' | 'number'
    }

    get placeholder() {
        return this.#placeholder
    }

    get value() {
        return this.#value
    }

    render() {
        this.setType(this.props.type)
        this.setPlaceholder(this.props.placeholder)
        this.setValue(this.props.value)

        const disabled = this.props.disabled

        this.onMounted(() => {
            this.el?.addEventListener('input', this.onInput)
            this.el?.addEventListener('keypress', this.onKeypress)
        })

        this.onBeforeUnmount(() => {
            this.el?.removeEventListener('input', this.onInput)
            this.el?.removeEventListener('keypress', this.onKeypress)
        })

        return `
            <input
                id="${this.uid}"
                type="${this.type}"
                placeholder="${this.props.placeholder}"
                ${disabled ? 'disabled' : ''}
            />
        `
    }

    setType(nextType?: 'text' | 'number') {
        if (nextType && !allowedTypes.has(nextType)) {
            throw new Error('허용되지 않은 type')
        }

        this.#type = nextType || this.defaultProps.type

        if (this.el) {
            this.el.setAttribute('type', this.#type)
        }
    }

    setPlaceholder(nextValue?: string) {
        this.#placeholder = nextValue || ''

        if (this.el) {
            this.el.setAttribute('placeholder', this.#placeholder)
        }
    }

    setValue(nextValue?: string, useDOMUpdate = true) {
        const el = this.el as HTMLInputElement

        if (typeof nextValue !== 'string') {
            return
        }

        this.#value = nextValue

        if (this.el && useDOMUpdate) {
            el.value = this.#value
        }
    }

    focus() {
        const el = this.el as HTMLInputElement
        el.focus?.()
    }

    disable(disabled = true) {
        const el = this.el as HTMLInputElement
        if (el) {
            el.disabled = disabled
        }
    }

    private onInput = (e: Event) => {
        const el = this.el as HTMLInputElement
        this.setValue(el.value, false)
        this.props.onInput?.(e as InputEvent)
    }

    private onKeypress = (e: KeyboardEvent) => {
        const isEnter = e.code === 'Enter' || e.key === 'Enter'

        if (isEnter) {
            this.props.onEnter?.()
        }
    }
}

export default Input
