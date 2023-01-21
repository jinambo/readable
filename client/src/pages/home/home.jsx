import Button from 'components/atoms/button';
import Input from 'components/atoms/input';
import { useState } from 'react';
import { useEffect } from 'react';
import styles from './home.module.scss';

const Home = () => {
  const [books, setBooks] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/books')
      .then((response) => response.json())
      .then((data) => setBooks(data));  
  }, []);

  return (
    <main className={`${styles['home']} container p-y-4`}>
        <h1 className="fg-dark p-x-1">All your favorite books on one place</h1>

        <div className="grid v-end p-t-3 p-x-1">
          <div className="col-4 col-middle">
            <p className="fg-dark">Book title</p>
            <Input
              type="text"
              placeholder="Type name of the book .."
              styles={{ flex: 1 }}
            />
          </div>
          <div className="col-4 col-middle">
            <p className="fg-dark">Book author</p>
            <Input
              type="text"
              placeholder="Type name of the author .."
              styles={{ flex: 1 }}
            />
          </div>
          <div className="col-2 col-middle">
            <p className="fg-dark">Release year</p>
            <Input
              type="text"
              placeholder="Type release year .."
              styles={{ flex: 1 }}
            />
          </div>

          <div className="col-2 col-middle">
            <Button type="secondary" styles={{ textAlign: 'center' }}>Search</Button>
          </div>
        </div>


        <div className="grid p-t-1">
          { books && books.map(book => (
            <div key={ book.id } className="col-3 p-1">
              <div className="book">
                <div className="book__img">
                  <img src="https://www.databazeknih.cz/img/books/48_/481910/bmid_babicka-VGR-481910.jpeg" alt="" />
                </div>
                <div className="book_info p-1">
                  <h3 className="fg-dark">{ book.name }</h3>
                  <div className="flex v-center h-between fg-dark">
                    <h5>{book?.author?.name}</h5>
                    <p>{ new Date(book.releaseDate).getFullYear() }</p>
                  </div>
                </div>
              </div>
            </div>
          )) }
        </div>
    </main>
  );
}

export default Home;
