import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "hooks/useFetch";
import methods from "utils/methods";
import Input from "components/atoms/input";
import Button from "components/atoms/button";

const Register = () => {
  const [register, setRegister] = useState({});

    // Fetch user data
    const handleRegister = (e) => {
      e.preventDefault();

      refetchByBody({
        username: login.username,
        password: login.password
      });
    }

  return (
    <>
      <h2 className="m-b-2">Create an account</h2>

      <form className="grid v-end">
        <div className="col-6 col-middle">
          <p className="fg-dark">Name</p>
          <Input
            name="name"
            type="text"
            placeholder="Your name ... "
            onChangeAction={ (e) => setRegister({...register, [e.target.name]: e.target.value}) }
          />
        </div>

        <div className="col-6 col-middle p-t-1">
          <p className="fg-dark">Lastname</p>
          <Input
            name="lastname"
            type="text"
            placeholder="Your lastname ... "
            onChangeAction={ (e) => setRegister({...register, [e.target.name]: e.target.value}) }
          />
        </div>

        <div className="col-8 col-middle p-t-1">
          <p className="fg-dark">Address</p>
          <Input
            name="address"
            type="text"
            placeholder="Your personal address ... "
            onChangeAction={ (e) => setRegister({...register, [e.target.name]: e.target.value}) }
          />
        </div>

        <div className="col-4 col-middle p-t-1">
          <p className="fg-dark">Personal ID</p>
          <Input
            name="number"
            type="text"
            placeholder="Your personal ID ... "
            onChangeAction={ (e) => setRegister({...register, [e.target.name]: e.target.value}) }
          />
        </div>

        <div className="col-12 p-t-2">
          <div className="separator"></div>
        </div>

        <div className="col-12 col-middle p-t-1">
          <p className="fg-dark">Username</p>
          <Input
            name="username"
            type="text"
            placeholder="Your account username ... "
            onChangeAction={ (e) => setRegister({...register, [e.target.name]: e.target.value}) }
          />
        </div>

        <div className="col-12 col-middle p-t-1">
          <p className="fg-dark">Password</p>
          <Input
            name="password"
            type="password"
            placeholder="Your password ... "
            onChangeAction={ (e) => setRegister({...register, [e.target.name]: e.target.value}) }
          />
        </div>

        <div className="col-12 col-middle p-t-1">
          <p className="fg-dark">Confirm password</p>
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Your password confirmation ... "
            onChangeAction={ (e) => setRegister({...register, [e.target.name]: e.target.value}) }
          />
        </div>

        <div className="col-12 flex h-between v-center p-t-2">
          <Link to={`/auth/login`} className="fg-secondary">I already have an account.</Link>
          <Button
            onClickAction={ (e) => handleRegister(e) }
            type="primary"
            styles={{ padding: '0.75rem 4rem' }}
          >Login</Button>
        </div>
      </form>
    </>
  );
}

export default Register;