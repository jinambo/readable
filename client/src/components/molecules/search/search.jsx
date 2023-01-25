import Button from 'components/atoms/button';
import Input from 'components/atoms/input';
import React, { useId } from 'react';
import { useState } from 'react';

const Search = ({ inputs, setQuery }) => {
  // Generate unique form ID
  const formId = useId();

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

  const handleSearch = (e) => {
    e.preventDefault();

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
    <form className="grid v-end p-t-3" id={formId}>
      { inputs && inputs.map(input => (
        <div key={ input.name } className={`col-${ input.cols } col-middle`}>
          <p className="fg-dark">{ input.label }</p>
          <Input
            name={ input.name }
            type={ input.type }
            placeholder={ input.placeholder }
            styles={{ flex: 1 }}
            onChangeAction={ (e) => handleChange(e) }
          />
        </div>
      )) }

      <div className="col-2 col-middle">
        <Button
          type="secondary"
          styles={{ textAlign: 'center', padding: '0.8125rem 1rem' }}
          onClickAction={ (e) => handleSearch(e) }
        >Search</Button>
      </div>

      <div className="col-12 flex h-between fg-dark">
        <div className="flex">
          <div className="radio">
            <input
              type="radio" id={`and-${formId}`}
              name="operator" value="and"
              defaultChecked
              onChange={ (e) => setOperator(e.target.value) }
            />
            <label htmlFor={`and-${formId}`}>All values</label>
          </div>
          <div className="radio m-l-1">
            <input
              type="radio" id={`or-${formId}`}
              name="operator" value="or"
              onChange={ (e) => setOperator(e.target.value) }
            />
            <label htmlFor={`or-${formId}`}>Some values</label>
          </div>
        </div>
        <div className="flex p-t-1">
          <select
            name="sort" id={`sort-${formId}`}
            onChange={ (e) => handleChange(e) }
          >
            { inputs && inputs.map(input => (
              <option key={ input.name } value={ input.name }>{ input.label }</option>              
            )) }
          </select>

          <select
            name="order" id={`order-${formId}`} className="m-l-0"
            onChange={ (e) => handleChange(e) }
          >
            <option value="asc" defaultValue>Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </form>
  );
}

export default Search;
