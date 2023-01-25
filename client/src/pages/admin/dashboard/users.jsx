import { useEffect, useState } from 'react';
import useFetch from 'hooks/useFetch';
import methods from 'utils/methods';
import Button from 'components/atoms/button';
import EditUser from './editUser';
import Toggle from 'components/atoms/toggle';
import styles from './dashboard.module.scss';
import EditRentedBooks from './editRentedBooks';
import Search from 'components/molecules/search';
import CreateUser from './createUser';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [userToEdit, setUserToEdit] = useState({ user: null, modal: null });

  // Create new user toggle modal
  const [createIsOpenned, setCreateIsOpenned] = useState(false);

  // Query for searching
  const [query, setQuery] = useState('');

  // GET reguest to get all users
  const {
    data: userData,
    loading: userLoading,
    error: userError,
    refetchByUrl: refetchUsers
  } = useFetch({
    url: 'http://localhost:4000/admin/users',
    authType: 'admin'
  });

  // PATCH request to ban or verify user
  const {
    data: statusData,
    loading: statusLoading,
    error: statusError,
    refetchByUrlAndBody: refetchStatus
  } = useFetch({
    url: null,
    method: methods.PATCH,
    authType: 'admin'
  });

  // Inputs for the search component
  const searchInputs = [
    {
      name: "name",
      type: "text",
      label: "Name",
      placeholder: "Name ..",
      cols: 2
    },
    {
      name: "lastname",
      type: "text",
      label: "Lastname",
      placeholder: "Lastname ..",
      cols: 3
    },
    {
      name: "address",
      type: "text",
      label: "Address",
      placeholder: "Address ..",
      cols: 3
    },
    {
      name: "number",
      type: "text",
      label: "Person ID",
      placeholder: "ID ..",
      cols: 2
    }
  ];

  // Fetch search on query change
  useEffect(() => {
    refetchUsers(`http://localhost:4000/admin/users/search/?${query}`);
  }, [query]);

  // Store fetched users to state
  useEffect(() => {
    if (!userError && userData) setUsers(userData);
  }, [userLoading, userData]);

  // Verification handler
  const handleVerify = (userId, status) => {
    console.log('verified: ' + status);
    refetchStatus(`http://localhost:4000/admin/verify-user/${ userId }`, { verificationStatus: status });
  };

  // Ban handler
  const handleBan = (userId, status) => {
    console.log('verified: ' + status);
    refetchStatus(`http://localhost:4000/admin/ban-user/${ userId }`, { banStatus: status });
  };

  useEffect(() => {
    // If there is no error from the request, update users' state
    if (!statusError && statusData?.user) {
      const updatedUser = statusData.user;
      const updatedUsers = users.map(user => {
        if (user._id === updatedUser._id) return updatedUser;
        return user;
      });
      
      setUsers(updatedUsers);
    }     
  }, [statusLoading, statusData]);

  return (
    <>
      { userToEdit?.user && userToEdit?.modal === 'edit' &&
        <EditUser
          user={ userToEdit.user }
          setUserToEdit={ setUserToEdit }
          users={ users }
          setUsers={ setUsers }
        />
      }

      { userToEdit?.user && userToEdit?.modal === 'books' &&
        <EditRentedBooks
          user={ userToEdit.user }
          setUserToEdit={ setUserToEdit }
          users={ users }
          setUsers={ setUsers }
        />
      }

      { createIsOpenned &&
        <CreateUser
          setCreateIsOpenned={ setCreateIsOpenned }
          users={ users }
          setUsers={ setUsers }
        />
      }

      <div className={`table col-5`}>
        <Search inputs={ searchInputs } setQuery={ setQuery } />

        <div className="flex v-center h-between m-t-3">
          <h2 className="section-title fg-dark">Users</h2>
          <Button
            type="primary"
            styles={{ textAlign: 'center' }}
            onClickAction={ () => setCreateIsOpenned(true) }
          > + Create new user</Button>
        </div>

        <div className="m-t-0">
          <div className="table__item grid p-1">
            <p className="col-4"><b>Username</b></p>
            <p className="col-2"><b>Verified</b></p>
            <p className="col-2"><b>Banned</b></p>
          </div>

          <div>
            { users && users.map(user => (
              <div key={ user._id } className="table__item grid p-1">
                <div className="col-4 col-middle">{ user.username }</div>
                <div className="col-2 col-middle">
                  <Toggle
                    defaultChecked={ user.status.verified }
                    onChangeAction={ () => handleVerify(user._id, !user.status.verified) }
                  />
                </div>
                <div className="col-2 col-middle">
                  <Toggle
                    defaultChecked={ user.status.banned }
                    onChangeAction={ () => handleBan(user._id, !user.status.banned) }
                  />
                </div>
                <div className="col-4 flex v-center h-end">
                  <Button
                    type="secondary"
                    styles={{ textAlign: 'center', padding: '0.5rem 0.65rem' }}
                    onClickAction={ () => setUserToEdit({ user, modal: 'books' }) }
                  >Books</Button>
                  <Button
                    type="primary"
                    styles={{ textAlign: 'center', padding: '0.5rem 0.65rem', marginLeft: '0.35rem' }}
                    onClickAction={ () => setUserToEdit({ user, modal: 'edit' }) }
                  >Details</Button>
                </div>
              </div>
            )) }
          </div>
        </div>
      </div>
    </>
  );
}

export default Users;
