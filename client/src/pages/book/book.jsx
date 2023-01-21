import { useParams } from "react-router-dom";
import useFetch from 'hooks/useFetch';

const Book = () => {
  const params = useParams();
  const { data, loading, error } = useFetch({
    url: `http://localhost:4000/books/${params.id}`
  });

  return (
    <div className="container p-y-4 fg-dark">
      { (!loading && data) && <>
      
        <h1>{data.name}</h1>
        <p>{data.description}</p>

      </>}
    </div>
  );
}

export default Book;
