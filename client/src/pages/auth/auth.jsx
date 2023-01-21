import { useLocation, useParams, useNavigate } from "react-router-dom";
import Login from './login';
import Register from './register';
import styles from './auth.module.scss';
import { useEffect } from 'react';

const Auth = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (params?.type !== 'login' && params?.type !== 'register') {
      navigate('/error', { replace: true });
    }
  }, [params?.type, location]);

  return (
    <div className={ styles['auth'] }>
      <div className={ `${styles['auth__box']} p-2 fg-dark` }>
        { params?.type === 'login' && <Login /> }
        { params?.type === 'register' && <Register /> }
      </div>
    </div>
  );
}



export default Auth;
