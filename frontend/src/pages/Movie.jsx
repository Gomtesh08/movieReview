// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import Appbar from '../components/Appbar';
// import axios from 'axios';
// import TextInputForm from '../components/TextInputForm';
// import '../pages/movie.css'; // Import the CSS file

// function Movie() {
//   const { userId, movieId } = useParams(); 
//   console.log('User ID:', userId); // Debug statement
//   const [reviews, setReviews] = useState([]); // Initialize as empty array
//   const [movie, setMovie] = useState(null);
//   const [editingReview, setEditingReview] = useState(null); // State to manage the review being edited
//   const [editedReviewText, setEditedReviewText] = useState('');
//   const [editedRating, setEditedRating] = useState('');

//   useEffect(() => {
//     if (!movieId) {
//       console.error('Movie ID is missing.');
//       return;
//     }

//     const fetchMovieData = async () => {
//       try {
//         const movieResponse = await axios.get(`http://localhost:3000/api/v1/users/getmoviewithreviews/${movieId}`, { withCredentials: true });
//         setMovie(movieResponse.data.movie); // movieResponse.data.movie contains movie details and reviews
//         setReviews(movieResponse.data.movie.reviews || []); // Ensure reviews is an array from movie object
//       } catch (error) {
//         console.error('Error fetching movie data', error);
//       }
//     };

//     console.log('Movie ID:', movieId); // Correct debug statement
//     fetchMovieData();
//   }, [movieId]); // Correct dependency

//   // Handler for deleting a review
//   const handleDelete = async (reviewId) => {
//     try {
//       await axios.delete(`http://localhost:3000/api/v1/users/deletereview/${reviewId}`, { withCredentials: true });
//       // Remove the deleted review from state
//       setReviews(reviews.filter(review => review.id !== reviewId));
//     } catch (error) {
//       console.error('Error deleting review', error);
//     }
//   };

//   // Handler for editing a review
//   const handleEdit = (review) => {
//     // Set the review to be edited
//     setEditingReview(review);
//     setEditedReviewText(review.reviewText);
//     setEditedRating(review.rating);
//   };

//   // Handle form submission for editing review
//   const handleEditSubmit = async (event) => {
//     event.preventDefault();
//     if (editingReview) {
//       try {
//         await axios.put(`http://localhost:3000/api/v1/users/updatereview/${editingReview.id}`, {
//           reviewText: editedReviewText,
//           rating: editedRating
//         }, { withCredentials: true });

//         // Update the review in the state
//         setReviews(reviews.map(review => 
//           review.id === editingReview.id ? { ...review, reviewText: editedReviewText, rating: editedRating } : review
//         ));

//         // Clear editing state
//         setEditingReview(null);
//         setEditedReviewText('');
//         setEditedRating('');
//       } catch (error) {
//         console.error('Error updating review', error);
//       }
//     }
//   };

//   return (
//     <div>
//       <Appbar />
//       <div className="movie-container">
//         {movie && (
//           <div className="movie-details">
//             <div className="grid grid-cols-3 gap-4">
//               {/* Uncomment the line below if you want to display the movie image */}
//               <div className="col-span-1">
//                 <img src={movie.imageUrl} alt={movie.title} className="movie-image" />
//               </div>
//               <div className="col-span-2 movie-info">
//                 <h3 className="movie-title">{movie.title}</h3>
//                 <p className="movie-description">{movie.description}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         <TextInputForm 
//           movieId={movieId} 
//           userId = {userId}
//           onEditSubmit={handleEditSubmit} 
//           editingReview={editingReview} 
//           setEditedReviewText={setEditedReviewText} 
//           setEditedRating={setEditedRating}
//         />

