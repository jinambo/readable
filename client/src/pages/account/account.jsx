import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "contexts/UserProvider";
import useFetch from 'hooks/useFetch';
import usePopMessage from 'hooks/usePopMessage';
import { getExpiration } from 'utils/getExpiration';
import Button from 'components/atoms/button';
import styles from './account.module.scss';
import methods from 'utils/methods';
import Settings from './settings';

const Account = () => {
  // User getter from the context
  const { user, setUser } = useContext(UserContext);

  // Pop-up (error/success)
  const [popup, show] = usePopMessage();

  const { data, loading, error, refetchByUrl } = useFetch({
    url: null,
    method: methods.PATCH
  });

  // Navigation
  const navigate = useNavigate();

  const handleReturn = (id) => {
    refetchByUrl(`http://localhost:4000/books/return/${id}`);
    console.log(id);
  };

  // If user is not logged in, redirect to the homepage
  useEffect(() => {
    if (!user) navigate('/', { replace: true });
  }, [user]);

  useEffect(() => {
    // Update user context after returning the book
    if (!error && data?.currentUser) {
      setUser(data.currentUser);
      show(data.message, 'success');
    } else {
      show(error, 'error');
    }
  }, [loading, data]);

  return (
    <>
      <Helmet>
        <title>Readable { user ? ` - ${ user.username }` : ' - account page' }</title>
      </Helmet>
      <div className={`${ styles['account'] } container p-y-4`}>
        <div className={`${ styles['account__settings'] } grid p-y-1`}>
          <Settings user={ user } setUser={ setUser } />

          <div className={`${ styles['current'] } col-7 p-l-3`}>
            <h2 className="section-title fg-dark p-b-1">Currently rented books</h2>
            { !user?.status?.verified && <small className='p-b-3 fg-secondary'><b>Note:</b> You are not verified by now so you can't return books at this time.</small> }
            
            { popup.message && popup.type === 'error' && <p className="pop-error m-b-2 m-t-1">{popup.message}</p> }
            { popup.message && popup.type === 'success' && <p className="pop-success m-b-2">{popup.message}</p> }

            { user?.rented?.length <= 0 &&
              <p className="fg-secondary">You don't have any books rented.</p>
            }

            <div className={`${ styles['current__inner'] } scrollable p-r-1`}>
              { user?.rented.map(item => (
                <div key={item?._id} className={ `${styles['current__item']} flex v-center h-between p-1 m-y-1` }>
                  <div>
                    <p><b>{ item?.book?.name }</b></p>
                    <p className="fg-secondary">
                      expires in { getExpiration(item?.createdAt) }
                    </p>
                  </div>

                  <Button
                    type="secondary"
                    onClickAction={ () => handleReturn(item?.book?._id) }
                  >Remove</Button>
                </div>
              )) }            
            </div>
          </div>
        </div>


        <div className={`${ styles['account__history'] } p-t-2`}>
          <h2 className="section-title fg-dark">Rental history</h2>
          { user?.history.map(item => (
            <div key={item._id} className="m-y-1">
              <p>{item.rentedAt}</p>
              <p><b>{item.name}</b></p>
              <small>{item.author}</small>
            </div>
          )) }
        </div>

      </div>
    </>
  );
}

export default Account;
