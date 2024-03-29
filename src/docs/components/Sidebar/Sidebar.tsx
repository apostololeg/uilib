import { Fragment, memo, useCallback, useEffect, useState } from 'react';
import { withStore } from 'justorm/react';
import cn from 'classnames';

import { Link, Scroll, Expand } from 'uilib';
import { I18N } from 'docs/config/i18n';

import NAV_CONFIG from '../../navigation';

import S from './Sidebar.styl';

export const SidebarLink = withStore('app')(
  ({ path, label, store, ...rest }) => (
    <Link
      {...rest}
      href={path}
      key={path}
      className={S.link}
      onClick={store.app.toggleMenu}
    >
      <I18N id={label} />
    </Link>
  )
);

export default memo(
  withStore('router')(function Sidebar({ store }) {
    const { path } = store.router;
    const [openedGroup, setOpenedGroup] = useState(path.split('/')[1]);
    const [prevPath, setPrevPath] = useState(path);
    const onExpand = useCallback((group, isOpen) => {
      setOpenedGroup(isOpen ? group : null);
    }, []);

    useEffect(() => {
      if (path !== prevPath) {
        setOpenedGroup(null);
        setPrevPath(path);
      }
    }, [path]);

    const renderGroup = useCallback(
      ({ items, ...group }) => {
        if (!items) return null;

        const isOpen = openedGroup
          ? openedGroup === group.id
          : new RegExp(`^/${group.id}`).test(path);

        return (
          <Expand
            className={cn(S.item, isOpen && S.opened)}
            size="l"
            isOpen={isOpen}
            onChange={isExpanded => onExpand(group.id, isExpanded)}
            key={group.id}
            header={<I18N id={group.label} />}
            headerClassName={S.itemHeader}
            content={props => (
              <Scroll
                autoHide
                size="s"
                fadeSize="s"
                {...props}
                y
                offset={{ y: { before: 20, after: 20 } }}
                className={S.itemContent}
                innerClassName={S.itemContentInner}
              >
                {items.map(({ id, label }) => {
                  const path = `/${group.id}/${id}`;

                  return (
                    <Fragment key={id}>
                      <SidebarLink path={path} label={label || id} />
                      <div id={`sidebar-item-${id}`} className={S.subItems} />
                    </Fragment>
                  );
                })}
              </Scroll>
            )}
          />
        );
      },
      [openedGroup]
    );

    return <div className={S.root}>{NAV_CONFIG.map(renderGroup)}</div>;
  })
);
