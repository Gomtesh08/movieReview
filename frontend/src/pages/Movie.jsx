import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Appbar from '../components/Appbar';
import axios from 'axios';
import TextInputForm from '../components/TextInputForm';

function Movie() {
  const { id } = useParams(); // Get the movie ID from the URL
  const [reviews, setReviews] = useState([]); // Initialize as empty array
  const [movie, setMovie] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch movie data and reviews
    const fetchMovieData = async () => {
  try {
    const movieResponse = await axios.get(`http://localhost:3000/api/v1/users/getmoviewithreviews/${id}`, { withCredentials: true });
    //  console.log(movieResponse)
    setMovie(movieResponse.data.movie); // movieResponse.data.movie contains movie details and reviews
    setReviews(movieResponse.data.movie.reviews || []); // Ensure reviews is an array from movie object
  
  } catch (error) {
    console.error('Error fetching movie data', error);
  }
};

  
    // Fetch user data from the token stored in the cookie
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get('http://localhost:3000/api/v1/users/currentuser', { withCredentials: true });
        console.log('User Data:', userResponse.data);
        setUser(userResponse.data);
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };
    
  
    fetchMovieData();
    fetchUserData();
  }, [id]);
  

  return (
    <div>
      <Appbar />
      <div className='w-11/12 mx-auto'>
        {movie && (
          <div className='bg-red-500 mt-10 h-64 rounded-xl'>
            <div className='grid grid-cols-3 gap-2'>
              {/* Uncomment the line below if you want to display the movie image */}
              <div className='col-span-1'>
                <img src={movie.imageUrl} alt={movie.title} className='h-64 w-60 object-fit'  />
              </div>
              <div className='col-span-2'>
                <h3 className='mb-10'>{movie.title}</h3>
                <h2>{movie.description}</h2>
              </div>
            </div>
          </div>
        )}


          <TextInputForm/>

        <div className='bg-red-300 mt-10 rounded-xl'>
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.id} className='border p-4 mb-2'>
                <h3>{review.user?.fullName || 'Anonymous'}</h3> {/* Use review.user.fullName or review.user.username */}
                <p>{review.reviewText}</p> {/* Ensure this matches the field name in your review data */}
                {user && String(review.userId) === String(review.user.id) && (
                  <div>
                    <button className='bg-blue-500 text-white px-2 py-1 mr-2'>Edit</button>
                    <button className='bg-red-500 text-white px-2 py-1'>Delete</button>
                  </div>
                )}

              </div>
            ))
          ) : (
            <p>No reviews available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Movie;

