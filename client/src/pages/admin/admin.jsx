import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "hooks/useFetch";
import usePopMessage from "hooks/usePopMessage";
import methods from "utils/methods";
import Input from "components/atoms/input";
import Button from "components/atoms/button";
import styles from './admin.module.scss';
import { Helmet } from "react-helmet";

const Admin = () => {
  const [login, setLogin] = useState({});
  const { data, loading, error, refetchByBody } = useFetch({
    url: 'http://localhost:4000/admin/login',
    method: methods.POST
  });

  // Navigatin
  const navigate = useNavigate();

  // Pop-up (error/success)
  const [popup, show] = usePopMessage();

  // Fetch user data
  const handleLogin = (e) => {
    e.preventDefault();

    refetchByBody({
      username: login.username,
      password: login.password
    });
  }

  // Set user's token to the storage and user object to the context's state
  useEffect(() => {
    if (data?.token && data?.admin) {
      localStorage.setItem('adminToken', data?.token);

      // Navigate to homepage
      navigate('/admin/dashboard', { replace: true });
    } else {
      show(error, 'error');
    }
  }, [loading]);

  return (
    <>
      <Helmet>
        <title>Readable - administration</title>
      </Helmet>
      <div className={`${ styles['admin'] }`}>
        <div className={`${ styles['admin__box'] } p-2 fg-dark`}>
          <h2 className="m-b-2">Login to administration</h2>
          { popup.message && popup.type === 'error' && <p className="pop-error m-b-2">{popup.message}</p> }

          <form className="grid v-end">
            <div className="col-12 col-middle">
              <p className="fg-dark">Username</p>
              <Input
                name="username"
                type="text"
                placeholder="Your username ... "
                onChangeAction={ (e) => setLogin({...login, [e.target.name]: e.target.value}) }
              />
            </div>

            <div className="col-12 col-middle p-t-1">
              <p className="fg-dark">Password</p>
              <Input
                name="password"
                type="password"
                placeholder="Your password ... "
                onChangeAction={ (e) => setLogin({...login, [e.target.name]: e.target.value}) }
              />
            </div>

            <div className="col-12 flex h-between v-center p-t-2">
              <Button
                onClickAction={ (e) => handleLogin(e) }
                type="primary"
                styles={{ padding: '0.75rem 4rem' }}
              >Login</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Admin;
