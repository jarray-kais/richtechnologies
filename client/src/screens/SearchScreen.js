import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { maincategory, fetchbrand, search } from "../API";
import Loading from "../components/Loading/Loading";
import Message from "../components/Message/Message";
import queryString from 'query-string';
import { useState } from "react";
import Product from "../components/featuredProduct/Product";


const SearchScreen = () => {

const query = useLocation().search
const [page , setPage]= useState(1)
const [limit , setLimit]= useState(15)


console.log(query);
console.log(page)
  const {
    data: searchResult,
    isLoading: searchLoading,
    isError: searchError,
    isPreviousData,
  } = useQuery({
    queryKey: ["search", query, page, limit],
    queryFn: () => search(query, page, limit),
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 3000,
    keepPreviousData: true,
  });
  console.log(isPreviousData);

  const {
    data: categories,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useQuery({
    queryKey: ["category"],
    queryFn: maincategory,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const {
    data: allBrands,
    isLoading: brandLoading,
    isError: brandError,
  } = useQuery({
    queryKey: ["Allbrand"],
    queryFn: () => fetchbrand(""),
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 30000,
  });

 
  const handleNextPage = () => {
    setPage((old) => (old < limit ? old + 1 : old));
  };

  const handlePreviousPage = () => {
    setPage((old) => Math.max(old - 1, 1));
  };

 
  return (
    <div className="search">
      {categoryLoading || brandLoading ? (
        <Loading />
      ) : categoryError || brandError ? (
        <Message variant="danger">
          {categoryError?.message}
          {brandError?.message}
          

        </Message>
      ) : (
        <>
          <div className="list-c">
            <div className="category">
              <h2>Category</h2>
              <div className="categorylist">
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    to={{ pathname : "/search",
                    search: "?query="+ queryString.stringify({category })}}
                    
                    className="facet__link"
                  >
                    <label>
                      <input
                        type="radio"
                        value={category}
                        readOnly
                        className="option-input radio"
                      />
                      {category}
                    </label>
                  </Link>
                ))}
              </div>
            </div>
            <div className="price"></div>
            <div className="brand-filter">
              <h2>Popular Brands</h2>
              <div className="brandlist">
                {allBrands.map((brand, index) => (
                  <Link
                    key={index}
                  
                    className="facet__link"
                  >
                    <input
                      type="checkbox"
                      value={brand}
                      
                      readOnly
                      className="option-input"
                    />
                    {brand}
                  </Link>
                ))}
              </div>
            </div>
          </div>
         <div className="productList">
         {searchLoading ? (<Loading />) :  searchError ? (<Message variant="danger">{searchError.message}</Message>):(
          <>
            <div className="searchproduct">
           
              {searchResult?.results?.length > 0 ? (
                searchResult.results.map((result, index) =>
                  result.fullDocument ? (
                    <Product
                      key={result.fullDocument._id}
                      product={result.fullDocument}
                    />
                  ) : (
                    <p key={index}>No product found</p>
                  )
                )
              ) : (
                <p>No products found</p>
              )}
            </div>
            
            <button
              onClick={handlePreviousPage}
              disabled={page === 0}
              className="pagination-button"
            >
              Previous Page
            </button>
            <div className="pagination">Current Page: {page}</div>
            

            <button
             onClick={handleNextPage}
              disabled={
                searchResult?.totalDocs % limit === 0 &&
                page === Math.ceil(searchResult?.totalDocs / limit)
              }
             
             
             className="pagination-button"
            >
              Next Page
            </button>
           
            </>
            )}
          </div> 
        </>
      )}
    </div>
  );
};

export default SearchScreen;
