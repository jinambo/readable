import { useContext, useEffect } from 'react';
import { UserContext } from "contexts/UserProvider";
import useFetch from 'hooks/useFetch';
import usePopMessage from 'hooks/usePopMessage';
import { Link } from 'react-router-dom';
import Button from 'components/atoms/button';
import methods from 'utils/methods';
import styles from './cart.module.scss';

const Cart = ({ setCartOpened }) => {
  // Cart getter and setter from the context
  const { cart, setCart, setUser } = useContext(UserContext);

  // Rent books request
  const { refetchByBody, error, data, loading } = useFetch({
    url: 'http://localhost:4000/books/rent',
    method: methods.PATCH
  });

  // Pop-up (error/success)
  const [popup, show] = usePopMessage();

  // Remove book from the cart
  const handleRemove = (id) => {
    // Filter books by id of the book to remove
    const newBooks = cart.filter(book => book._id !== id);

    // Re-set books without the removed book
    setCart(newBooks);

    // Re-set the local storage
    localStorage.setItem('books', JSON.stringify(newBooks));
  };

  const handleFinishOrder = () => {
    // Get IDs of the book's from the cart
    let bookIds = cart.map(item => item._id);

    console.log(JSON.stringify(bookIds));

    // POST rent
    refetchByBody({ books: bookIds });
  };

  useEffect(() => {
    // If there is no error, clear the cart (local storage, context's state)
    if (!error && data?.currentUser) {
      localStorage.removeItem('books');
      setCart([]);

      // Update user state
      setUser(data?.currentUser)

      show(data.message, 'success');
    } else {
      show(error, 'error');
    }
  }, [loading]);

  return (
    <div className={`${ styles['cart'] }`}>
      <div className={styles['cart__wrap']}>
        <div className={`${ styles['cart__header'] }`}>
          <h3 className="section-title">Books to rent</h3>
          <img
            src="/public/close.svg"
            className={styles['cart__close']}
            onClick={ () => setCartOpened(false) }
          />
        </div>

        { popup.message && popup.type === 'error' && <p className="pop-error m-b-2 m-t-1">{popup.message}</p> }
        { popup.message && popup.type === 'success' && <p className="pop-success m-b-2">{popup.message}</p> }

        <div className={`${ styles['cart__items'] } scrollable m-t-2`}>
          { cart.length <= 0 && <p>The cart is empty right now. 😔</p> }
          { cart.length > 0 &&
            cart.map(book => (
              <Link
                to={`/book/${book._id}`}
                key={ book._id }
                className={`${ styles['item'] } flex v-start p-1 m-b-1`}
              >
                <div
                  className={styles['item__delete']}
                  onClick={ () => handleRemove(book._id) }
                >
                  <img src="/public/trash.svg" />
                </div>

                <div className={`${ styles['item__thumb']}`}>
                  <img src="https://www.databazeknih.cz/img/books/48_/481910/bmid_babicka-VGR-481910.jpeg" alt="" />
                </div>

                <div className={`${ styles['item__info'] } fg-dark p-l-1`}>
                  <p><b>{ book.name }</b></p>
                  <p>{ book.author.name }</p>
                  <small>{ new Date(book.releaseDate).getFullYear() }</small>
                </div>
              </Link>
            ))
          }
        </div>
      </div>

      <div className={`${ styles['cart__finish'] }`}>
        <Button
          type="secondary"
          onClickAction={ handleFinishOrder }
        >Finish the order</Button>
      </div>
    </div>
  );
}

export default Cart;
