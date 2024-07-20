import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserFailure, updateUserSuccess, 
        deleteUserFailure, deleteUserStart, deleteUserSuccess,
       logoutUserStart, logoutUserSuccess, logoutUserFailure } from '../redux/user/userSlice.js'
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const dispatch = useDispatch();
  /* allow read;
  allow write: if
  request.resource.size < 2 * 1024 * 1024 &&
  request.resource.contentType.matches('image/.*') */

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePerc(Math.round(progress))
    },

    (error) => {
      setFileUploadError(true);
    },

    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => 
        setFormData({ ...formData, avatar: downloadURL })
      )
    }

    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData, 
      [e.target.id]: e.target.value
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));

    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(logoutUserStart());
      const res = await fetch('api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(logoutUserFailure(data.message))
        return;
      }
      dispatch(logoutUserSuccess());
    } catch (error) {
      dispatch(logoutUserFailure(error.message))
    }
  }

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
    <div className="p-3 mx-auto my-6">
      <h1 className="text-center py-5 text-2xl tracking-wider font-semibold text-gray-700" 
      style={{fontFamily: 'Trebuchet MS'}}>Profile</h1>

      <form onSubmit={handleSubmit}
      className='flex flex-col gap-4 w-[30%] mx-auto'>
        
        <input type="file" ref={fileRef} hidden accept='image/*'
        onChange={(e) => setFile(e.target.files[0])} />

        <img onClick={() => fileRef.current.click()} 
        src={formData.avatar || currentUser.avatar} 
        alt="profile" className='rounded-full h-24 w-24 object-cover
        cursor-pointer self-center mt-2' />

        {currentUser.isAdmin ? (
          <span className='bg-red-800 w-[90px] text-center py-1 text-white mx-auto
          rounded-full'>Admin</span>
        ) 
        : <span className='bg-green-800 w-[90px] text-center py-1 text-white mx-auto
        rounded-full'>Member</span>}

        <p> {fileUploadError ? 
        ( <span className='text-red-500'>Error Image Upload</span> ) :
        filePerc > 0 && filePerc < 100  ? (
          <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>)
        :
        filePerc === 100 ? (
          <span className='text-green-700'>image changed successfully</span>)
          : (
            <></>
          )}
      </p>

        <input type="name" placeholder='username'
        className='p-3 border rounded-lg' id='username' 
        defaultValue={currentUser.username} onChange={handleChange}/>
        <input type="email" placeholder='email'
        className='p-3 border rounded-lg' id='email'
        defaultValue={currentUser.email}  onChange={handleChange} />
        <input type="password" placeholder='password'
        className='p-3 border rounded-lg' id='password'
        onChange={handleChange}  />

        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg
        hover:bg-slate-800 disabled:opacity-80'>
          {loading ? "Updating...." : "Update"}
        </button>

        <p id="update-text" className={`text-green-500 text-center ${updateSuccess ? "" : "hidden" }`}>
          updated successfully
        </p>
      </form>

      {currentUser.isAdmin ? (
        <div className="admin-settings flex flex-row mt-5 justify-start w-[50%] mx-auto">
        <Link to='/users-panel'>
          <span className="text-black cursor-pointer hover:text-green-900"
          >Show Users</span>
          </Link>
  
        </div>
      ) : (
        <></>
      )}

      

      <div className='flex flex-row mt-4 justify-between w-[50%] mx-auto'>

        <Link to='/your-listings'>
        <span className="text-green-700 cursor-pointer hover:text-green-900"
        >Show your listing</span>
        </Link>
       
       <div className='flex flex-row gap-4'>
       <span className="text-red-700 cursor-pointer hover:underline"
        onClick={showDeleteMessage}>Delete account</span>

        <span className="text-red-700 cursor-pointer hover:underline"
        onClick={handleSignOut}>Signout</span>
       </div>
        

      </div>

      <div id='ques-div' 
            className="ques-div bg-gray-300 w-[500px] mx-auto p-7 border border-gray-400 rounded-md z-50
            absolute top-[40%] left-[35.2%]">

              <h1 className='text-xl'
              >Are you sure you want to delete your account?</h1>
              <div className='ques-btns' id='ques-btns'>
              <button onClick={handleDeleteUser}
              className='bg-gray-500 text-white px-2 border border-white'>YES</button>
              <button onClick={hideDeleteMessage}
               className='bg-gray-500 text-white px-2 border border-white'>NO</button>
              </div>
              
            </div> 


      <p className='text-red-600 text-center'>{error ? error : ""}</p>
    </div>
  )
}

export default Profile
