import React, { useEffect, useState } from 'react'
import Listing from '../../../api/models/listing.model';
import { Link } from 'react-router-dom';

const Contact = ({yourListing}) => {
    const [landlord, setLandLord] = useState(null);
    const [message, setMessage] = useState(''); 
    console.log(yourListing);

    const onChange = (e) => {
        setMessage(e.target.value);
    }


    useEffect(() => {
        const fetchLandLord = async () => {
            try {
                const res = await fetch(`/api/user/${yourListing.userRef}`);
                const data = await res.json();
                setLandLord(data)
            } catch (error) {
                console.log(error);
            }
        }

        fetchLandLord();
    }, [yourListing.userRef])


  return (
    <>
    {landlord && (
        <div className='gap-5'>
            <p className='py-5'>Contact: <span className='font-semibold'>{landlord.username}</span> which has 
            <span className='font-semibold'>{yourListing.name}</span></p>

            <textarea name="message" id="message" rows='2'
            value={message} onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full p-3 mb-5'></textarea>

            <Link to={`mailto:${landlord.email}?subject=Regarding ${yourListing.name}&body=${message}`}
            className=' bg-slate-700 text-white text-center p-3'>
            Send Message
            </Link>
        </div>
    )}
    </>
  )
}

export default Contact
