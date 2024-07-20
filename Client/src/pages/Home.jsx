import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

const Home = () => {
  const { currentUser } = useSelector(state => state.user)
  
  const [listing, setListing] = useState([]);
  const [offerListing, setOfferListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);

  SwiperCore.use( [Navigation])

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch('/api/listings/get?&limit=6');
        const data = await res.json();
        setListing(data);
        fetchOfferListing();
      } catch (error) {
          console.log(error);
      }
    }
    fetchListing();
    const fetchOfferListing = async () => {
      try {
        const res = await fetch('/api/listings/get?offer=true&limit=3');
        const data = await res.json();
        setOfferListing(data);
        fetchRentListing(); 
      } catch (error) {
          console.log(error);
      }
    }

    const fetchRentListing = async () => {
      try {
        const res = await fetch('/api/listings/get?type=rent&limit=3');
        const data = await res.json();
        setRentListing(data); 
        fetchSaleListing();
      } catch (error) {
          console.log(error);
      }
    }

    const fetchSaleListing = async () => {
      try {
        const res = await fetch('/api/listings/get?type=sale&limit=3');
        const data = await res.json();
        setSaleListing(data);
      } catch (error) {
          console.log(error);
      }
    }
    fetchListing();
  }, [])

  return (
    <div>
      <div className="flex flex-col gap-2 pt-14 pb-7 px-40 ">
      
        <h1 className="text-3xl text-slate-700  tracking-widest" style={{fontFamily: 'arial'}}>
          Find your next 
          <span className='text-black'> perfect</span>
          <br/>
          place with our website
          </h1>

          <div className="text-sm">
            Shahand state is the best place to find your next perfect place to live
            <br />
            We have a wide range of properties for you to choose from.
          </div>

          <Link to='/search' className='text-lg font-semibold font-sans text-blue-500 hover:text-blue-600
          hover:underline'>
          <span className=''>Find houses...</span>
          </Link> 

      </div>

<div className='w-[80%] mx-auto'>
<Swiper navigation className=''>
         {
          listing && listing.length > 0 &&
          listing.map(list => (
            <SwiperSlide>
              <div style={{background: `url(${list.imageUrls[0]}) center no-repeat`, backgroundSize:'cover'}}
              className='h-[500px]' key={list._id}></div>
            </SwiperSlide> 
          ))
        }
      </Swiper>
</div>
      

      {
        offerListing && offerListing.length > 0 && (
          <div className='py-10 px-0'>
            <div className="pb-3 px-14">
              <h2 className='text-3xl font-sans' style={{fontFamily: 'Trebuchet MS'}}>Recent offers</h2>
              <Link to={'/search?offer=true'} className='text-lg text-blue-700 hover:underline '>
              <p className='mt-1 mx-0 text-2 font-semibold'>Show more offer</p>
              </Link>
            </div>

            <div className="flex flex-wrap my-3">
              {offerListing.map(listing => (
                <ListingItem listing={listing} key={listing._id} />
              ))
            }
            </div>
          </div>
        )
      }


      {
        rentListing && rentListing.length > 0 && (
          <div className='py-10'>
            <div className="pb-3 px-14">
              <h2 className='text-3xl font-sans' style={{fontFamily: 'Trebuchet MS'}}>Recent places for Rent</h2>
              <Link to={'/search?type=rent'} className='text-lg text-blue-700 hover:underline '>
              <p className='mt-1 mx-0 text-2 font-semibold'>Show more ..</p>
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {rentListing.map(listing => (
                <ListingItem listing={listing} key={listing._id} />
              ))
            }
            </div>
          </div>
        )
}


{
        saleListing && saleListing.length > 0 && (
          <div className='py-10'>
            <div className="pb-3 px-14">
              <h2 className='text-3xl font-sans' style={{fontFamily: 'Trebuchet MS'}}>Recent places for Sale</h2>
              <Link to={'/search?type=sale'} className='text-lg text-blue-700 hover:underline '>
              <p className='mt-1 mx-0 text-2 font-semibold'>Show more ..</p>
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {saleListing.map(listing => (
                <ListingItem listing={listing} key={listing._id} />
              ))
            }
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Home
