import { Link } from 'react-router-dom';
import styles from './bookItem.module.scss';

const BookItem = ({book}) => {
  return (
    <Link to={ `/book/${book._id}` } className="col-3 p-1" style={{ textDecoration: 'none' }}>
      <div className={styles['book']}>
        <div className={styles['book__img']}>
          <img src={ book.cover ? book.cover : '/public/placeholder.jpeg' } alt={ book.name } />
        </div>
        <div className={`${styles['book__info']} p-1`}>
          <h3 className="fg-dark">{ book.name }</h3>
          <div className="flex v-center h-between fg-dark">
            <h5>{book?.author?.name}</h5>
            <p>{ new Date(book.releaseDate).getFullYear() }</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BookItem;
