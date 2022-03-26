import { withStore } from 'justorm/react';
import { Router, Link } from 'uilib';

const HomeLink = () => <Link href="/">Home</Link>;
const Home = () => (
  <>
    <Link href="/">Home</Link>
    > <Link href="/users">Users</Link>
  </>
);
const UsersPage = () => (
  <>
    <HomeLink />
    > <Link href="/users">Users</Link>
    <br />
    <Link href="/users/azaza">azaza</Link>
    <Link href="/users/ololosh">ololosh</Link>
  </>
);
const UserPage = ({ id, rootPath }) => {
  const currPage = `/users/${id}`;

  return (
  <>
    <HomeLink />
    > <Link href="/users">Users</Link>
    > <Link href={currPage}>{id}</Link>
    <br />
    <Router rootPath={`${rootPath}${currPage}`}>
      <UserMenu id={id} />
      <UserFriends path="/friends" />
      <UserCreatures path="/creatures" />
    </Router>
  </>
);
}
const UserMenu = ({ id }) => (<>
  <Link href="/friends">friends</Link>
  <Link href="/creatures">creatures</Link>
</>);
const UserFriends = () => "friends: foo, bar";
const UserCreatures = () => "creatures: sas";

export default withStore('router')(({ store: { router } }) => {
  const rootPath = '/router';

  return (
    <>
      {router.path.replace(new RegExp(`^${rootPath}`), '') || '/'}
      <br />
      <Router rootPath={rootPath}>
        <Home />
        <UsersPage path="/users" />
        <UserPage exact path="/users/:id" rootPath={rootPath} />
      </Router>
    </>
  );
});