import * as helpers from 'helpers';
import { Heading, Link } from 'uilib';

import { ComponentLayout, TypesTable } from 'docs/components';

import example from '!!raw-loader!./Example';

const name = 'Scroll';
const Docs = () => (
  <>
    <p>
      UI component is a customizable scrollbar component that can be used to
      enable scrolling within a container element.
    </p>
    <p>
      It renders an outer container element and an inner container element,
      which contains the content to be scrolled.
    </p>{' '}
    <span>
      <Link inline href="/demo">
        Demo
      </Link>
    </span>
    <Heading id="Props" text="Props" />
    <TypesTable scope={name} type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={[
      { id: 'demo', label: 'Demo', code: example, scope: { helpers } },
    ]}
    scope={{}}
  />
);
