import { genUid } from '~/libs/uid'

export interface KeyValue {
    [key: string]: any
}

export abstract class Component<Props = KeyValue> {
    static defaultProps = {}

    #uid: string
    #target: HTMLElement | null = null
    #targetHTML = ''
    #beforeUnmountCallback = () => {}
    #el: HTMLElement | null = null
    #props = {} as Props
    #mounted = false

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

    /**
     * Render
     *
     * - 템플릿 루트는 반드시 하나의 요소로 이루어져 있어야함.
     * - 템플릿 루트는 반드시 `id=${this.uid}` 속성을 포함해야함.
     *   - `<div id=${this.uid}>...</div>`
     */
    public abstract render(): string

    public mount(target: HTMLElement | null) {
        if (!target) {
            throw new Error('target이 없습니다.')
        }
        this.#target = target
        this.#targetHTML = target.innerHTML
        this.#target.innerHTML = this.render()
    }

    public unmount(): void {
        this.#mounted = false
        this.#beforeUnmountCallback?.()
        this.#beforeUnmountCallback = () => {}
        if (this.#target) {
            this.#target.innerHTML = this.#targetHTML
        }
    }

    /**
     * On mounted
     *
     * - 첫번째 렌더링에서만 실행됨.
     * - render 메서드 안에서 호출해야함.
     */
    public onMounted(cb: () => void) {
        if (!this.#mounted) {
            this.#mounted = true
            cb?.()
        }
    }

    /**
     * On before unmount
     *
     * unmount 메서드를 사용했을 때 실행됨.
     * render 메서드 안에서 호출해야함.
     */
    public onBeforeUnmount(cb: () => void) {
        this.#beforeUnmountCallback = cb
    }
}

export default Component
