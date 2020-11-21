import { genUid } from '~/libs/uid'

export interface KeyValue {
    [key: string]: any
}

export type Childs = {
    [key: string]: Component
}

export abstract class Component<Props = KeyValue> {
    #uid: string
    #mountedCallback = () => {}
    #beforeUnmountCallback = () => {}
    #el: HTMLElement | null = null
    #props = {} as Props
    #isMounted = false
    #isHidden = false

    defaultProps = {}
    parent!: Component
    childs: Childs = {}

    constructor() {
        // uid 생성
        this.#uid = genUid()

        // 등록된 자식 컴포넌트에 부모 연결
        Object.keys(this.childs).forEach((key) => {
            this.childs[key].parent = this
        })
    }

    get uid() {
        return this.#uid
    }

    get el() {
        if (!this.#el) {
            this.#el = document.getElementById(this.#uid)
        }
        return this.#el
    }

    get props() {
        return this.#props
    }

    get isMounted() {
        return this.#isMounted
    }

    get isHidden() {
        return this.#isHidden
    }

    /**
     * Render
     *
     * - 템플릿 루트는 반드시 하나의 요소로 이루어져 있어야함.
     * - 템플릿 루트는 반드시 `id="${this.uid}"` 속성을 포함해야함.
     *   - `<div id="${this.uid}">...</div>`
     */
    abstract render(ctx?: any): string

    mount(target: HTMLElement | null, ctx?: any) {
        if (!target) {
            throw new Error('target이 없습니다.')
        }

        if (this.#isMounted) {
            console.log('mount가 이미 실행됨')
            return
        }

        target.insertAdjacentHTML('beforeend', this.render(ctx))
        this.runCallbackWithChilds('mount')
    }

    unmount(): void {
        this.runCallbackWithChilds('unmount')
    }

    /**
     * On mounted
     *
     * - 첫번째 렌더링에서만 실행됨.
     * - render 메서드 안에서 호출해야함.
     */
    onMounted(cb: () => void) {
        this.#mountedCallback = cb
    }

    /**
     * On before unmount
     *
     * unmount 메서드를 사용했을 때 실행됨.
     * render 메서드 안에서 호출해야함.
     */
    onBeforeUnmount(cb: () => void) {
        this.#beforeUnmountCallback = cb
    }

    show() {
        if (this.el) {
            this.el.hidden = false
            this.#isHidden = false
        }
    }

    hide() {
        if (this.el) {
            this.el.hidden = true
            this.#isHidden = true
        }
    }

    setProps(props: Props = {} as Props) {
        this.#props = {
            ...this.defaultProps,
            ...this.#props,
            ...props,
        }
    }

    private runCallbackWithChilds(type: 'mount' | 'unmount') {
        Object.keys(this.childs).forEach((key) => {
            const child = this.childs[key]
            child.runCallbackWithChilds(type)
        })

        switch (type) {
            case 'mount':
                this.#isMounted = true
                this.#mountedCallback?.()
                break

            case 'unmount':
                this.#beforeUnmountCallback?.()
                this.el?.remove()
                this.#el = null
                this.#props = {} as Props
                this.#isMounted = false
                this.#isHidden = false
                this.#mountedCallback = () => {}
                this.#beforeUnmountCallback = () => {}
                break
        }
    }
}

export default Component