//         <div className="reviews-container">
//           <h2 className="reviews-headline">Reviews</h2> {/* Reviews headline */}
//           {reviews.length > 0 ? (
//             reviews.map(review => (
//               <div key={review.id} className="review-item">
//                 <h3 className="review-user">{review.user?.fullName || 'Anonymous'}</h3>
//                 <p className="review-text">{review.reviewText}</p>
//                 <p className="review-rating">Rating: {review.rating}</p>
//                 {userId && String(review.userId) === String(userId) && (
//                   <div className="review-actions">
//                     <button
//                       className="review-button review-button-edit"
//                       onClick={() => handleEdit(review)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="review-button review-button-delete"
//                       onClick={() => handleDelete(review.id)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p>No reviews available.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Movie;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Appbar from '../components/Appbar';
import axios from 'axios';
import '../pages/movie.css'; // Import the CSS file

function Movie() {
  const { userId, movieId } = useParams(); 
  const [reviews, setReviews] = useState([]); // Initialize as empty array
  const [movie, setMovie] = useState(null);
  const [editingReview, setEditingReview] = useState(null); // State to manage the review being edited
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState('');

  useEffect(() => {
    if (!movieId) {
      console.error('Movie ID is missing.');
      return;
    }

    const fetchMovieData = async () => {
      try {
        const movieResponse = await axios.get(`http://localhost:3000/api/v1/users/getmoviewithreviews/${movieId}`, { withCredentials: true });
        setMovie(movieResponse.data.movie); // movieResponse.data.movie contains movie details and reviews
        setReviews(movieResponse.data.movie.reviews || []); // Ensure reviews is an array from movie object
      } catch (error) {
        console.error('Error fetching movie data', error);
      }
    };

    fetchMovieData();
  }, [movieId]); // Correct dependency

  // Handler for deleting a review
  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/users/deletereview/${reviewId}`, { withCredentials: true });
      // Remove the deleted review from state
      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review', error);
    }
  };

  // Handler for editing a review
  const handleEdit = (review) => {
    setEditingReview(review);
    setReviewText(review.reviewText);
    setRating(review.rating);
  };

  // Handle form submission for adding or editing review
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (editingReview) {
      // Editing an existing review
      try {
        await axios.put(`http://localhost:3000/api/v1/users/updatereview/${editingReview.id}`, {
          reviewText,
          rating
        }, { withCredentials: true });

        // Update the review in the state
        setReviews(reviews.map(review => 
          review.id === editingReview.id ? { ...review, reviewText, rating } : review
        ));

        // Clear editing state
        setEditingReview(null);
        setReviewText('');
        setRating('');
      } catch (error) {
        console.error('Error updating review', error);
      }
    } else {
      // Adding a new review
      try {
        await axios.put(`http://localhost:3000/api/v1/users/createreview/${movieId}/${userId}`, {
          reviewText,
          rating
        }, { withCredentials: true });

        // Add the new review to the state
        const newReview = {
          id: Date.now(), // Generate a temporary ID for local state
          reviewText,
          rating,
          user: { fullName: 'You' } // You can adjust this based on the logged-in user details
        };
        setReviews([...reviews, newReview]);
        setReviewText('');
        setRating('');
      } catch (error) {
        console.error('Error adding new review', error);
      }
    }
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

<div className="bg-white p-6 rounded-lg shadow-md mt-4">
  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
    {editingReview ? 'Edit Review' : 'Add a Review'}
  </h2>
  <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
    <textarea
      name="reviewText"
      value={reviewText}
      onChange={(e) => setReviewText(e.target.value)}
      placeholder="Write your review here..."
      required
      className="w-full p-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:border-blue-500 transition duration-300"
    />
    <input
      type="number"
      name="rating"
      min="1"
      max="10"
      value={rating}
      onChange={(e) => setRating(e.target.value)}
      placeholder="Rating (1-10)"
      required
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
    />
    <button
      type="submit"
      className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
    >
      {editingReview ? 'Save Changes' : 'Submit Review'}
    </button>
  </form>
</div>


        <div className="reviews-container">
          <h2 className="reviews-headline">Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.id} className="review-item">
                <h3 className="review-user">{review.user?.fullName || 'Anonymous'}</h3>
                <p className="review-text">{review.reviewText}</p>
                <p className="review-rating">Rating: {review.rating}</p>
                {userId && String(review.userId) === String(userId) && (
                  <div className="review-actions">
                    <button
                      className="review-button review-button-edit"
                      onClick={() => handleEdit(review)}
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
