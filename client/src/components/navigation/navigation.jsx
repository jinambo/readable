// React dependencies
import React, { useEffect, useState } from 'react';
import Button from 'components/atoms/button';
import Input from 'components/atoms/input';

// Styles
import styles from './navigation.module.scss';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [term, setTerm] = useState('');

  const handleSearch = () => {
    console.log('Searching for the book: ' + term);
  };

  const handleScroll = () => {
    window.scrollY > 120 ? setScrolled(true) : setScrolled(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`${styles['navigation']} ${ scrolled && styles['navigation--scrolled'] }`}>
      <div className="grid container">
        <div className="col-3 col-sm col-align-middle">
          <h1 className="logo">
            <span className="fg-secondary">Read</span>able
            <span className="fg-secondary">.</span>
          </h1>
        </div>

        <div className={`${ styles['search'] } col-6 col-sm col-align-middle`}>
          <Input
            type="text"
            placeholder="Type name of the book .."
            styles={{ flex: 1 }}
            onChangeAction={ (e) => setTerm(e.target.value) }
          />
          <div
            className={ styles['search__btn'] }
            onClick={ handleSearch }
          >
            <img src="/public/search.svg" alt="" />
          </div>
        </div>

        <div className="col-3 col-sm col-align-middle p-l-1 flex h-end">
          <Button
            type="primary"
            link="/login"
          >Přihlásit se</Button>
        </div>
      </div>
      
    </nav>
  );
};

export default Navigation;
