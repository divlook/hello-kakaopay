import { Component } from '~/libs/component'
import { Text } from '~/components/ui/Text'

interface Scope {
    app: HTMLElement | null
    component?: Component
    save(component: Component): Component
}

const scope: Scope = {
    app: null,
    save(component) {
        if (scope.component) {
            if (scope.component.isMounted) {
                scope.component.unmount()
            }
        }
        scope.component = component
        return component
    },
}

describe('Component', () => {
    beforeAll(() => {
        document.body.innerHTML = `<div id="app"></div>`
        scope.app = document.getElementById('app')
    })

    afterAll(() => {
        const { component } = scope

        document.body.innerHTML = ''
        scope.app = null

        if (component?.isMounted) {
            component.unmount()
        }
    })

    describe('인스턴스 생성을 위한 필수 사항', () => {
        test('추상 멤버 render를 구현하지 않으면 에러가 발생합니다.', () => {
            expect(() => {
                // @ts-expect-error
                class Div extends Component {}
                new Div()
            }).toThrow()
        })

        test('템플릿 루트 요소에 id 속성이 없으면 에러가 발생합니다.', () => {
            const { app, save } = scope

            expect(() => {
                class Div extends Component {
                    render() {
                        return `<div>가나다라</div>`
                    }
                }

                const div = new Div()
                save(div).mount(app)
            }).toThrow()
        })

        test('`<div id="${this.uid}">가나다라</div>`', () => {
            const { app, save } = scope

            expect(() => {
                class Div extends Component {
                    render() {
                        return `<div id="${this.uid}">가나다라</div>`
                    }
                }

                const div = new Div()
                save(div).mount(app)
            })
        })
    })

    describe('Props', () => {
        test('인스턴스를 생성하면 props는 빈 객체입니다.', () => {
            const { save } = scope

            class Div extends Component {
                render() {
                    return `<div id="${this.uid}">가나다라</div>`
                }
            }

            const div = new Div()
            save(div)

            expect(div.props).toEqual({})
        })

        test('setProps 메서드로 props를 초기화합니다.', () => {
            const { app, save } = scope

            class Div extends Component {
                render() {
                    return `<div id="${this.uid}">가나다라</div>`
                }
            }

            const div = new Div()
            div.setProps({
                kakaopay: '카카오페이',
            })
            save(div).mount(app)

            expect(div.props.kakaopay).toEqual('카카오페이')
        })

        test('defaultProps property로 props의 기본값을 지정합니다.', () => {
            const { app, save } = scope

            class Div extends Component {
                defaultProps = {
                    kakaopay: '카카오페이',
                }
                render() {
                    return `<div id="${this.uid}">가나다라</div>`
                }
            }

            const div = new Div()
            div.setProps()
            save(div).mount(app)

            expect(div.props.kakaopay).toEqual('카카오페이')
        })
    })

    describe('Parent / Childs', () => {
        test('컴포넌트 내에서 다른 컴포넌트를 사용하기 위해서는 childs 프로퍼티에 등록해야됩니다.', (done) => {
            const { app, save } = scope

            class Div extends Component {
                childs = {
                    span: new Text(),
                }
                render() {
                    const { span } = this.childs

                    expect(span).toBeInstanceOf(Component)

                    span.setProps({
                        value: '가나다라',
                        tag: 'span',
                    })

                    this.onMounted(() => {
                        if (span.el) {
                            const { tagName, textContent } = span.el
                            expect(tagName.toLowerCase()).toEqual('span')
                            expect(textContent?.trim()).toEqual('가나다라')
                        }

                        done()
                    })

                    return `
                        <div id="${this.uid}">
                            ${span.render()}
                        </div>
                    `
                }
            }

            const div = new Div()
            save(div).mount(app)
        })

        test('parent 프로퍼티는 mount 실행 후 접근할 수 있습니다.', () => {
            const { app, save } = scope

            class Div extends Component {
                childs = {
                    span: new Text(),
                }
                render() {
                    const { span } = this.childs

                    return `
                        <div id="${this.uid}">
                            ${span.render()}
                        </div>
                    `
                }
            }

            const div = new Div()
            save(div).mount(app)

            expect(div.childs.span.parent).toBeInstanceOf(Component)
        })

        test('생성된 컴포넌트의 uid는 모두 다릅니다.', () => {
            const { app, save } = scope

            class Div extends Component {
                childs = {
                    span: new Text(),
                    a: new Text(),
                    i: new Text(),
                    p: new Text(),
                }
                render() {
                    const { a, span, i, p } = this.childs

                    return `
                        <div id="${this.uid}">
                            ${span.render()}
                            ${a.render()}
                            ${i.render()}
                            ${p.render()}
                        </div>
                    `
                }
            }

            const div = new Div()
            save(div).mount(app)

            const memo = new Set([div.uid])
            const isDuplicated = Object.values(div.childs).some((child) => {
                if (memo.has(child.uid)) {
                    return true
                }
                memo.add(child.uid)
                return false
            })

            expect(isDuplicated).toBe(false)
        })
    })

    describe('onMounted / onBeforeUnmount', () => {
        test('onMounted : mount가 실행되었을 때', (done) => {
            const { app, save } = scope
            const callback = jest.fn()

            class Div extends Component {
                render() {
                    expect(this.isMounted).toBe(false)

                    this.onMounted(() => {
                        expect(this.isMounted).toBe(true)
                        callback()
                        done()
                    })

                    return `
                        <div id="${this.uid}">
                            가나다라
                        </div>
                    `
                }
            }

            const div = new Div()
            save(div).mount(app)

            expect(callback).toBeCalledTimes(1)
        })

        test('onBeforeUnmount : unmount가 실행되었을 때', (done) => {
            const { app, save } = scope
            const callback = jest.fn()

            class Div extends Component {
                render() {
                    this.onMounted(() => {
                        this.unmount()
                    })

                    this.onBeforeUnmount(() => {
                        expect(this.isMounted).toBe(true)
                        callback()
                        done()
                    })

                    return `
                        <div id="${this.uid}">
                            가나다라
                        </div>
                    `
                }
            }

            const div = new Div()
            save(div).mount(app)

            expect(callback).toBeCalledTimes(1)
        })
    })

    describe('show / hide', () => {
        test('show', () => {
            const { app, save } = scope

            class Div extends Component {
                render() {
                    this.onMounted(() => {
                        this.show()

                        expect(this.isHidden).toBe(false)
                        expect(this.el!.hidden).toBe(false)
                    })
                    return `<div id="${this.uid}">가나다라</div>`
                }
            }

            const div = new Div()
            save(div).mount(app)
        })

        test('hide', () => {
            const { app, save } = scope

            class Div extends Component {
                render() {
                    this.onMounted(() => {
                        this.hide()

                        expect(this.isHidden).toBe(true)
                        expect(this.el!.hidden).toBe(true)
                    })
                    return `<div id="${this.uid}">가나다라</div>`
                }
            }

            const div = new Div()
            save(div).mount(app)
        })
    })
})
