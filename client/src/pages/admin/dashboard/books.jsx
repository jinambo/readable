import Button from 'components/atoms/button';
import useFetch from 'hooks/useFetch';
import Search from 'components/molecules/search';
import { useEffect, useState } from 'react';
import styles from './dashboard.module.scss';
import EditBook from './editBook';
import CreateBook from './createBook';
import methods from 'utils/methods';
import usePopMessage from 'hooks/usePopMessage';

const Books = () => {
  // Fetch - get all books
  const { data, loading, error, refetchByUrl } = useFetch({
    url: 'http://localhost:4000/books'
  });

  // Fetch - delete book
  const { data: deleteData, loading: deleteLoading, error: deleteError, refetchByUrl: deleteBookByUrl } = useFetch({
    url: null,
    method: methods.DELETE,
    authType: 'admin'
  });

  // Pop-up (error/success)
  const [popup, show] = usePopMessage();

  // Books state for fetched data
  const [books, setBooks] = useState([]);

  // State for book edit component
  const [bookToEdit, setBookToEdit] = useState(null);

  // Create new book toggle modal
  const [createIsOpenned, setCreateIsOpenned] = useState(false);

  // Query for searching
  const [query, setQuery] = useState('');

  // Inputs for the search component
  const searchInputs = [
    {
      name: "name",
      type: "text",
      label: "Book title",
      placeholder: "Type name of the book ..",
      cols: 4
    },
    {
      name: "author",
      type: "text",
      label: "Book author",
      placeholder: "Type name of the author ..",
      cols: 4
    },
    {
      name: "year",
      type: "text",
      label: "Release year",
      placeholder: "Type release year ..",
      cols: 2
    }
  ];

  // Delete book handler
  const handleDelete = (bookId) => {
    // FETCH - DELETE from DB
    deleteBookByUrl(`http://localhost:4000/admin/delete-book/${bookId}`);
  };

  useEffect(() => {
    // Filter books on the client side - update books' state
    if (!deleteError && deleteData?.bookId) {
      const filteredBooks = books.filter(book => book._id !== deleteData.bookId);

      setBooks(filteredBooks);
      show(deleteData.message, 'success');
    } 

    if (deleteError) show(deleteError, 'error');
  }, [deleteData, deleteLoading]);

  // Fetch search on query change
  useEffect(() => {
    refetchByUrl(`http://localhost:4000/books/search/?${query}`);
  }, [query]);
  
  // Store fetched books to state
  useEffect(() => {
    if (!error && data) setBooks(data);
  }, [loading, data]);

  return (
    <>
      { createIsOpenned &&
        <CreateBook
          books={ books }
          setBooks={ setBooks }
          setCreateIsOpenned={ setCreateIsOpenned }
        />
      }

      { bookToEdit &&
        <EditBook
          book={ bookToEdit }
          setBookToEdit={ setBookToEdit }
          books={ books }
          setBooks={ setBooks }
        />
      }

      <div className={`table col-7 p-r-1`}>
        <Search inputs={ searchInputs } setQuery={ setQuery } />

        <div className="flex v-center h-between m-t-3">
          <h2 className="section-title fg-dark">Books</h2>
          <Button
            type="primary"
            styles={{ textAlign: 'center' }}
            onClickAction={ () => setCreateIsOpenned(true) }
          >+ Add new book</Button>
        </div>

        { popup.message && popup.type === 'success' && <p className="pop-success m-y-2">{popup.message}</p> }
        { popup.message && popup.type === 'error' && <p className="pop-error m-y-2">{popup.message}</p> }

        <div className="m-t-0">
          <div className={`table__item grid p-1 bg-light-medium`}>
            <p className="col-4"><b>Item</b></p>
            <p className="col-2"><b>Release</b></p>
            <p className="col-2"><b>Licences</b></p>
            <p className="col-2"><b>Pages</b></p>
          </div>
          {  books && books.map(book => (
            <div key={ book._id } className={`table__item grid p-1 bg-light-medium`}>
              <div className="col-4 col-middle">
                <p><b>{ book.name }</b> { !book.isVisible && '(not visible)' }</p>
                <p>{ book.author.name }</p>
              </div>
              <div className="col-2 col-middle">
                <p>{ new Date(book.releaseDate).getFullYear() }</p>
              </div>
              <div className="col-2 col-middle">
                <p>{ book.licenceCount }</p>
              </div>
              <div className="col-2 col-middle">
                <p>{ book.pagesCount }</p>
              </div>
              <div className="col-2 flex v-center">
                <Button
                  type="primary"
                  styles={{ textAlign: 'center' }}
                  onClickAction={ () => setBookToEdit(book) }
                >
                  <img src="/public/edit.svg" />
                </Button>
                <Button
                  type="secondary"
                  styles={{ textAlign: 'center', marginLeft: '0.35rem' }}
                  onClickAction={ () => handleDelete(book._id) }
                >
                  <img src="/public/trashLight.svg" />
                </Button>
              </div>
            </div>
          )) }
        </div>
      </div>
    </>
  );
}

export default Books;
