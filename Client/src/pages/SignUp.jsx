import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';
const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
    
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    console.log(data);
    if (data.success === false) {
      setError(data.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    setError(null);
    navigate('/sign-in')

    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }


  return (
    <div className='py-10'>
      <h1 className="text-center py-5 mb-2 text-2xl tracking-wider font-semibold text-gray-700" 
      style={{fontFamily: 'Trebuchet MS'}}>Sign Up</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-[30%] mx-auto'>
        
        <input type="name" placeholder='username'
        className='border p-3 rounded-lg' id='username'
        onChange={handleChange} />
        
        <input type="email" placeholder='email'
        className='border p-3 rounded-lg' id='email'
        onChange={handleChange} />

       <input type="password" placeholder='password'
        className='border p-3 rounded-lg' id='password'
        onChange={handleChange} />

        <button disabled={loading}
        className="text-white bg-red-600 p-3 rounded-lg">
          {loading ? "Signing Up...." : "Sign Up"}
          </button>

          <OAuth/>

          <div className="text-center flex flex-row items-center justify-center" style={{fontFamily: 'Candara'}}>
        <p>Already have account?</p>
        <Link to={"/sign-in"}  >
        <span className='text-blue-600 font-semibold pl-1'
        style={{fontFamily: 'Candara'}}>Sign in</span>
        </Link>
      </div>
      
      </form>

      
    </div>
  )
}

export default SignUp
