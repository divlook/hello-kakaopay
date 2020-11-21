import { Component } from '~/libs/component'
import { Router } from '~/components/Router'
import { Main } from '~/components/pages/Main'
import { Complete } from '~/components/pages/Complete'

export class App extends Component {
    childs = {
        router: new Router(),
    }

    render() {
        const { router } = this.childs

        router.setProps({
            routes: [
                {
                    path: '/',
                    component: new Main(),
                },
                {
                    path: '/complete',
                    component: new Complete(),
                },
            ],
            fallback: '/',
        })

        return `
            <div id="${this.uid}">
                ${router.render()}
            </div>
        `
    }
}

export default App
