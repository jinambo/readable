// React dependencies
import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { UserContext } from 'contexts/UserProvider';
import Button from 'components/atoms/button';

// Styles
import styles from './navigation.module.scss';

const Navigation = ({ setCartOpened, cartContentLength }) => {
  // Cart and user getter from the context
  const { user, cart } = useContext(UserContext);

  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    window.scrollY > 120 ? setScrolled(true) : setScrolled(false);
  };

  // Trigger handleScroll function on the scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`${styles['navigation']} ${ scrolled && styles['navigation--scrolled'] }`}>
      <div className="grid container">
        <div className="col-8 col-sm col-align-middle">
          <Link to={`/`} style={{ textDecoration: 'none' }}>
            <h1 className="logo fg-dark">
              <span className="fg-secondary">Read</span>able
              <span className="fg-secondary">.</span>
            </h1>
          </Link>
        </div>

        <div className="col-4 col-sm col-align-middle p-l-1 flex h-end v-center">
          { user ?
            <>
              <Link to="/account" className="fg-secondary">
                { user.name }'s account
              </Link>
              <div
                to={`#`}
                className={`${ styles['cart'] } fg-secondary m-l-1`}
                onClick={ () => setCartOpened(true) }
              >
                <img src='/public/cart.svg'></img>
                <span className={`${ styles['cart__amount'] }`}>
                  { cart.length }
                </span>
              </div>
            </> :
            <>            
              <Button
                type="secondary"
                link="/auth/register"
              >Create an account</Button>
              <Button
                type="primary"
                link="/auth/login"
                styles={{ marginLeft: '0.5rem' }}
              >Login to account</Button>
            </>
          }
        </div>
      </div>
      
    </nav>
  );
};

export default Navigation;
