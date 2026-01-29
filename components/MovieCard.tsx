import { Link } from 'react-router-dom';
import type { MoviePreview } from '../types/MoviePreview.ts';

// Formatting how movies will be displayed throughout the web app
function MovieCard(m: MoviePreview) {
    return(
        <Link to={`/movie/${m.id}`} className='movie-card'>
            <img 
                src={`https://image.tmdb.org/t/p/w185${m.poster_path}`} 
                alt={m.title} 
                style={{ width: 50 }}
            />
            <div className="movie-card-content">
                <p>{m.title}</p>
                <i className="fa-solid fa-angle-right"></i>
            </div>
        </Link>
    );
}

export default MovieCard;