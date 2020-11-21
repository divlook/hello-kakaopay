import { Component } from '~/libs/component'

export interface Route {
    /** path는 항상 '/'로 시작해야합니다. */
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
    /** path는 항상 '/'로 시작해야합니다. */
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

    get publicPath() {
        return process.env.PUBLIC_PATH
    }

    get context(): Context {
        return {
            router: this,
            push: (path) => this.push(path),
            back: () => this.back(),
        }
    }

    render() {
        const scope = this

        validateProps()

        this.#routes = this.props.routes
        this.#fallback = this.props.fallback || '/'

        this.onMounted(() => {
            const currentPath = location.pathname
            const currentRoute = this.match(currentPath)

            init(currentRoute)
            this.mountMatchedComponent(currentRoute)
        })

        return `<div id="${this.uid}"></div>`

        function init(initRoute: Route) {
            history.replaceState(scope.routeToState(initRoute), document.title)

            window.addEventListener('popstate', (e) => {
                const historyState: HistoryState = e.state
                const path = historyState?.path ?? scope.fallback
                const route = scope.match(path)

                const lastRoute = scope.#history[scope.#history.length - 1]

                if (lastRoute && lastRoute.path === route.path) {
                    scope.#history.pop()
                } else {
                    scope.#history.push(route)
                }

                scope.mountMatchedComponent(route)
            })
        }

        function validateProps() {
            if (!scope.props.routes || scope.props.routes.length === 0) {
                throw new Error('routes가 필요합니다.')
            }
        }
    }

    push(path: string) {
        if (!path || typeof path !== 'string') {
            throw new Error('유효하지 않은 path입니다.')
        }

        if (!/^\//.test(path)) {
            throw new Error(`path는 항상 '/'로 시작해야합니다.`)
        }

        if (this.currentRoute) {
            this.#history.push(this.currentRoute)
        }

        const nextRoute = this.match(path)
        const nextState = this.routeToState(nextRoute)
        const nextPath = this.joinPublicPath(path)

        history.pushState(nextState, document.title, nextPath)

        this.mountMatchedComponent(path)
    }

    back() {
        history.back()
    }

    joinPublicPath(path: string) {
        if (this.publicPath === '/') {
            return path
        }

        if (this.publicPath === '') {
            return path.replace(/^\//, '')
        }

        return `${this.publicPath.replace(/\/$/, '')}${path}`
    }

    routeToState(route: Route): HistoryState {
        return {
            uid: route.component.uid,
            path: route.path,
        }
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
}

export default Router
