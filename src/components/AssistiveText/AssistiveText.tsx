import { ComponentChild } from 'react';
import cn from 'classnames';

import S from './AssistiveText.styl';

type Props = {
  className?: string;
  size?: 's' | 'm' | 'l';
  variant?: 'default' | 'danger';
  children: ComponentChild;
  // style?: HTMLAttributes['style'];
};

export type AssistiveTextProps = Props;
export function AssistiveText(props: Props) {
  const {
    className,
    size = 'm',
    variant = 'default',
    children,
    ...rest
  } = props;

  return (
    <div
      className={cn(
        S.root,
        S[`size-${size}`],
        S[`variant-${variant}`],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
