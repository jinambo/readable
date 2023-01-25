import useFetch from "hooks/useFetch";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

const UserProvider = ({ children, currentUser }) => {
    const [user, setUser] = useState(currentUser);
    const [cart, setCart] = useState([]);

    const { data, loading, error, send } = useFetch({
        url: 'http://localhost:4000/users/account'
    });

    // If request returned user, set it to the state
    useEffect(() => {
        console.log('setting user state to:' + data?.username)
        if (data?.username) setUser(data);
    }, [loading]);

    // If there are books in the local storage set it to the state
    useEffect(() => {
        const booksStr = localStorage.getItem('books');
        if (booksStr) setCart(JSON.parse(booksStr));
    }, []);

    return (
        <UserContext.Provider value={ { user, setUser, cart, setCart } }>
            { children }
        </UserContext.Provider>
    );
};
export default UserProvider;