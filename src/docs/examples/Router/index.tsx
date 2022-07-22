import { ComponentLayout, Code, ApiTable } from 'docs/components';

import TYPES from '../../types.json';

import example from '!!raw-loader!./Example';

export default () => (
  <ComponentLayout
    name="Router"
    code={<Code code={example} />}
    api={<ApiTable types={TYPES.Router.Props} />}
  />
);
