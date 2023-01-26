import { useContext } from "react";
import { useParams } from "react-router-dom";
import useFetch from 'hooks/useFetch';
import usePopMessage from 'hooks/usePopMessage';
import styles from './book.module.scss';
import Button from "components/atoms/button";
import { UserContext } from "contexts/UserProvider";
import { Helmet } from "react-helmet";

const Book = () => {
  const params = useParams();
  const { data, loading, error } = useFetch({
    url: `http://localhost:4000/books/${params.id}`
  });

  // Cart setter from the context
  const { setCart } = useContext(UserContext);

  // Pop-up (error/success)
  const [popup, show] = usePopMessage();

  // Add book to rent to the local storage
  const handleRent = (e) => {
    e.preventDefault();

    // Check if there are already books in the local storage
    const booksStr = localStorage.getItem('books');
    const books = booksStr ? JSON.parse(booksStr) : [];

    // Add book to the cart only if it isn't there already
    if (books.filter(book => book._id === data._id).length <= 0) {
      localStorage.setItem('books', JSON.stringify([...books, data]));
      setCart([...books, data]);
      show('Book has been added to your cart.', 'success');
    } else {
      show('This book is already in the cart.', 'error');
    }
  };

  return (
    <>
      <Helmet>
        <title>Readable { (!loading && data) ? ` - ${data.name}` : ' - book page' }</title>
      </Helmet>
      <div className="container p-y-4 fg-dark">
        { popup.message && popup.type === 'error' && <p className="pop-error m-b-2">{popup.message}</p> }
        { popup.message && popup.type === 'success' && <p className="pop-success m-b-2">{popup.message}</p> }

        { (!loading && data) && <>
          <div className={`${ styles['book-detail'] } grid`}>
            <div className={`${ styles['book-detail__thumb'] } col-3`}>
              <img src={ data.cover ? data.cover : '/public/placeholder.jpeg' } alt={ data.name } />
            </div>
            <div className={`${ styles['book-detail__info'] } col-6 p-l-3`}>
              <h1>{data.name}</h1>
              <div className="p-y-1">
                <p><b>{ data.author.name }</b></p>
                <small className="">{ new Date(data.releaseDate).getFullYear() }</small>
              </div>

              { data.licenceCount == 0 && 
                <p className="fg-secondary">We are sorry, we do not have lincenses for this book at this moment.</p>
              }

              <p className="m-t-1">{data.description}</p>

              <div className="m-t-2">
                <Button
                  type="primary"
                  styles={{ textAlign: 'center' }}
                  onClickAction={ (e) => handleRent(e) }
                  disabled={ data.licenceCount == 0 }
                >Rent this book</Button>
              </div>
            </div>
          </div>

        </>}
      </div>
    </>
  );
}

export default Book;
