import Button from 'components/atoms/button';
import Input from 'components/atoms/input';
import React from 'react';
import { useState } from 'react';

const Search = ({ setQuery }) => {
  const [searchInput, setSearchInput] = useState({});
  const [operator, setOperator] = useState(null);

  // Set search input state by inputs change
  const handleChange = (e) => {
    setSearchInput({
      ...searchInput,
      [e.target.name]: e.target.value
    });

    console.log(searchInput)
  }

  const handleSearch = () => {
    // Filter only keys that has value of
    // 3 or more chars and create query string
    let query = Object.entries(searchInput)
      .filter(([, value]) => value && value.length >= 3)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

      // If operator was selected prepend it to the query
      if (operator && operator.length) {
        query = `operator=${operator}&${query}`;
      }

    // If query has value call state setter
    if (query) setQuery(query);

    console.log(query)
  }

  return (
    <div className="grid v-end p-t-3 p-x-1">
      <div className="col-4 col-middle">
        <p className="fg-dark">Book title</p>
        <Input
          name="name"
          type="text"
          placeholder="Type name of the book .."
          styles={{ flex: 1 }}
          onChangeAction={ (e) => handleChange(e) }
        />
      </div>
      <div className="col-4 col-middle">
        <p className="fg-dark">Book author</p>
        <Input
          name="author"
          type="text"
          placeholder="Type name of the author .."
          styles={{ flex: 1 }}
          onChangeAction={ (e) => handleChange(e) }
        />
      </div>
      <div className="col-2 col-middle">
        <p className="fg-dark">Release year</p>
        <Input
          name="year"
          type="text"
          placeholder="Type release year .."
          styles={{ flex: 1 }}
          onChangeAction={ (e) => handleChange(e) }
        />
      </div>

      <div className="col-2 col-middle">
        <Button
          type="secondary"
          styles={{ textAlign: 'center' }}
          onClickAction={ handleSearch }
        >Search</Button>
      </div>

      <div className="col-12 flex h-between fg-dark">
        <div className="flex">
          <div className="radio">
            <input
              type="radio" id="and"
              name="operator" value="and"
              defaultChecked
              onChange={ (e) => setOperator(e.target.value) }
            />
            <label for="and">All expressions</label>
          </div>
          <div className="radio m-l-1">
            <input
              type="radio" id="or"
              name="operator" value="or"
              onChange={ (e) => setOperator(e.target.value) }
            />
            <label for="or">Some expressions</label>
          </div>
        </div>
        <div className="flex p-t-1">
          <select
            name="sort" id="sort"
            onChange={ (e) => handleChange(e) }
          >
            <option value="name" selected>Name of the book</option>
            <option value="author">Author of the book</option>
            <option value="releaseDate">Year of the release</option>
          </select>

          <select
            name="order" id="order" className="m-l-1"
            onChange={ (e) => handleChange(e) }
          >
            <option value="asc" selected>Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Search;
