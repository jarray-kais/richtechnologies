import { useState } from 'react';
import './FeaturedProducts.css';
import { useQuery } from '@tanstack/react-query';
import { featuredproduct } from '../../API';

const FeaturedProducts = () => {

    const [page , setPage] = useState(1)
   

    const { data , error , isLoading }= useQuery({
            queryKey : ['featured', page],
            queryFn : ()=> featuredproduct(page),
            refetchOnWindowFocus : false,
            retry : 1,
            staleTime : 100000
    })
    console.log(data)
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='featured'>
      <div className='featured-title'>
        <h2>Featured Products</h2>
      </div>
      <div className='featured-products'>
        {data.map((product) => (
          <ul key={product._id}>
               <li>{product.brand}</li> 
               <li>{product.name}</li>
               <img src={`${product.image[0].url}`} alt={product.name} />
          </ul>
        ))}
    

      <div className="pagination-controls">
        <button onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}>Previous</button>
        <button onClick={() => setPage((prevPage) => prevPage + 1)}>Next</button>
      </div>
      </div>

    </div>
  )
}

export default FeaturedProducts