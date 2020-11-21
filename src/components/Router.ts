import { Component } from '~/libs/component'

export interface Route {
    path: string
    component: Component
}

export interface HistoryState {
    path: string
    uid: string
}

export interface Props {
    routes: Route[]
    fallback?: string
}

export interface Context {
    router: Router
    push: (path: string) => void
    back: () => void
}

export class Router extends Component<Props> {
    #routes!: Route[]
    #fallback!: string
    #memo = new Map<string, Route>()
    #currentRoute!: Route
    #history: Route[] = []

    get routes() {
        return this.#routes
    }

    get currentRoute() {
        return this.#currentRoute
    }

    get fallback() {
        return this.#fallback
    }

    get context(): Context {
        return {
            router: this,
            push: (path) => this.push(path),
            back: () => this.back(),
        }
    }

    render() {
        if (!this.props.routes || this.props.routes.length === 0) {
            throw new Error('routes가 필요합니다.')
        }

        this.#routes = this.props.routes
        this.#fallback = this.props.fallback || '/'

        this.onMounted(() => {
            const currentPath = location.pathname
            const currentRoute = this.match(currentPath)
            this.init(currentRoute)
            this.mountMatchedComponent(currentRoute)
        })

        return `<div id="${this.uid}"></div>`
    }

    push(path: string) {
        if (!path || typeof path !== 'string') {
            throw new Error('유효하지 않은 path입니다.')
        }

        if (this.currentRoute) {
            this.#history.push(this.currentRoute)
        }

        const nextRoute = this.match(path)
        history.pushState(this.routeToState(nextRoute), document.title, path)

        this.mountMatchedComponent(path)
    }

    back() {
        history.back()
    }

    private init(initRoute: Route) {
        history.replaceState(this.routeToState(initRoute), document.title)

        window.addEventListener('popstate', (e) => {
            const historyState: HistoryState = e.state
            const path = historyState?.path ?? this.fallback
            const route = this.match(path)

            const lastRoute = this.#history[this.#history.length - 1]

            if (lastRoute && lastRoute.path === route.path) {
                this.#history.pop()
            } else {
                this.#history.push(route)
            }

            this.mountMatchedComponent(route)
        })
    }

    private mountMatchedComponent(pathOrRoute: string | Route) {
        const route =
            typeof pathOrRoute === 'string'
                ? this.match(pathOrRoute)
                : pathOrRoute

        if (!route) {
            throw new Error('일치하는 route가 없음.')
        }

        if (this.#currentRoute) {
            this.#currentRoute.component.unmount()
        }

        this.#currentRoute = route
        this.#currentRoute.component.mount(this.el, this.context)
    }

    private match(path: string): Route {
        const memoRoute = this.#memo.get(path)

        if (memoRoute) {
            return memoRoute
        }

        const route = this.routes.find((route) => route.path === path)

        if (route) {
            this.#memo.set(path, route)
            return route
        }

        if (path === this.fallback) {
            throw new Error('fallback route가 없습니다.')
        }

        return this.match(this.fallback)
    }

    private routeToState(route: Route): HistoryState {
        return {
            uid: route.component.uid,
            path: route.path,
        }
    }
}

export default Router
