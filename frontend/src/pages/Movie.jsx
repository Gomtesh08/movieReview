import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Appbar from '../components/Appbar';
import axios from 'axios';
import TextInputForm from '../components/TextInputForm';
import '../pages/movie.css'; // Import the CSS file

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
        setUser(userResponse.data);
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchMovieData();
    fetchUserData();
  }, [id]);

  // Handler for deleting a review
  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/reviews/${reviewId}`, { withCredentials: true });
      // Remove the deleted review from state
      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review', error);
    }
  };

  // Handler for editing a review
  const handleEdit = (reviewId) => {
    // Implement the edit functionality
    // You might want to set the review to be edited and show an edit form or modal
    console.log('Edit review with ID:', reviewId);
  };

  return (
    <div>
      <Appbar />
      <div className="movie-container">
        {movie && (
          <div className="movie-details">
            <div className="grid grid-cols-3 gap-4">
              {/* Uncomment the line below if you want to display the movie image */}
              <div className="col-span-1">
                <img src={movie.imageUrl} alt={movie.title} className="movie-image" />
              </div>
              <div className="col-span-2 movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-description">{movie.description}</p>
              </div>
            </div>
          </div>
        )}

        <TextInputForm className="text-input-form" />

        <div className="reviews-container">
          <h2 className="reviews-headline">Reviews</h2> {/* Reviews headline */}
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.id} className="review-item">
                <h3 className="review-user">{review.user?.fullName || 'Anonymous'}</h3>
                <p className="review-text">{review.reviewText}</p>
                {user && String(review.userId) === String(user.id) && (
                  <div className="review-actions">
                    <button
                      className="review-button review-button-edit"
                      onClick={() => handleEdit(review.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="review-button review-button-delete"
                      onClick={() => handleDelete(review.id)}
                    >
                      Delete
                    </button>
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
