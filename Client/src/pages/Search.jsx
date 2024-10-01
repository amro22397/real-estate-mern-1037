import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

const Search = () => {
    const navigate = useNavigate();
    const [sidebaradata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc'
    });

    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState([]);
    const [showMore, setShowMore] = useState(false); 

    console.log(listing);
    const [searchURL, setSearchURL] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const typeFromUrl = urlParams.get('type');
    const searchTermFromUrl = urlParams.get('searchTerm');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if(
        searchTermFromUrl ||
        typeFromUrl ||
        parkingFromUrl ||
        furnishedFromUrl ||
        offerFromUrl ||
        sortFromUrl || 
        orderFromUrl 
    ) {
        setSidebardata({
            searchTerm: searchTermFromUrl || '',
            type: typeFromUrl || 'all',
            parking: parkingFromUrl === 'true' ? true : false,
            furnished: furnishedFromUrl === 'true' ? true : false,
            offer: offerFromUrl === 'true' ? true : false,
            sort: sortFromUrl || 'created_at',
            order: orderFromUrl || 'desc' 
        })
    }
    
    const fetchListing = async () => {
        setLoading(true);
        setShowMore(false)
        const res = await fetch(`/api/listings/get?${searchURL}`)
        const data = await res.json();

        if (data.length > 8) {
            setShowMore(true);
        } else {
            setShowMore(false)
        }
        setListing(data);
        setLoading(false);

        if(data.success === 'false') {
            console.log(data.message)
        }
    }

    fetchListing();

    }, [location.search]);

    console.log(sidebaradata);

    const handleChange = (e) => {
        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSidebardata({
                ...sidebaradata,
                type: e.target.id,
            })
        }

        if (e.target.id === 'searchTerm') {
            setSidebardata({
                ...sidebaradata,
                searchTerm: e.target.value,
            })
        }

        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSidebardata({
                ...sidebaradata,
                [e.target.id]: e.target.checked || e.target.checked === 'true' ?
                true : false,
            })
        }

        if (e.target.id === 'sort_order') {

            const sort = e.target.value.split('_')[0] || 'created_at';

            const order = e.target.value.split('_')[1] || 'desc';

            setSidebardata({
                ...sidebaradata,
                sort, order
            });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebaradata.searchTerm)
        urlParams.set('type', sidebaradata.type)
        urlParams.set('parking', sidebaradata.parking)
        urlParams.set('furnished', sidebaradata.furnished)
        urlParams.set('offer', sidebaradata.offer)
        urlParams.set('sort', sidebaradata.sort)
        urlParams.set('order', sidebaradata.order)
        const searchQuery = urlParams.toString();
        setSearchURL(searchQuery);
        navigate(`/search?${searchQuery}`)
    };

    const onShowMoreClick = async () => {
       const numberOfListing = listing.length;
       const startIndex = numberOfListing;
       const urlParams = new URLSearchParams(location.search);
       urlParams.set('startIndex', startIndex);
       const searchQuery = urlParams.toString();
       console.log(searchQuery)
       const res = await fetch(`/api/listings/get?${searchQuery}`);
       const data = await res.json();
       if(data.length < 9) {
        setShowMore(false) 
       }
 
       setListing([...listing, ...data]);

       
    }

  return (
    <div className="flex flex-col py-14 gap-5">
        <div className="w-full">
            <form onSubmit={handleSubmit}
            className='flex flex-col gap-8 items-center'>
                <div className="flex flex-row items-center gap-2 w-[50%]">

                    <label className="whitespace-nowrap font-semibold">Search Term:</label>

                    <input type="text" id='searchTerm'
                    placeholder='Search...' className='w-[100%] px-3 py-2 rounded-full'
                    value={sidebaradata.searchTerm} 
                    onChange={handleChange} />

                    
                </div>
            <div className='flex flex-row gap-10'>
            <div className="flex gap-2 flex-wrap items-center">
                    <label className='font-semibold'>Type:</label>
                    <div className="flex gap-2">
                        <input type="checkbox" id='all' className='w-5'
                        checked={sidebaradata.type === 'all'} 
                        onChange={handleChange} />
                        <span>Rent & Sale</span>
                    </div>

                    <div className="flex gap-2">
                        <input type="checkbox" id='rent'
                        className='w-5'
                        checked={sidebaradata.type === 'rent'} 
                    onChange={handleChange} />
                        <span>Rent</span>
                    </div>

                    <div className="flex gap-2">
                        <input type="checkbox" id='sale'
                        className='w-5'
                        checked={sidebaradata.type === 'sale'} 
                    onChange={handleChange} />
                        <span>Sale</span>
                    </div>

                    <div className="flex gap-2">
                        <input type="checkbox" id='offer'
                        className='w-5'
                        checked={sidebaradata.offer} 
                        onChange={handleChange} />
                        <span>Offer</span>
                    </div>
                </div>

                <div className="flex gap-2 flex-wrap items-center">
                    <label className='font-semibold'>Amenities:</label>
                    <div className="flex gap-2">
                        <input type="checkbox" id='parking'
                        className='w-5'
                        checked={sidebaradata.parking} 
                    onChange={handleChange} />
                        <span>Parking</span>
                    </div>

                    <div className="flex gap-2">
                        <input type="checkbox" id='furnished'
                        className='w-5'
                        checked={sidebaradata.furnished} 
                    onChange={handleChange} />
                        <span>Furnished</span>
                    </div>
                </div>
            </div>

                <div className="flex flex-row items-center w-[50%] gap-5 justify-center">
                    <label className='font-semibold'>Sort: </label>
                    <select id="sort_order" className='px-2 py-2 rounded-xl'
                    defaultValue={'created_at_desc'} 
                    onChange={handleChange}>
                        <option value='regularPrice_desc'>Price high to low</option>
                        <option value='regularPrice_asc'>Price low to high</option>
                        <option value='createdAt_desc'>Latest</option>
                        <option value='createdAt_asc'>Oldest</option>
                    </select>
                    <button className='bg-slate-800 text-white px-3 py-2 w-[15%]
                rounded-3xl hover:bg-slate-700'>Search</button>
                </div>
                
            </form>
        </div>
        <div className="w-full gap-2 items-center px-2 py-8 mx-auto">
            <div className="flex flex-wrap my-8">
            {!loading && listing.length === 0 && (
                    <p className=''>No Listing Found</p>
                )}

                {loading && (
                  <p className=''>Loading...</p>  
                )}

                {!loading && listing.map(listing => 
                    (
                        
                        <ListingItem key={listing._id} listing={listing}
                        className='' />
                        
                    )
                )}

               
            </div>
            {showMore && (
                <div className='flex justify-center items-center'>
                    <button onClick={onShowMoreClick}
                    className='text-green-600 p-7'>
                        Show more
                    </button>
                </div>
                )}
        </div>
    </div>
  )
}

export default Search
