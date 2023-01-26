import React, { useEffect, useState } from 'react';
import useFetch from 'hooks/useFetch';
import usePopMessage from 'hooks/usePopMessage';
import methods from 'utils/methods';
import Button from 'components/atoms/button';
import Input from 'components/atoms/input';
import Toggle from 'components/atoms/toggle';

const CreateBook = ({ books, setBooks, setCreateIsOpenned}) => {
  // Book inputs' state initialization
  const [bookInput, setBookInput] = useState({ isVisible: true });

  // Pop-up (error/success)
  const [popup, show] = usePopMessage();

  // Fetch  - post new book
  const { data, loading, error, refetchByBody } = useFetch({
    url: 'http://localhost:4000/admin/create-book/',
    method: methods.POST,
    authType: 'admin'
  });

  // Fetch - get authors
  const { data: authorsData, loading: authorsLoading, error: authorsError } = useFetch({
    url: 'http://localhost:4000/authors',
    method: methods.GET
  });

  // Fetch user data
  const handleCreateBook = (e) => {
    e.preventDefault();
    // console.log(bookInput);

    refetchByBody(bookInput);
  }

  // Update books state with the new book
  useEffect(() => {
    if (data?.book) {
      setBooks([...books, data.book]);

      // Show pop-up message
      show(data.message, 'success');

      // Close modal after 2.5s
      setTimeout(() => setCreateIsOpenned(false), 2500);
    } else {
      show(error, 'error');
    }
  }, [loading]);



  return (
    <div className="modal p-y-2 p-x-3 bg-light">
      <h2 className="section-title fg-dark m-b-1">Create new book</h2>

      { popup.message && popup.type === 'success' && <p className="pop-success m-b-2">{popup.message}</p> }
      { popup.message && popup.type === 'error' && <p className="pop-error m-b-2">{popup.message}</p> }

      <div className="grid">
        <div className="col-12 col-middle m-t-1">
          <p className="fg-dark">Book is visible on the page</p>
          <Toggle
            name="isVisible"
            defaultChecked={ true }
            onChangeAction={ (e) => setBookInput({...bookInput, [e.target.name]: !bookInput.isVisible }) }
          />
        </div>
        <div className="col-6 col-middle m-t-1">
          <p className="fg-dark">Name</p>
          <Input
            name="name"
            type="text"
            styles={{ flex: 1 }}
            placeholder="Type book's name ..."
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
            <option value="-" selected disabled>Choose author</option>
            { !authorsLoading && authorsData && authorsData.map( author => (
              <option key={ author._id } value={ author._id }>{ author.name }</option>
            )) }
          </select>
        </div>
        <div className="col-4 col-middle m-t-1">
          <p className="fg-dark">Release date</p>
          <Input
            name="releaseDate"
            type="date"
            styles={{ flex: 1 }}
            onChangeAction={ (e) => setBookInput({...bookInput, [e.target.name]: e.target.value}) }
          />
        </div>
        <div className="col-4 col-middle m-t-1">
          <p className="fg-dark">Pages count</p>
          <Input
            name="pagesCount"
            type="number"
            styles={{ flex: 1 }}
            placeholder="Type amount of pages ..."
            onChangeAction={ (e) => setBookInput({...bookInput, [e.target.name]: e.target.value}) }
          />
        </div>
        <div className="col-4 col-middle m-t-1">
          <p className="fg-dark">Licence count</p>
          <Input
            name="licenceCount"
            type="number"
            styles={{ flex: 1 }}
            placeholder="Type amount of licences ..."
            onChangeAction={ (e) => setBookInput({...bookInput, [e.target.name]: e.target.value}) }
          />
        </div>
        <div className="col-6 col-middle m-t-1">
          <p className="fg-dark">Book cover</p>
          <Input
            name="cover"
            type="text"
            styles={{ flex: 1 }}
            onChangeAction={ (e) => setBookInput({...bookInput, [e.target.name]: e.target.value}) }
          />
        </div>
        <div className="col-12 col-middle m-t-1">
          <p className="fg-dark">Book description</p>
          <Input
            name="description"
            type="textarea"
            styles={{ flex: 1 }}
            placeholder="Type description of the book ..."
            onChangeAction={ (e) => setBookInput({...bookInput, [e.target.name]: e.target.value}) }
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
          onClickAction={ handleCreateBook }
        >Create book</Button>
      </div>
    </div>
  );
}

export default CreateBook;
