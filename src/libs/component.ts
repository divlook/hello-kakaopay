import { genUid } from '~/libs/uid'

export interface KeyValue {
    [key: string]: any
}

export abstract class Component<Props = KeyValue> {
    static defaultProps = {}

    #uid: string
    #el!: HTMLElement | null
    #props = {} as Props

    constructor(props?: Props) {
        this.#uid = genUid()
        Object.assign(this.#props, Component.defaultProps, props || {})
    }

    protected get uid() {
        return this.#uid
    }

    public get el() {
        if (!this.#el) {
            this.#el = document.getElementById(this.#uid)
        }
        return this.#el
    }

    public get props() {
        return this.#props
    }

    public abstract render(): string

    public mount(target: HTMLElement | null) {
        if (!target) {
            throw new Error('target이 없습니다.')
        }
        target.innerHTML = this.render()
    }
}

export default Component
