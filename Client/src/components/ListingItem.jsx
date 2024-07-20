import React from 'react'
import { Link } from 'react-router-dom'

const ListingItem = ({listing}) => {
  return (
    <div className='mx-auto my-2 flex flex-col justify-center items-start bg-white w-[30%] h-[220px] rounded-xl'
    style={{background: 'rgb(241, 241, 241)'}}>
    <Link to={`/listings/${listing._id}`} className='flex flex-row justify-center items-center'>
        
        <img src={listing.imageUrls[0]} alt=""
        className=' w-[180px] h-[180px] mx-3 object-cover rounded-lg'/>

        <div className='flex flex-col items-start justify-start'>
        <h3 className='text-xl font-semibold font-mono'>{listing.name}</h3>
        <p className='text-sm'> <i class="fa-solid fa-location-crosshairs text-green-500 pr-2"></i>
         {listing.address} </p>
        <p className='line-clamp-2 text-xs mb-2 pt-1'> {listing.description} </p>

        {listing.type === "rent" ? 
     ( <button className='bg-red-700 text-white px-3 rounded-full mb-1'>For Rent</button> ) : 
      ( <button className='bg-blue-700 text-white px-3 rounded-full mb-1'>For Sale</button> )
      }

        {listing.type === "rent" ? 
     ( <p className='text-md font-semibold font-sans'>{listing.regularPrice.toLocaleString('en-US')}$ /month</p> ) : 
      ( <p className='text-md font-semibold font-sans'>{listing.regularPrice.toLocaleString('en-US')}$ </p> )
      }


      <div className='flex flex-row pt-2 text-sm gap-2'>

      <p className=''><i class="fa-solid fa-bed text-red-700 pr-2"></i>
       {listing.bedrooms} {listing.bedrooms === 1 ? 'bed' : "beds"}</p>
      <p className=''><i class="fa-solid fa-restroom text-blue-500 pr-2"></i>
      {listing.bathrooms} {listing.bathrooms === 1 ? 'bath' : "bathes"}</p>

      </div>
        </div>

      </Link>
    </div>
    
  )
}


export default ListingItem
