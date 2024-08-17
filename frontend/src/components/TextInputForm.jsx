import React, { useState } from 'react';
import axios from 'axios';

function ReviewForm({ movieId  , userId}) {
  const id = movieId ;
  console.log(movieId)
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!rating || !reviewText) {
      setError('Rating and review text are required');
      return;
    }
  
    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/users/createreview/${movieId}/${userId}`, // Ensure movieId and userid are included in the URL
        {
          reviewText,
          rating: parseInt(rating, 10),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
  
      console.log('Review submitted:', response.data);
      setSuccess('Review submitted successfully!');
      setRating('');
      setReviewText('');
      setError(null);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
      setSuccess(null);
    }
  };

  return (
    <div className="w-11/12 mx-auto mt-8 p-4 bg-white shadow-lg rounded-lg">
      <h1>{movieId}</h1>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Submit Your Review</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
          <input
            type="number"
            id="rating"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter a rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="10"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700">Review</label>
          <textarea
            id="reviewText"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Write your review here"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
          ></textarea>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;
