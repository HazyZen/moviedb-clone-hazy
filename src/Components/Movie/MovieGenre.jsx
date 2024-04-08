import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "../Styles/MovieGenre.module.css";
import Loading from "../Loading";
import { Button } from "@mui/material";
import ScrollButton from "../ScrollButton";
import defaultPoster from "../Images/defaultPoster.jpg";

const token = `${process.env.REACT_APP_TOKEN}`;

export default function MovieGenre() {
  const [config, setConfig] = useState();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showSpinner, setShowSpinner] = useState(false);
  const [genreList, setGenreList] = useState({});
  const { genreid } = useParams();

  useEffect(() => {
    getGenre(1);
    getGenreList();
  }, []);

  async function getGenre(page) {
    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/configuration",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const apiConfig = await response.json();
      setConfig({
        baseURL: apiConfig.images.secure_base_url,
        backdropSize: apiConfig.images.backdrop_sizes[2],
        posterSize: apiConfig.images.still_sizes[2],
      });

      if (page === 1) {
        setLoading(true);
        const genreResponse = await fetch(
          `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${genreid}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const genreResult = await genreResponse.json();
        setData(genreResult);
        setShowSpinner(false);
      } else if (page >= 2) {
        const genreResponse = await fetch(
          `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${genreid}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const genreResult = await genreResponse.json();
        setData((prevData) => ({
          ...prevData,
          results: [...prevData.results, ...genreResult.results],
        }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (page === 1) {
        setLoading(false);
      } else if (page > 1) {
        setShowSpinner(false);
      }
    }
  }

  async function getGenreList() {
    const resList = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?language=en`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const resultList = await resList.json();
    setGenreList(resultList);
  }

  function handleClickMore(e) {
    e.preventDefault();
    setShowSpinner(true);
    setPage(page + 1);
    getGenre(page + 1);
  }

  return (
    <>
      {genreList &&
        genreList.genres &&
        genreList.genres.map((genre) => {
          return genre.id == genreid ? (
            <h1 style={{ textAlign: "center", margin: "20px 0 10px" }}>
              {genre.name} Movies
            </h1>
          ) : null;
        })}

      <div className={styles.container}>
        {loading && !data.results ? (
          <Loading />
        ) : (
          <>
            {data.results &&
              data.results.map((el) => {
                return (
                  <div key={el.id} className={styles.movieContainer}>
                    <Link
                      to={`/movies/${el.id}`}
                      style={{
                        textDecoration: "none",
                        width: "fit-content",
                        height: "fit-content",
                      }}
                      key={el.id}
                    >
                      <img
                        className={styles.poster}
                        src={
                          el.poster_path
                            ? `${config.baseURL}${config.posterSize}${el.poster_path}`
                            : `${defaultPoster}`
                        }
                        alt={el.title}
                      />
                    </Link>
                    <div className={styles.textContent}>
                      <Link
                        to={`/movies/${el.id}`}
                        style={{
                          textDecoration: "none",
                          width: "100%",
                          height: "fit-content",
                        }}
                        key={el.id}
                      >
                        <p className={styles.movieTitle}>{el.title}</p>
                      </Link>
                      <p className={styles.overview}>
                        {el.overview.slice(0, 100).concat("...")}
                      </p>
                      <p className={styles.date}>
                        {new Date(el.release_date)
                          .toDateString()
                          .slice(4)
                          .replaceAll(" ", "/")}
                      </p>
                    </div>
                  </div>
                );
              })}

            {!loading && data.results && (
              <>
                {showSpinner ? (
                  <Loading />
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleClickMore}
                    className={styles.loadMore}
                  >
                    Load More
                  </Button>
                )}
              </>
            )}
          </>
        )}
      </div>
      <ScrollButton />
    </>
  );
}
