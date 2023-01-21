import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "hooks/useFetch";
import methods from "utils/methods";
import Input from "components/atoms/input";
import Button from "components/atoms/button";

const Login = () => {
  const [login, setLogin] = useState({});
  const { data, loading, error, refetchByBody } = useFetch({
    url: 'http://localhost:4000/users/login',
    method: methods.POST
  });

  // Fetch user data
  const handleLogin = (e) => {
    e.preventDefault();

    refetchByBody({
      username: login.username,
      password: login.password
    });
  }

  // Set user's token to storage
  useEffect(() => {
    if (data?.token) localStorage.setItem('token', data?.token);
  }, [loading]);
    
  return (
    <>
      <h2 className="m-b-2">Login to your account</h2>

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