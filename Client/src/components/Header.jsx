import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

const Header = () => {
  const { currentUser } = useSelector(state => state.user)
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search])
  
  return (
    <header className='bg-slate-200 shadow-md'>
     <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
        <h1 className="text-2xl text-gray-900 hover:text-gray-700 transition" style={{fontFamily:'Rockwell'}
      }>Real Estate</h1>
        </Link>

      <form onSubmit={handleSubmit} className='bg-slate-100 flex items-center px-5 py-2 rounded-full'>
        
        <input type="text" placeholder='search...' className='bg-transparent focus:outline-0 text-md'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}/>

        <button>
        <FaSearch className='cursor-pointer'/>
        </button>
      </form>

      <ul className='flex gap-4'>

      {currentUser && (
            <Link to='/listing'>
            <button className='bg-green-600 text-white px-3 py-1 rounded-3xl font-semibold
             hover:bg-green-700'>Create Listing</button>
            </Link>
          )}
        
        <Link to='/profile'>
        {currentUser ? (
          <img src={currentUser.avatar} alt="profile"
          className='rounded-full h-7 w-7 object-cover' />
        ) : (
          <li>Sign In</li>
        )}
        </Link>
        
      </ul>
    </div>
    </header>
    
  )
}

export default Header
