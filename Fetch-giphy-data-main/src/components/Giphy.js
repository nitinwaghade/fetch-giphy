import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import Paginate from "./Paginate";

const Giphy = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);  // eslint-disable-next-line
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

   useEffect(() => {                     // 1. make api call //
    const fetchGifs = async () => {
      setIsError(false);
      setLoading(true);

      try {
        const resultsGifs = await axios("https://api.giphy.com/v1/gifs/trending", {
          params: {
            api_key: "Dst7UyI10lCaZeA9seXlAWA2qaXf0uGY",
            limit:100
          }
        });

        // console.log(resultsGifs);
        setData(resultsGifs.data.data);          //2. show gifs data in giphy component //
      }
       catch (err) {
        setIsError(true);
        setTimeout(() => setIsError(false), 2000);
      }

      setLoading(false);
    };

    fetchGifs();
  }, []);


  const renderGifs = () => {
    if (loading) {
      return <Loader />;
    }
    return currentItems.map(el => {
      return (
         // eslint-disable-next-line
        <div key={el.id} className="gif"> 
      
          <img src={el.images.fixed_height.url} />
        </div>
      );
    });
  };

  const renderError = () => {
    if (isError) {
      return (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          Unable to get Gifs, please try again in a few minutes.
        </div>
      );
    }
  };

  const SearchGifs = event => {
    setSearch(event.target.value);
  };

  const SubmitGifs = async event => {
    event.preventDefault();
    setIsError(false);
    setLoading(true);
     try {
      const results = await axios("https://api.giphy.com/v1/gifs/search", {
        params: {
          api_key: "Dst7UyI10lCaZeA9seXlAWA2qaXf0uGY",
          q: search,
          limit:100
        }
      });
      setData(results.data.data);
    } catch (err) {
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
    }
     setLoading(false);
  };

  const pageSelected = pageNumber => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="m-2">
      {renderError()}
      <form className="form-inline justify-content-center m-2">
        <input
          value={search}
          onChange={SearchGifs}
          type="text"
          required
          placeholder="search"
          className="form-control"

        />
        <button   
          onClick={SubmitGifs}
          type="submit"
          className="btn btn-primary mx-2"
        >
          Search  
        </button>
        
      </form>
      <Paginate
        pageSelected={pageSelected}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={data.length}
      />
      <div className="container gifs">{renderGifs()}</div>
    </div>
  );
};

export default Giphy;
