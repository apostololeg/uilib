import { ComponentLayout, Code, ApiTable } from 'docs/components';
import example from '!!raw-loader!./Example';

import TYPES from '../../types.json';

export default () => (
  <ComponentLayout
    name="LightBox"
    code={<Code code={example} />}
    api={<ApiTable types={TYPES.LightBox.Props} />}
  />
);
