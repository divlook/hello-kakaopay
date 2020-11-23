# Component class 소개

[HTML DOM Element](https://developer.mozilla.org/ko/docs/Web/API/Element)를 `component`단위로 관리하기 위한 라이브러리입니다.

## Example

```ts
import { Component } from '~/libs/component'

interface Props {
    company: string
}

class Div extends Component<Props> {
    render() {
        const { company } = this.props
        return `
            <div id="${this.uid}">
                hello ${company}
            </div>
        `
    }
}

const div = new Div()
div.setProps({
    company: 'kakaopay',
})
div.mount(document.getElementById('app'))
```

위 코드의 결과물입니다.

```html
<div id="app">
    <div id="uid-1">hello kakaopay</div>
</div>
```

## 필수 구현 요소

- Component class는 추상화 class이기 때문에 반드시 새로운 class에 상속되도록 작성해야합니다.
- Component class는 추상 멤버 render를 반드시 구현해야합니다.

### render 구현 가이드

- 추상 멤버 render는 문자열로 된 HTML 템플릿을 반환해야합니다.
- 템플릿 루트는 반드시 하나의 Element로 구현해야됩니다.
- 템플릿 루트의 id는 반드시 `this.uid`로 구현해야됩니다.

```ts
class Div extends Component<Props> {
    render() {
        return `
            <div id="${this.uid}">
                이 것은 render
            </div>
        `
    }
}
```

## 기본 가이드

### Props

`props`를 사용하여 렌더링 전에 기본 값을 설정할 수 있습니다.

#### Props 초기화

- Props 초기화 컴포넌트를 생성하고 생성된 인스턴스의 `setProps` 프로퍼티로 할 수 있습니다.
- Props는 첫번째 렌더링때만 적용됩니다.

#### defaultProps

- `defaultProps` 프로퍼티로 props의 기본값을 설정할 수 있습니다.

#### 예제

```ts
class Div extends Component {
    defaultProps = {
        company: '없음'
    }

    render() {
        const { company } = this.props

        return `<div id="${this.uid}">${company}</div>`
    }
}

const div = new Div()

div.setProps({
    company: 'kakaopay',
})

div.mount(app)
```

### Parent / Childs

컴포넌트 내에서 다른 컴포넌트를 사용하기 위해서는 다른 컴포넌트를 childs 프로퍼티에 등록해야됩니다.

#### parent 프로퍼티

- 자식 컴포넌트는 parent 프로퍼티를 통해 부모 컴포넌트에 접근할 수 있습니다.
- parent 프로퍼티는 mount된 후 접근할 수 있습니다.

#### 자식 컴포넌트 props 초기화

자식 컴포넌트의 props는 부모 컴포넌트의 render에서 초기화해야됩니다.

```ts
class Div extends Component {
    childs = {
        span: new Text(),
    }
    render() {
        const { span } = this.childs

        span.setProps({
            value: '가나다라',
            tag: 'span',
        })

        return `
            <div id="${this.uid}">
                ${span.render()}
            </div>
        `
    }
}
```

### Lifecycle callback

Component class는 2가지 Lifecycle callback이 존재합니다.

- onMounted
- onBeforeUnmount

Lifecycle callback은 render 프로퍼티 내부에서 사용할 수 있습니다.

#### onMounted

해당 컴포넌트 또는 최상위 부모 컴포넌트가 mount된 후 발생하는 콜백입니다.

#### onBeforeUnmount

해당 컴포넌트 또는 최상위 부모 컴포넌트가 unmount되기 전에 발생하는 콜백입니다.

#### 예제

```ts
class Div extends Component {
    render() {
        console.log(this.el === null) // true
        console.log(this.isMounted) // false

        this.onMounted(() => {
            console.log(this.el === null) // false
            console.log(this.isMounted) // true
        })

        this.onBeforeUnmount(() => {
            console.log(this.el === null) // false
            console.log(this.isMounted) // true
        })

        return `
            <div id="${this.uid}">
                가나다라
            </div>
        `
    }
}
```
