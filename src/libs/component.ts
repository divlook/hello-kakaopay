import { genUid } from '~/libs/uid'

export interface KeyValue {
    [key: string]: any
}

export type Childs = {
    [key: string]: Component
}

export abstract class Component<Props = KeyValue> {
    static defaultProps = {}

    #uid: string
    #mountedCallback = () => {}
    #beforeUnmountCallback = () => {}
    #el: HTMLElement | null = null
    #props = {} as Props
    #isMounted = false

    parent!: Component
    childs: Childs = {}

    constructor(props?: Props) {
        // uid 생성
        this.#uid = genUid()

        // props 할당
        Object.assign(this.#props, Component.defaultProps, props || {})

        // 등록된 자식 컴포넌트에 부모 연결
        Object.keys(this.childs).forEach((key) => {
            this.childs[key].parent = this
        })
    }

    protected get uid() {
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

    /**
     * Render
     *
     * - 템플릿 루트는 반드시 하나의 요소로 이루어져 있어야함.
     * - 템플릿 루트는 반드시 `id="${this.uid}"` 속성을 포함해야함.
     *   - `<div id="${this.uid}">...</div>`
     */
    abstract render(): string

    mount(target: HTMLElement | null) {
        if (!target) {
            throw new Error('target이 없습니다.')
        }

        if (this.#isMounted) {
            console.log('mount가 이미 실행됨')
            return
        }

        this.#isMounted = true
        target.insertAdjacentHTML('beforeend', this.render())
        this.runCallbackWithChilds('mounted', this.childs)
    }

    unmount(): void {
        this.#isMounted = false
        this.runCallbackWithChilds('beforeUnmount', this.childs)
        this.el?.remove()
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

    private runCallbackWithChilds(
        type: 'mounted' | 'beforeUnmount',
        childs?: Childs
    ) {
        if (childs) {
            Object.keys(childs).forEach((key) => {
                const child = childs[key]
                this.runCallbackWithChilds(type, child.childs)

                switch (type) {
                    case 'mounted':
                        child.#mountedCallback?.()
                        break

                    case 'beforeUnmount':
                        child.#beforeUnmountCallback?.()
                        break
                }
            })
            return
        }

        this.runCallbackWithChilds(type, this.childs)

        switch (type) {
            case 'mounted':
                this.#mountedCallback?.()
                break

            case 'beforeUnmount':
                this.#beforeUnmountCallback?.()
                break
        }
    }
}

export default Component
