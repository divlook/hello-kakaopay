import { Component } from '~/libs/component'
import { Main } from '~/components/pages/Main'
// import { Complete } from '~/components/pages/Complete'

export class App extends Component {
    childs = {
        main: new Main(),
        // complete: new Complete(),
    }

    render() {
        const { main } = this.childs

        return `
            <div id="${this.uid}">
                ${main.render()}
            </div>
        `
    }
}

export default App
