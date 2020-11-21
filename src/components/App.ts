import { Component } from '~/libs/component'
import { Router } from '~/components/Router'
import { Main } from '~/components/pages/Main'
import { Complete } from '~/components/pages/Complete'

export class App extends Component {
    childs = {
        router: new Router({
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
        }),
    }

    render() {
        const { router } = this.childs

        return `
            <div id="${this.uid}">
                ${router.render()}
            </div>
        `
    }
}

export default App
