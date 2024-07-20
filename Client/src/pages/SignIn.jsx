import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInSuccess, signInFailure, singInStart } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user )
  const [dataMessage, setDataMessage] = useState({})
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
    setDataMessage({});
    
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(singInStart());
    const res = await fetch('/api/auth/singin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    console.log(data);
    setDataMessage(data);
    if (data.success === false) {
      dispatch(signInFailure(data.message))
      return;
    }
    dispatch(signInSuccess(data))
    navigate('/')

    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }


  return (
    <div className='py-10'>
      <h1 className="text-center py-5 mb-2 text-2xl tracking-wider font-semibold text-gray-700" 
      style={{fontFamily: 'Trebuchet MS'}}>Sign In</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-[30%] mx-auto'>
        <input type="email" placeholder='email'
        className='border p-3 rounded-lg' id='email'
        onChange={handleChange} />

       <input type="password" placeholder='password'
        className='border p-3 rounded-lg' id='password'
        onChange={handleChange} />

        <button disabled={loading}
        className="text-white bg-red-600 p-3 rounded-lg">
          {loading ? "Signing In...." : "Sign In"}
          </button>

          <OAuth/>

          <p>{dataMessage.message === 'wrong credintials' ? 'x your password is wrong' : ''}</p>
      </form>

      <div className="text-center flex flex-row items-center justify-center" style={{fontFamily: 'Candara'}}>
        <p>Dont have account ?</p>
        <Link to={"/sign-up"}>
        <span className='text-blue-600 font-semibold pl-1'
        style={{fontFamily: 'Candara'}}>Sign up</span>
        </Link>
      </div>
    </div>
  )
}

export default SignIn
