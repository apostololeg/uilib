import cn from 'classnames';

import S from './Container.styl';
import * as T from './Container.types';

export function Container(props: T.Props) {
  const {
    className,
    children,
    size,
    alignItemsCenter,
    justifyContentCenter,
    vertical,
    fullHeight,
    fullWidth,
    scrolledX,
    scrolledY,
    style,
    ...rest
  } = props;
  const classes = cn(
    S.root,
    size && S[`size-${size}`],
    alignItemsCenter && S.alignItemsCenter,
    justifyContentCenter && S.justifyContentCenter,
    vertical && S.vertical,
    scrolledX && S.scrolledX,
    scrolledY && S.scrolledY,
    fullHeight && S.fullHeight,
    fullWidth && S.fullWidth,
    className
  );
  const stylesObj = { ...style } as any;

  return (
    <div className={classes} {...rest} style={stylesObj}>
      {children}
    </div>
  );
}
