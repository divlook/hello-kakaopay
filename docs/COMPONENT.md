# Component class 소개

[HTML DOM Element](https://developer.mozilla.org/ko/docs/Web/API/Element)를 `component`단위로 관리하기 위한 라이브러리입니다.

## Example

```ts
import { Component } from '~/libs/component'

interface Props {
    text: string
}

class Div extends Component<Props> {
    render() {
        const { text } = this.props
        return `<div id="${this.uid}">${text}</div>`
    }
}

const div = new Div()
div.setProps({
    text: 'hello kakaopay',
})
div.mount(document.getElementById('app'))
```

위 코드의 결과물입니다.

```html
<div id="app">
    <div id="uid-1">hello kakaopay</div>
</div>
```
