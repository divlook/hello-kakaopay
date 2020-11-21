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

    #type = this.defaultProps.type
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
        const scope = this
        const disabled = this.props.disabled

        this.setType(this.props.type)
        this.setPlaceholder(this.props.placeholder)
        this.setValue(this.props.value)

        this.onMounted(() => {
            this.el?.addEventListener('input', onInput)
            this.el?.addEventListener('keypress', onKeypress)
        })

        this.onBeforeUnmount(() => {
            this.el?.removeEventListener('input', onInput)
            this.el?.removeEventListener('keypress', onKeypress)
            this.#type = this.defaultProps.type
            this.#placeholder = ''
            this.#value = ''
        })

        return `
            <input
                id="${this.uid}"
                type="${this.type}"
                placeholder="${this.props.placeholder}"
                ${disabled ? 'disabled' : ''}
            />
        `

        function onInput(e: Event) {
            const el = scope.el as HTMLInputElement
            scope.setValue(el.value, false)
            scope.props.onInput?.(e as InputEvent)
        }

        function onKeypress(e: KeyboardEvent) {
            const isEnter = e.code === 'Enter' || e.key === 'Enter'

            if (isEnter) {
                scope.props.onEnter?.()
            }
        }
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
}

export default Input
