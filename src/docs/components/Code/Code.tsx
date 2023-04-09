import { Component } from 'react';
import { withStore } from 'justorm/react';
import cn from 'classnames';
import compare from 'compareq';
import { Scroll, uid, Portal } from 'uilib';

import FullscreenButton from './FullscreenButton/FullscreenButton';
import Editor from './Editor/Editor';
import Result from './Result/Result';

import S from './Code.styl';
import Background from './Background';

type Props = {
  store?: any;
  scope?: object;
  code: string;
};

@withStore({ app: [], editor: ['isFullscreen'] })
export class Code extends Component<Props> {
  store;
  state = { inited: false };

  id = `editor-${uid.generateUID()}`;

  componentDidMount() {
    const { code, scope, store } = this.props;
    const { app, editor } = store;

    editor.scope = scope;
    editor.onChange(code, this.id);
    app.updateGradient();

    this.setState({ inited: true });
  }

  componentDidUpdate(prev: Props) {
    const {
      scope,
      store: { editor },
    } = this.props;

    if (!compare(prev.scope, scope)) {
      editor.scope = scope;
    }
  }

  isFullscreen = () => this.props.store.editor.isFullscreen;

  renderContent(content) {
    if (this.isFullscreen()) {
      return <Portal>{content}</Portal>;
    }

    return content;
  }

  render() {
    const isFullscreen = this.isFullscreen();
    return (
      <div className={cn(S.root, isFullscreen && S.fullscreen)} key="code">
        <Background />
        <Scroll
          y
          fadeSize="m"
          className={S.editorContainer}
          offset={{ y: { before: 50, after: 20 } }}
        >
          <Editor code={this.props.code} id={this.id} />
        </Scroll>
        <Result />
        <FullscreenButton isFullscreen={isFullscreen} />
      </div>
    );
  }
}
