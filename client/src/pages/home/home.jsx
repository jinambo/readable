import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import useFetch from 'hooks/useFetch';
import Search from './search';
import styles from './home.module.scss';

const Home = () => {
  const { data, loading, error, refetchByUrl } = useFetch({
    url: 'http://localhost:4000/books'
  });
  
  const [query, setQuery] = useState(null);

  // Fetch search on query change
  useEffect(() => {
    refetchByUrl(`http://localhost:4000/books/search/?${query}`);
  }, [query]);

  return (
    <main className={`${styles['home']} container p-y-4`}>
        <h1 className="fg-dark p-x-1">All your favorite books on one place</h1>

        <Search setQuery={ setQuery }/>

        <div className="grid p-t-2">
          { !loading && data.map(book => (
            <Link to={ `/book/${book._id}` } key={ book._id } className="col-3 p-1" style={{ textDecoration: 'none' }}>
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
            </Link>
          )) }
        </div>
    </main>
  );
}

export default Home;
