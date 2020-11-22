import { App } from '~/components/App'

describe('Index Page', () => {
    let app: App

    test('body 안에 #app 요소 생성', () => {
        expect(() => {
            document.body.innerHTML = `<div id="app"></div>`
        }).not.toThrow()
    })

    test('App 컴포넌트 인스턴스 생성', () => {
        expect(() => {
            app = new App()
        }).not.toThrow()
    })

    test('isMounted = false', () => {
        expect(app.isMounted).toBe(false)
    })

    test('#app 요소에 mount', () => {
        expect(() => {
            app.mount(document.getElementById('app'))
        }).not.toThrow()
    })

    test('isMounted = true', () => {
        expect(app.isMounted).toBe(true)
    })

    test('#app === app.el.parentElement', () => {
        expect(document.getElementById('app')).toBe(app.el?.parentElement)
    })

    test('app.unmount()', () => {
        expect(() => {
            app.unmount()
        }).not.toThrow()
    })

    test('isMounted = false', () => {
        expect(app.isMounted).toBe(false)
    })

    test('app.el === null', () => {
        expect(app.el).toBeNull()
    })

    test('#app 요소는 비어있습니다.', () => {
        expect(document.getElementById('app')?.childElementCount).toBe(0)
    })
})
