import React, { useEffect, useState } from 'react'
import './ListingPage.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle'
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';


const ListingPage = () => {
    SwiperCore.use( [Navigation] )
    const params = useParams();
    const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [yourListing, setYourListing] = useState(null);

  const navigate = useNavigate();

  console.log(yourListing)

  const  { currentUser } = useSelector(state => state.user);

  const listingId = params.listingId; 

    useEffect(() => {
        const fetchListing = async () => {
    
          try {
            setLoading(true);
          setError(false);
          
          const res = await fetch(`/api/listings/get/${listingId}`);
    
          const data = await res.json();
          setLoading(false);
    
          if (data.success === false) {
            setLoading(false)
            setError(data.message);
            console.log(error);
            return
          }

          setYourListing(data);
          console.log(yourListing);
    
        } catch (error) {
            setLoading(false);
             setError(error.message);
            console.log(error); 
          }
        
        }
    
        fetchListing();
      }, [])

      const handleListingDelete = async (listingId) => {
        try {
            const res = await fetch(`/api/listings/delete/${listingId}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (data.success === false) {
                console.log(data.message);
                return;
            }

            setYourListing((prev) => prev.filter((listing) => listing._id !== listingId));
            navigate('/')

        } catch (error) {
            console.log(error.message);
        }
    }

    const showDeleteMessage = () => {
      document.getElementById('ques-div').classList.remove('ques-div');
    }

    const hideDeleteMessage = () => {
      document.getElementById('ques-div').classList.add('ques-div');
    }

  return (
    <main>
     { loading && <p className='text-center p-7 text-2xl'>Loading...</p> }   
     { error && <p className='text-center p-7 text-2xl'>Something went wrong...</p> }  
     { yourListing && !loading && !error && (
    <div className='w-[90%] mx-auto flex flex-row my-20'>
            <div className='w-[50%]'>
            <Swiper navigation>
                {yourListing.imageUrls.map(url => 
                    <SwiperSlide key={url}>
                        <div className='h-[450px]' style={{background: `url(${url}) center no-repeat`, 
                        backgroundSize: 'cover'}}></div>
                    </SwiperSlide>
                )}
            </Swiper>
            </div>
        
     <div className=''>
        <div className="px-5 py-3">
          <div className='w-[100%] flex flex-col justify-between items-start mb-2'>
          <h1 className='text-3xl font-sans font-semibold pt-1 pb-3'
        style={{fontFamily: 'Segoe UI'}}>{yourListing.name} </h1>
        <p className='text-2xl font-sans font-semibold flex flex-row items-center
        '><span className={`text-2xl text-green-700
        px-2 py-1
        rounded-full ${yourListing.offer ? 'line-through' : ''}`}>$ {yourListing.regularPrice}
        </span> {yourListing.type === 'rent' ?  <p>/month</p> : <></>}
        {
            yourListing.offer && (
              <div className='pl-6 flex flex-row'>
                <span className="pr-1 text-green-700 text-center"
                >${yourListing.discountedPrice} </span>
                <span>{yourListing.type === 'rent' ?  <p>/month</p> : <></>}</span>
              </div>
                 
                
            )
        }</p>
          </div>
        
        <p style={{fontFamily: 'Calibri'}} className='font-semibold pt-2 pb-1'>
          <i class="fa-solid fa-location-crosshairs text-green-500 text-sm pr-1 pb-2"
        ></i> {yourListing.address}</p>
        <div className={`px-3 py-2 w-[150px] text-white text-center mb-2 rounded-full
          ${yourListing.type === 'rent' ? 'bg-red-600' : 'bg-blue-700'}`}>
          For {yourListing.type === 'rent' ? 'Rent' : 'Sale'}
        </div>

        

        <p className='py-2'>
          <span className='font-bold'>Description:</span> {yourListing.description}
        </p>
  
        <div className="texts w-[70%] justify-between flex flex-row text-sm font-bold py-2">
          <span>{yourListing.bedrooms} beds</span>
          <span>{yourListing.bathrooms} baths</span>
          <span>{yourListing.bedrooms} Parking Spot</span>
          <span> <span className='text-red-500 underline'>{yourListing.furnished ? <></> : 'not'}</span> Furnished</span>
        </div>

        <div className="mt-5 mb-3">
            <p className='text-3xl'>Contact :</p>
            <div className=" flex flex-col">
            <span className='text-lg font-semibold text-blue-600' style={{fontFamily: 'Tahoma'}}>
              <span className='text-black'>Phone Number:</span> {yourListing.phoneNumber}</span>
            <span className='text-lg font-semibold text-green-600' style={{fontFamily: 'Tahoma'}}>
            <span className='text-black'>Whatsapp Number:</span> {yourListing.whatsAppNumber}</span>
            </div>
        </div>

        {yourListing.userRef === currentUser._id ? (
          <div className='flex flex-row items-center gap-5'>
          <Link to={`/edit-listing/${yourListing._id}`}>
                  <button className='bg-green-700 text-white px-3 rounded-full'>Edit</button>
                  </Link>
  
                  <button onClick={showDeleteMessage}
                  className='bg-red-700 text-white px-3 rounded-full'>Delete</button>
                  
              </div>
        ) : <></>}
        

            <div id='ques-div' 
            className="ques-div bg-gray-300 w-[500px] mx-auto p-7 border border-gray-400 rounded-md z-50
            absolute top-[40%] left-[35.2%]">

              <h1 className='text-xl'
              >Are you sure you want to delete this listing?</h1>
              <div className='ques-btns' id='ques-btns'>
              <button onClick={() => handleListingDelete(yourListing._id)}
              className='bg-gray-500 text-white px-2 border border-white'>YES</button>
              <button onClick={hideDeleteMessage}
               className='bg-gray-500 text-white px-2 border border-white'>NO</button>
              </div>
              
            </div>
            
        </div>
      </div>
    </div>
     )
     
     
     }
    </main>
  )
}

export default ListingPage
