import React, { useState, useEffect } from 'react';
import axios from './axios';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';
import "./Row.css";

const base_url = "https://image.tmdb.org/t/p/original"

function Row({ title, fetchUrl, isLargeRow }) { // is large parameter to check if the row requires a large sized poster
  const [movies, setMovies] = useState([]);//state used for storing info for short time
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {  
//this code will run when the row loads so that it gets info
    async function fetchData() {

      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);//useEffect has been givn this var as dependency as inside it is using this var

  const opts = {
    height: "390",
    width: "99%",
    playerVars: {
      autoplay: 0,
    }
  }

  const handleClick = (movie) => {
    // console.table(movie?.title)
    if (trailerUrl) {
      setTrailerUrl('')
    } else {
      movieTrailer(movie?.title || "")
        .then(url => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get('v'));
        }).catch((error) => console.log(error));
    }
  }

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row_posters">
        {movies.map(movie => {
          return <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row_poster ${isLargeRow && "row_posterLarge"}`}
            src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
            alt={movie.name} />
        })}
      </div>
      <div style={{ padding: "40px" }}>
        {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
      </div>
    </div>
  );
}

export default Row;