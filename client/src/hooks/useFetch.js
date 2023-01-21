import { useEffect, useState } from "react";
import methods from "utils/methods";

const useFetch = ({ url: initialUrl, method, body: initialBody }) => {
    const [url, setUrl] = useState(initialUrl);
    const [body, setBody] = useState(initialBody);
    const [refetch, setRefetch] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // If method is not specified, set it to GET
    if (!method) method = methods.GET;

    useEffect(() => {
        // Don't fetch if fetchTriggered 
        if (method !== methods.GET && !refetch) return;

        // Reset loading and error state and fetchTriggered
        setLoading(true);
        setError('');

        // Check for token in storage
        const token = localStorage.getItem('token');
        
        // Create headers object
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };

        // Fetch data from url provided
        fetch(url, {
            method, 
            headers, 
            ...(body && { body: JSON.stringify(body) })
        })
            .then((res) => res.json())
            .then((data) => {
                setError(data.error)
                setData(data)
                setLoading(false)
            })
    }, [url, body, refetch]);

    // Update url state function 
    const refetchByUrl = (newUrl) => {
        setUrl(newUrl);
        setRefetch(true);
    }

    // Update body state function 
    const refetchByBody = (newBody) => {
        setBody(newBody);
        setRefetch(true);
    };

    const send = () => setRefetch(true);

    // Return data as an object
    return { data, loading, error, send, refetchByUrl, refetchByBody };
};

export default useFetch;

