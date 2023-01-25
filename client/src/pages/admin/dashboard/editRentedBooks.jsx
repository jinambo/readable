import React, { useEffect, useState } from 'react';
import useFetch from 'hooks/useFetch';
import usePopMessage from 'hooks/usePopMessage';
import { getExpiration } from 'utils/getExpiration';
import methods from 'utils/methods';
import Button from 'components/atoms/button';
import styles from './dashboard.module.scss';

const EditRentedBooks = ({user, setUserToEdit, users, setUsers}) => {
  // Pop-up (error/success)
  const [popup, show] = usePopMessage();

  const { data, loading, error, refetchByUrl } = useFetch({
    url: null,
    method: methods.PATCH,
    authType: 'admin'
  });

  const handleReturn = (bookId) => {
    refetchByUrl(`http://localhost:4000/admin/user/${ user._id }/delete-book/${ bookId }`);
  };

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

      // Update this state to see changes immediately
      setUserToEdit({ user: updatedUser, modal: 'books' });
    } 

    if (error) show(error, 'error');
  }, [loading]);

  return (
    <div className="modal p-y-2 p-x-3 bg-light">
      <div className="absolute-t-r pointer flex v-center h-end" onClick={ () => setUserToEdit(null) }>
        <img src="/public/close.svg" />
      </div>

      <h2 className="section-title fg-dark m-b-1">Edit { user?.username }'s rented books</h2>

      { popup.message && popup.type === 'success' && <p className="pop-success m-b-2">{popup.message}</p> }
      { popup.message && popup.type === 'error' && <p className="pop-error m-b-2">{popup.message}</p> }

      <div className="table p-t-1">
        { user?.rented?.length <= 0 &&
          <p className="fg-secondary">User does not have any books rented.</p>
        }
        { user?.rented.map(item => (
          <div key={item?._id} className={ `table__item flex v-center h-between p-1` }>
            <div>
              <p><b>{ item?.book?.name }</b></p>
              <p className="fg-secondary">
                expires in { getExpiration(item?.createdAt) }
              </p>
            </div>

            <Button
              type="secondary"
              onClickAction={ () => handleReturn(item?.book?._id) }
            >Remove book</Button>
          </div>
        )) }  
      </div>

      { user?.history?.length > 0 && 
        <div className="table p-t-1">
          <p className="small-title fg-dark">Rental history</p>
          <div className={`${ styles.history } scrollable`}>
            { user?.history.map(item => (
              <div key={item._id} className="m-y-1">
                <p>{item.rentedAt}</p>
                <p><b>{item.name}</b></p>
                <small>{item.author}</small>
              </div>
            )) }
          </div>
        </div>
      }
    </div>
  );
}

export default EditRentedBooks;
