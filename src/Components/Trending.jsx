import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Styles/Trending.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Styles/TrendingSlick.css";
import { Skeleton } from "@mui/material";
import SelectMovieTv from "./SelectMovieTv";
import Badge from "@mui/material/Badge";

const token = `${process.env.REACT_APP_TOKEN}`;

export default function Trending({ setId }) {
  const [result, setResult] = useState([]);
  const [onDayFocus, setOnDayFocus] = useState(true);
  // const [onWeekFocus, setOnWeekFocus] = useState(false);
  const [tvActive, setTvActive] = useState(false);
  const [movieActive, setMovieActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({});
  const backgroundRef = useRef();
  const trendingHeaderRef = useRef();

  useEffect(() => {
    trendingMovieDay();
  }, []);

  useEffect(() => {
    backgroundRef.current.style.backgroundImage =
      result.length > 0
        ? `url(${config.baseURL}${config.backdropSize}${result[0].backdrop_path})`
        : "none";
  });

  async function trendingMovieDay() {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/configuration",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const result = await response.json();

      const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/day`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const data = await res.json();

      // File path used in getting poster img
      setConfig({
        baseURL: result.images.secure_base_url,
        posterSize: result.images.still_sizes[2],
        backdropSize: result.images.backdrop_sizes[3],
      });
      setResult(data.results);
    } catch (error) {
      console.log("Error fetching trending movies of day data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function trendingMovieWeek() {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const data = await res.json();

      setResult(data.results);
    } catch (error) {
      console.log("Error fetching trending movies of week data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function trendingTvDay() {
    setLoading(true);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/trending/tv/day`, {
        headers: {
          Authorization: token,
        },
      });
      const data = await res.json();

      setResult(data.results);
    } catch (error) {
      console.log("Error fetching trending tv shows of day data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function trendingTvWeek() {
    setLoading(true);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/trending/tv/week`, {
        headers: {
          Authorization: token,
        },
      });
      const data = await res.json();

      setResult(data.results);
    } catch (error) {
      console.log("Error fetching trending tv shows of week data:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleDayClick() {
    if (movieActive) {
      setOnDayFocus(true);
      trendingMovieDay();
      trendingHeaderRef.current.textContent = "Trending Movies - Day";
    } else {
      setOnDayFocus(true);
      trendingTvDay();
      trendingHeaderRef.current.textContent = "Trending Shows - Day";
    }
  }

  function handleWeekClick() {
    if (movieActive) {
      setOnDayFocus(false);
      trendingMovieWeek();
      trendingHeaderRef.current.textContent = "Trending Movies - Week";
    } else {
      setOnDayFocus(false);
      trendingTvWeek();
      trendingHeaderRef.current.textContent = "Trending Shows - Week";
    }
  }

  function handleMoviesBtnClick() {
    setMovieActive(true);
    setTvActive(false);
    if (onDayFocus) {
      trendingMovieDay();
      trendingHeaderRef.current.textContent = "Trending Movies - Day";
    } else {
      trendingMovieWeek();
      trendingHeaderRef.current.textContent = "Trending Movies - Week";
    }
  }

  function handleTvClick() {
    setMovieActive(false);
    setTvActive(true);
    if (onDayFocus) {
      trendingTvDay();
      trendingHeaderRef.current.textContent = "Trending Shows - Day";
    } else {
      trendingTvWeek();
      trendingHeaderRef.current.textContent = "Trending Shows - Week";
    }
  }

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 4,
    variableWidth: true,
    rows: 1,
    pauseOnFocus: true,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  function handleHover(i) {
    backgroundRef.current.style.backgroundImage = `url(${config.baseURL}${config.backdropSize}${result[i].backdrop_path})`;
  }

  return (
    <>
      <div className={styles.container} ref={backgroundRef}>
        <h1>Welcome</h1>
        <p>Millions of Movies and TV Shows to discover. Explore now.</p>
      </div>
      <div className={styles.wrapper} style={{ color: "black" }}>
        <div className={styles.top}>
          <h2 ref={trendingHeaderRef}>Trending Movies - Day</h2>

          <SelectMovieTv
            className={styles.selectClass}
            movieClick={handleMoviesBtnClick}
            tvClick={handleTvClick}
            dayClick={handleDayClick}
            weekClick={handleWeekClick}
          />
        </div>

        {loading ? (
          <div className={styles.skeletonDiv}>
            <Skeleton
              variant="rounded"
              width={150}
              height={220}
              sx={{ bgcolor: "grey.900" }}
            />
            <Skeleton
              variant="rounded"
              width={150}
              height={220}
              sx={{ bgcolor: "grey.900" }}
            />
            <Skeleton
              variant="rounded"
              width={150}
              height={220}
              sx={{ bgcolor: "grey.900" }}
            />
            <Skeleton
              variant="rounded"
              width={150}
              height={220}
              sx={{ bgcolor: "grey.900" }}
            />
          </div>
        ) : (
          <div className={styles.sliderContainer}>
            <Slider {...settings}>
              {result.map((el, i) => {
                if (el.media_type === "movie") {
                  return (
                    <Link
                      to={`/movies/${el.id}`}
                      style={{ display: "block", width: "100px" }}
                      key={el.id}
                    >
                      <Badge
                        badgeContent={Math.round(el.vote_average * 10) / 10}
                        color="primary"
                      >
                        <img
                          onMouseEnter={function something() {
                            handleHover(i);
                          }}
                          key={el.id}
                          className={styles.poster}
                          src={`${config.baseURL}${config.posterSize}${el.poster_path}`}
                          alt={el.title}
                        />
                      </Badge>
                    </Link>
                  );
                } else {
                  return (
                    <Link
                      to={`/shows/${el.id}`}
                      style={{ display: "block", width: "100px" }}
                      key={el.id}
                    >
                      <Badge
                        badgeContent={Math.round(el.vote_average * 10) / 10}
                        color="primary"
                      >
                        <img
                          onMouseEnter={function something() {
                            handleHover(i);
                          }}
                          key={el.id}
                          className={styles.poster}
                          src={`${config.baseURL}${config.posterSize}${el.poster_path}`}
                          alt={el.name}
                        />
                      </Badge>
                    </Link>
                  );
                }
              })}
            </Slider>
          </div>
        )}
      </div>
    </>
  );
}
