import { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { UserContext } from 'contexts/UserProvider';
import useFetch from 'hooks/useFetch';
import Search from 'components/molecules/search';
import styles from './home.module.scss';
import BookItem from 'components/molecules/book/bookItem';

const Home = () => {
  const { user } = useContext(UserContext);

  const { data, loading, error, refetchByUrl } = useFetch({
    url: 'http://localhost:4000/books'
  });
  
  // Query for searching
  const [query, setQuery] = useState(null);

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

  // Fetch search on query change
  useEffect(() => {
    refetchByUrl(`http://localhost:4000/books/search/?${query}`);
  }, [query]);

  return (
    <>
      <Helmet>
          <title>Readable - cool online library</title>
      </Helmet>

      <main className={`${styles['home']} container p-y-4`}>
          <h1 className="fg-dark p-x-1">All { user?.name }'s favorite books on one place</h1>

          <div className="m-x-1">
            <Search inputs={ searchInputs } setQuery={ setQuery }/>
          </div>

          <div className="grid p-t-2">
            { !loading && data.filter(book => book.isVisible).map(book => (
              <BookItem key={ book._id } book={ book } />
            )) }
          </div>
      </main>
    </>
  );
}

export default Home;
