import React, { useState, useEffect } from 'react';
import Appbar from '../components/Appbar';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [userid, setUserId] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setUserId(id); // Update userId when id changes
    }
  }, [id]); // Dependency array includes id

  useEffect(() => {
    // Fetch movie data from the API
    const fetchMovies = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/users/movies');
        setMovies(res.data); // Assuming the API returns an array of movies
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []); // Empty dependency array means this useEffect runs once when the component mounts

  return (
    <div>
      <Appbar />
      <div className="grid grid-cols-3 gap-4 w-11/12 cursor-pointer mx-auto mt-10">
        {movies.map((movie) => (
          <Link to={`/movies/${userid}/getmoviewithreviews/${movie.id}`} key={movie.id}>
            <div className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-white">
              <div className="grid grid-cols-3 gap-1 h-64">
                <div className="col-span-1">
                  <img 
                    src={movie.imageUrl} 
                    alt={movie.title} 
                    className="h-full w-full object-cover rounded-l-xl" 
                  />
                </div>
                <div className="col-span-2 p-4 flex flex-col justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">{movie.title}</h2>
                  <p className="text-sm text-gray-600 overflow-hidden overflow-ellipsis line-clamp-4">
                    {movie.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Movies;
