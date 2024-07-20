import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../firebase';
import { current } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './CreateListing.css'

const CreateListing = () => {
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState({});
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    regularPrice: 50,
    discountedPrice: 0,
    bathrooms: 1,
    bedrooms: 1,
    furnished: false,
    parking: false,
    type: 'rent',
    offer: true,
    userRef: ''
  });
  const [imageUploadError, setImageUploadError] = useState(false)
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  console.log(formData);

  const handleImageSubmit = (e) => {
    setUploading(true);
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];

      for (let i=0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises).then((urls) => {
        setFormData({ ...formData , imageUrls: formData.imageUrls.concat(urls) });
        setImageUploadError(false);
        setUploading(false)
      }).catch((err) => {
        setImageUploadError('Image upload failed - 2mb max')
        setUploading(false)
      }); 
    } else {
      setImageUploadError('only upload 6 images for listing')
      setUploading(false)
    }
  };

  const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
          const storage = getStorage(app);
          const fileName = new Date().getTime() + file.name;
          const storageRef = ref(storage, fileName);
          const uploadTask = uploadBytesResumable(storageRef, file);
          
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      console.log(`Upload is ${progress}%`);
  },
      (error) => {
    reject(error);
  },
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => 
      resolve(downloadURL)
    )
  }
        )
      })
  }

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id
      })
    }

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData({
        ...formData,
        [e.target.id] : e.target.checked
      })
    }

    if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea' ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        return setError('you must enter at least one image!!');
      }

      if(+formData.regularPrice < +formData.discountedPrice) return setError('Discount price must be lower than regular')
      setLoading(true);
      setError(false);

      const res = await fetch('/api/listings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      console.log(data);
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        console.log(error);
        return
      }

      navigate(`/listings/${data._id}`)

    } catch (err) {
      setError(err.message);
      console.log(error)
      setLoading(false)
    }
  }

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };


  
  return (
    <main className='max-w-4xl mx-auto my-6'>
      <h1 className="text-center py-5 text-2xl tracking-wider font-semibold text-gray-700" 
      style={{fontFamily: 'Trebuchet MS'}}>Create Listing</h1>

      <form onSubmit={handleSubmit}
      className="flex flex-row py-5 mx-auto gap-x-3">

      <div className='create-inputs flex flex-col w-[480px] gap-4'>
        <input onChange={handleChange}
        value={formData.name}
        type="text" placeholder='Name'
          id='name' required/>

         <textarea onChange={handleChange}
         value={formData.description}
         placeholder='Description'
          id='description' required/>
         
         <input onChange={handleChange}
         value={formData.address}
         type="text" placeholder='Address'
          id='address' required/>
          
          <input onChange={handleChange}
         value={formData.phoneNumber}
         type="text" placeholder='Phone Number'
          id='phoneNumber' required/>
          
          <input onChange={handleChange}
         value={formData.whatsAppNumber}
         type="text" placeholder='WhatsApp Number'
          id='whatsAppNumber' required/>

          <div className="flex flex-row gap-2">
            <div className="flex gap-2">
              <input onChange={handleChange}
              checked={formData.type === 'sale'}
              type="checkbox" id='sale' className='w-5' />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input onChange={handleChange}
              checked={formData.type === 'rent'}
              type="checkbox" id='rent' className='w-5' />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input onChange={handleChange}
              checked={formData.parking}
              type="checkbox" id='parking' className='w-5' />
              <span>Parking Spot</span>
            </div>

            <div className="flex gap-2">
              <input onChange={handleChange}
              checked={formData.furnished}
              type="checkbox" id='furnished' className='w-5' />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input onChange={handleChange}
              checked={formData.offer}
              type="checkbox" id='offer' className='w-5' />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-row gap-4 flex-wrap ">
            <div className="flex items-center gap-2">
              <input onChange={handleChange}
              value={formData.bedrooms}
              type="number" id="bedrooms" min='1' max='10' required
              className='p-3' />
              <span>Beds</span>
            </div>

            <div className="flex items-center gap-2">
              <input onChange={handleChange}
              value={formData.bathrooms}
              type="number" id="bathrooms" min='1' max='10' required
              className='p-3' />
              <span>Baths</span>
            </div>

            <div className="flex flex-row items-center gap-2">
              <input onChange={handleChange}
              value={formData.regularPrice}
              type="number" id="regularPrice" min='50' max='10000' required
              className='p-3' />
              <div className="flex flex-col text-sm">
              <span className='font-bold'>Regular Price</span>
              <span>($ / month)</span>
              </div>
            </div>

            {formData.offer ? (
              <div className="flex items-center gap-2">
              <input onChange={handleChange}
              value={formData.discountedPrice}
              type="number" id="discountedPrice" min='0' max='10000' required
              className='p-3' />
              <div className="flex flex-col text-sm">
              <span className='font-bold'>Discounted Price</span>
              <span>($ / month)</span>
              </div>
            </div>
            ) : <></>}
            
          </div>
      </div>

      <div className='flex flex-col flex-1 gap-2'>
        <span className="ml-2 text-xs font-semibold">Images: max 6 images</span>
        

        <div className="flex gap-4">
          <input onChange={(e) => setFiles(e.target.files)}
          className='p-3 w-full border border-gray-700 rounded-md'
          type="file" id='images' accept='image/*' multiple />

          <button onClick={handleImageSubmit} type='button'
          className="p-3 text-white bg-green-600 hover:bg-green-700
          disabled:opacity-80 rounded-md" disabled={uploading}>
            {uploading ? 'Uploading...' : "Upload"}
          </button>
        </div>
        <p className='text-red-600'>{imageUploadError && imageUploadError}</p>

        {formData.imageUrls.length > 0 &&
        formData.imageUrls.map((url, index) => (
          <div key={url} className='flex justify-between py-0'>
            <img src={url} alt="listing-image"
            className='w-20 h-20 object-contain rounded-lg'/>
            <button type='button' onClick={() => {handleRemoveImage(index)}}
            >Delete</button>
          </div>
        ))
        }

        <button disabled={loading || uploading} 
        className="p-3 bg-slate-700 text-white rounded-md hover:bg-slate-600">
          {loading ? 'Creating...' : 'Create Listing'}
        </button>

        <p className='text-sm font-sans'>{error ? error : (<></>)}</p>
        
      </div>
      
      </form>
    </main>
  )
}

export default CreateListing
