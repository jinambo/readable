import { Helmet } from 'react-helmet';
import Books from './books';
import Users from './users';
import styles from './dashboard.module.scss';

const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>Readable - admin dashboard</title>
      </Helmet>
      <div className="container p-y-2">
        <h1 className={`${ styles['dashboard'] } fg-dark`}>Admin dashboard</h1>
        <div className="grid">
          <Books />
          <Users />
        </div>
      </div>
    </>

  );
}

export default Dashboard;
