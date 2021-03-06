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
    /**
     * 부모 컴포넌트
     *
     * parent 프로퍼티는 mount 실행 후 접근할 수 있습니다.
     */
    parent!: Component
    childs: Childs = {}

    constructor() {
        if (typeof this.render !== 'function') {
            throw new Error('추상 멤버 render를 구현하지 않았습니다.')
        }

        // uid 생성
        this.#uid = genUid()
    }

    get uid() {
        return this.#uid
    }

    get el() {
        if (this.#el) {
            return this.#el
        }

        return this.connectEl()
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

    /**
     * Show
     * - mount된 후 사용 가능
     */
    show() {
        if (this.el) {
            this.el.hidden = false
            this.#isHidden = false
        }
    }

    /**
     * Hide
     * - mount된 후 사용 가능
     */
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

    connectEl() {
        this.#el = document.getElementById(this.#uid)

        if (this.#el) {
            return this.#el
        }

        // prettier-ignore
        if (this.#isMounted) {
            let errorMsg = `#${this.#uid} Element를 찾을 수 없습니다.`
            errorMsg += '\n|'
            errorMsg += '\n| 루트 요소에 id 속성이 있는지 확인해주세요.'
            errorMsg += '\n| render() { return `<div id="${this.uid}">...</div>` }'
            errorMsg += '\n|'
            throw new Error(errorMsg)
        }

        return null
    }

    /**
     * 등록된 자식 컴포넌트에 부모 연결
     */
    connectParentToChilds() {
        Object.keys(this.childs).forEach((key) => {
            this.childs[key].parent = this
        })
    }

    private runCallbackWithChilds(type: 'mount' | 'unmount') {
        Object.keys(this.childs).forEach((key) => {
            const child = this.childs[key]
            child.runCallbackWithChilds(type)
        })

        switch (type) {
            case 'mount':
                this.#isMounted = true
                this.connectEl()
                this.connectParentToChilds()
                this.#mountedCallback?.()
                break

            case 'unmount':
                this.#beforeUnmountCallback?.()
                this.#el?.remove()
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
