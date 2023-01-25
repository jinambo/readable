import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "contexts/UserProvider";
import useFetch from "hooks/useFetch";
import usePopMessage from "hooks/usePopMessage";
import methods from "utils/methods";
import Input from "components/atoms/input";
import Button from "components/atoms/button";
import { Helmet } from "react-helmet";

const Login = () => {
  const [login, setLogin] = useState({});
  const { data, loading, error, refetchByUrlAndBody } = useFetch({
    url: null,
    method: methods.POST
  });

  // Navigatin
  const navigate = useNavigate();

  // User setter from user context
  const { setUser } = useContext(UserContext);

  // Pop-up (error/success)
  const [popup, show] = usePopMessage();

  // Fetch user data
  const handleLogin = (e) => {
    e.preventDefault();

    refetchByUrlAndBody('http://localhost:4000/users/login', {
      username: login.username,
      password: login.password
    });
  }

  // Set user's token to the storage and user object to the context's state
  useEffect(() => {
    if (data?.token && data?.user) {
      localStorage.setItem('token', data?.token);
      setUser(data?.user);

      // Navigate to homepage
      navigate('/', { replace: true });
    } else {
      show(error, 'error');
    }
  }, [loading]);
    
  return (
    <>
      <Helmet>
        <title>Readable - login to your account</title>
      </Helmet>

      <h2 className="m-b-2">Login to your account</h2>
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
          <Link to={`/auth/register`} className="fg-secondary">I don't have an account yet.</Link>
          <Button
            onClickAction={ (e) => handleLogin(e) }
            type="primary"
            styles={{ padding: '0.75rem 4rem' }}
          >Login</Button>
        </div>
      </form>
    </>
  );
}

export default Login;