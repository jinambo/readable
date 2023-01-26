import React, { useEffect, useState } from 'react';
import useFetch from 'hooks/useFetch';
import usePopMessage from 'hooks/usePopMessage';
import methods from 'utils/methods';
import Button from 'components/atoms/button';
import Input from 'components/atoms/input';
import Toggle from 'components/atoms/toggle';
import { formatDate } from 'utils/dateFormat';

const EditBook = ({ book, setBookToEdit, books, setBooks}) => {
  // Book inputs' state initialization
  const [bookInput, setBookInput] = useState({ isVisible: book?.isVisible });

  // Pop-up (error/success)
  const [popup, show] = usePopMessage();

  // Fetch  - patch edit book
  const { data, loading, error, refetchByUrlAndBody } = useFetch({
    url: null,
    method: methods.PATCH,
    authType: 'admin'
  });

  // Fetch - get authors
  const { data: authorsData, loading: authorsLoading, error: authorsError } = useFetch({
    url: 'http://localhost:4000/authors',
    method: methods.GET
  });

  // Fetch user data
  const handleEditBook = (e) => {
    e.preventDefault();
    console.log(bookInput);

    refetchByUrlAndBody(`http://localhost:4000/admin/edit-book/${ book?._id }`, bookInput);
  }

  useEffect(() => {
    // If there are no errors from the request, show msg and update books' state
    if (!error && data?.book) {
      const updatedBook = data.book;
      const updatedBooks = books.map(book => {
        if (book._id === updatedBook._id) return updatedBook;
        return book;
      });

      setBooks(updatedBooks);

      // Show pop-up message
      show(data.message, 'success');

      // Close pop-up after 2.5s
      setTimeout(() => setBookToEdit(null), 2000);
    } 

    if (error) show(error, 'error');
  }, [loading]);


  return (
    <div className="modal p-y-2 p-x-3 bg-light">
      <h2 className="section-title fg-dark m-b-1">{ book?.name } edit</h2>

      { popup.message && popup.type === 'success' && <p className="pop-success m-b-2">{popup.message}</p> }
      { popup.message && popup.type === 'error' && <p className="pop-error m-b-2">{popup.message}</p> }

      <div className="grid">
        <div className="col-12 col-middle m-t-1">
          <p className="fg-dark">Book is visible on the page</p>
          <Toggle
            name="isVisible"
            defaultChecked={ book?.isVisible }
            onChangeAction={ (e) => setBookInput({...bookInput, [e.target.name]: !bookInput.isVisible }) }
          />
        </div>
        <div className="col-6 col-middle m-t-1">
          <p className="fg-dark">Name</p>
          <Input
            name="name"
            type="text"
            styles={{ flex: 1 }}
            defaultValue={ book?.name }
            onChangeAction={ (e) => setBookInput({...bookInput, [e.target.name]: e.target.value}) }
          />
        </div>
        <div className="col-6 col-middle m-t-1">
          <p className="fg-dark">Author</p>
          <select
            className="big-select" name="author"
            id="author" style={{ flex: 1 }}
            onChange={ (e) => setBookInput({...bookInput, [e.target.name]: e.target.value}) }
          >
            { !authorsLoading && authorsData && authorsData.map(author => (
              <option key={ author._id } value={ author._id } selected={ book?.author?._id === author._id }>{ author.name }</option>
            )) }
          </select>
        </div>
        <div className="col-4 col-middle m-t-1">
          <p className="fg-dark">Release date</p>
          <Input
            name="releaseDate"
            type="date"
            styles={{ flex: 1 }}
            defaultValue={ formatDate(new Date(book?.releaseDate)) }
            onChangeAction={ (e) => setBookInput({...bookInput, [e.target.name]: e.target.value}) }
          />
        </div>
        <div className="col-4 col-middle m-t-1">
          <p className="fg-dark">Pages count</p>
          <Input
            name="pagesCount"
            type="number"
            styles={{ flex: 1 }}
            defaultValue={ book?.pagesCount }
            onChangeAction={ (e) => setBookInput({...bookInput, [e.target.name]: e.target.value}) }
          />
        </div>
        <div className="col-4 col-middle m-t-1">
          <p className="fg-dark">Licence count</p>
          <Input
            name="licenceCount"
            type="number"
            styles={{ flex: 1 }}
            defaultValue={ book?.licenceCount }
            onChangeAction={ (e) => setBookInput({...bookInput, [e.target.name]: e.target.value}) }
          />
        </div>
        <div className="col-6 col-middle m-t-1">
          <p className="fg-dark">Book cover</p>
          <Input
            name="cover"
            type="text"
            styles={{ flex: 1 }}
            defaultValue={ book?.cover }
            onChangeAction={ (e) => setBookInput({...bookInput, [e.target.name]: e.target.value}) }
          />
        </div>
        <div className="col-12 col-middle m-t-1">
          <p className="fg-dark">Book description</p>
          <Input
            name="description"
            type="textarea"
            styles={{ flex: 1 }}
            defaultValue={ book?.description }
            onChangeAction={ (e) => setBookInput({...bookInput, [e.target.name]: e.target.value}) }
          />
        </div>
      </div>

      <div className="flex v-center h-end p-t-2">
        <Button
          type="secondary"
          styles={{ textAlign: 'center' }}
          onClickAction={ () => setBookToEdit(null) }
        >Cancel</Button>
        <Button
          type="success"
          styles={{ textAlign: 'center', marginLeft: '0.5rem' }}
          onClickAction={ handleEditBook }
        >Edit book</Button>
      </div>
    </div>
  );
}

export default EditBook;
