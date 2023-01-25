import React, { useEffect, useState } from 'react';
import useFetch from 'hooks/useFetch';
import usePopMessage from 'hooks/usePopMessage';
import methods from 'utils/methods';
import Button from 'components/atoms/button';
import Input from 'components/atoms/input';

const EditUser = ({user, setUserToEdit, users, setUsers}) => {
  const [newData, setNewData] = useState({});

  // Pop-up (error/success)
  const [popup, show] = usePopMessage();

  const { data, loading, error, refetchByUrlAndBody } = useFetch({
    url: null,
    method: methods.PATCH,
    authType: 'admin'
  });

  const handleEdit = () => refetchByUrlAndBody(`http://localhost:4000/admin/edit-user/${ user?._id }`, newData);
  
  useEffect(() => {
    // If there are no errors from the request, show msg and update users' state
    if (!error && data?.user) {
      const updatedUser = data.user;
      const updatedUsers = users.map(user => {
        if (user._id === updatedUser._id) return updatedUser;
        return user;
      });

      setUsers(updatedUsers);

      // Show pop-up message
      show(data.message, 'success');

      // Close pop-up after 2s
      setTimeout(() => {
        setUserToEdit(null);
      }, 2000);
    } 

    if (error) show(error, 'error');
  }, [loading]);

  return (
    <div className="modal p-y-2 p-x-3 bg-light">
      <h2 className="section-title fg-dark m-b-1">Edit user { user?.username }</h2>

      { popup.message && popup.type === 'success' && <p className="pop-success m-b-2">{popup.message}</p> }
      { popup.message && popup.type === 'error' && <p className="pop-error m-b-2">{popup.message}</p> }

      <div className="grid">
        <div className="col-6 col-middle m-t-1">
          <p className="fg-dark">Name</p>
          <Input
            name="name"
            type="text"
            styles={{ flex: 1 }}
            defaultValue={ user?.name }
            onChangeAction={ (e) => setNewData({...newData, [e.target.name]: e.target.value}) }
          />
        </div>
        <div className="col-6 col-middle m-t-1">
          <p className="fg-dark">Name</p>
          <Input
            name="lastname"
            type="text"
            styles={{ flex: 1 }}
            defaultValue={ user?.lastname }
            onChangeAction={ (e) => setNewData({...newData, [e.target.name]: e.target.value}) }
          />
        </div>
        <div className="col-6 col-middle m-t-1">
          <p className="fg-dark">Personal number</p>
          <Input
            name="number"
            type="text"
            styles={{ flex: 1 }}
            defaultValue={ user?.number }
            onChangeAction={ (e) => setNewData({...newData, [e.target.name]: e.target.value}) }
          />
        </div>
        <div className="col-6 col-middle m-t-1">
          <p className="fg-dark">Address</p>
          <Input
            name="address"
            type="text"
            styles={{ flex: 1 }}
            defaultValue={ user?.address }
            onChangeAction={ (e) => setNewData({...newData, [e.target.name]: e.target.value}) }
          />
        </div>
      </div>

      <div className="flex v-center h-end p-t-2">
        <Button
          type="secondary"
          styles={{ textAlign: 'center' }}
          onClickAction={ () => setUserToEdit(null) }
        >Cancel</Button>
        <Button
          type="success"
          styles={{ textAlign: 'center', marginLeft: '0.5rem' }}
          onClickAction={ handleEdit }
        >Save</Button>
      </div>
    </div>
  );
}

export default EditUser;
