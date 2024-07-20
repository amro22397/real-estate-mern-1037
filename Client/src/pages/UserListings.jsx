import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom';



const YourListing = () => {
    const { currentUser } = useSelector((state) => state.user);
const [showListingError, setShowListingError] = useState(false);
const [yourListing, setYourListing] = useState([]);
const [user, setUser] = useState({});
const [yourList, setYourList] = useState({});
const params = useParams();
console.log(params.id);


    const handleShowListing = async () => {
        try {
            setShowListingError(false);
            const res = await fetch(`/api/user/listings-by-admins/${params.id}`);
            const data = await res.json();
            console.log(data);

            if (data.success === false) {
                setShowListingError(true);
                console.log(showListingError)
                return;
            }
            setYourListing(data);
            
        } catch (error) {
            setShowListingError(true)
            console.log(showListingError)
        }
    };


    const handleUser = async () => {
        try {
            const res = await fetch(`/api/user/${params.id}`);
            const data = await res.json();
            console.log(data);
            setUser(data)

            if (data.success === false) {
                console.log(data.message)
                return;
            }
            
        } catch (error) {
            console.log(error.message)
        }
    };



    useEffect(() => {
        handleShowListing();
        handleUser();
    },[])

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
    <div>
        <div className='flex flex-col gap-3'>
        <h1 className='text-center text-3xl pt-10 font-sans'>User Listing</h1>
        </div>
      
      <div className="py-9 flex flex-col ">
        <div className="flex flex-row justify-center items-center gap-36 pb-5">
        <span className='text-center font-semibold'>username: <span className=' font-light
        '>{user.username}</span></span>
        <span className='text-center font-semibold'>email: <span className=' font-light
        '>{user.email}</span></span>
        </div>
      
      {yourListing && yourListing.length > 0 &&
        yourListing.map((list, index) => (
            <div key={list._id}
            className='mx-auto w-[50%] flex justify-between gap-10 py-2'>
                <Link to={`/listings/${list._id}`}>
                <div className='flex flex-row items-center gap-2'>
                <img src={list.imageUrls[0]} className='w-12' />
                <p>{list.name}</p>
                </div>
                </Link>
            
            <div className='flex flex-col'>
                <button onClick={() => handleListingDelete(list._id)}
                className='text-red-600'>Delete</button>
                <Link to={`/edit-listing/${list._id}`}>
                <button className='text-green-600'>Edit</button>
                </Link>
            </div>

            
          </div>

          
        ) 
            
        )}

      </div>
        
      
    </div>
  )
}

export default YourListing
