import React, { useEffect, useState } from 'react';
import useFetch from 'hooks/useFetch';
import usePopMessage from 'hooks/usePopMessage';
import methods from 'utils/methods';
import Button from 'components/atoms/button';
import Input from 'components/atoms/input';

const CreateUser = ({users, setUsers, setCreateIsOpenned}) => {
  const [userInput, setUserInput] = useState({});

  // Pop-up (error/success)
  const [popup, show] = usePopMessage();

  const { data, loading, error, refetchByBody } = useFetch({
    url: 'http://localhost:4000/admin/create-user/',
    method: methods.POST,
    authType: 'admin'
  });

    // Fetch user data
  const handleCreateUser = (e) => {
    e.preventDefault();
    console.log(userInput);

    refetchByBody(userInput);
  }

  // Set user's token to storage
  useEffect(() => {
    if (data?.token && data?.user) {
      //setUser(data?.user);
      setUsers([...users, data.user]);

      // Show pop-up message
      show(data.message, 'success');
    } else {
      show(error, 'error');
    }
  }, [loading]);



  return (
    <div className="modal p-y-2 p-x-3 bg-light">
      <h2 className="section-title fg-dark m-b-1">Create new user</h2>

      { popup.message && popup.type === 'success' && <p className="pop-success m-b-2">{popup.message}</p> }
      { popup.message && popup.type === 'error' && <p className="pop-error m-b-2">{popup.message}</p> }

      <h3 className="small-title fg-dark m-t-2">User's information</h3>
      <div className="grid">
        <div className="col-6 col-middle m-t-1">
          <p className="fg-dark">Name</p>
          <Input
            name="name"
            type="text"
            styles={{ flex: 1 }}
            placeholder="Type new user's name ..."
            onChangeAction={ (e) => setUserInput({...userInput, [e.target.name]: e.target.value}) }
          />
        </div>
        <div className="col-6 col-middle m-t-1">
          <p className="fg-dark">Lastname</p>
          <Input
            name="lastname"
            type="text"
            styles={{ flex: 1 }}
            placeholder="Type new user's lastname ..."
            onChangeAction={ (e) => setUserInput({...userInput, [e.target.name]: e.target.value}) }
          />
        </div>
        <div className="col-5 col-middle m-t-1">
          <p className="fg-dark">Person ID</p>
          <Input
            name="number"
            type="text"
            styles={{ flex: 1 }}
            placeholder="Type new user's person ID ..."
            onChangeAction={ (e) => setUserInput({...userInput, [e.target.name]: e.target.value}) }
          />
        </div>
        <div className="col-7 col-middle m-t-1">
          <p className="fg-dark">Address</p>
          <Input
            name="address"
            type="text"
            styles={{ flex: 1 }}
            placeholder="Type new user's address ..."
            onChangeAction={ (e) => setUserInput({...userInput, [e.target.name]: e.target.value}) }
          />
        </div>

      </div>

      <h3 className="small-title fg-dark m-t-2">User's credentials</h3>
      <div className="grid">
        <div className="col-4 col-middle m-t-1">
          <p className="fg-dark">Username</p>
          <Input
            name="username"
            type="text"
            styles={{ flex: 1 }}
            placeholder="Type username ..."
            onChangeAction={ (e) => setUserInput({...userInput, [e.target.name]: e.target.value}) }
          />
        </div>
        <div className="col-4 col-middle m-t-1">
          <p className="fg-dark">Password</p>
          <Input
            name="password"
            type="password"
            styles={{ flex: 1 }}
            placeholder="Type password ..."
            onChangeAction={ (e) => setUserInput({...userInput, [e.target.name]: e.target.value}) }
          />
        </div>
        <div className="col-4 col-middle m-t-1">
          <p className="fg-dark">Confirm password</p>
          <Input
            name="confirmPassword"
            type="password"
            styles={{ flex: 1 }}
            placeholder="Type password again ..."
            onChangeAction={ (e) => setUserInput({...userInput, [e.target.name]: e.target.value}) }
          />
        </div>

      </div>

      <div className="flex v-center h-end p-t-2">
        <Button
          type="secondary"
          styles={{ textAlign: 'center' }}
          onClickAction={ () => setCreateIsOpenned(false) }
        >Cancel</Button>
        <Button
          type="success"
          styles={{ textAlign: 'center', marginLeft: '0.5rem' }}
          onClickAction={ handleCreateUser }
        >Create</Button>
      </div>
    </div>
  );
}

export default CreateUser;
