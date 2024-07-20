import React, { useEffect, useState } from 'react'
import './UsersPanel.css'
import { Link } from 'react-router-dom';

const UsersPanel = () => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState(false);

    const fetchListing = async () => {
        try {
          setLoading(true);
        setError(false);
        
        const res = await fetch('/api/user');
  
        const data = await res.json();
        setLoading(false);

        console.log(data);
        setUsers(data);
        console.log(users);

        if (data.success === false) {
          setLoading(false)
          setError(data.message);
          console.log(data.message);
          return
        }
  
      } catch (error) {
          setLoading(false);
           setError(error.message);
          console.log(error.message); 
        }
      
      }

    useEffect(() => {
        fetchListing();
      },[])


  return (
    <div className='py-10'>
      <h1 className="text-center py-5 mb-2 text-2xl tracking-wider font-semibold text-gray-700" 
      style={{fontFamily: 'Trebuchet MS'}}>Users</h1>


<table className='users-table mx-auto'>
            <thead>
                <tr>
                    <td>User Id</td>
                    <th>User name</th>
                    <th>Email</th>
                    <th>Created At</th>
                    <th>User Listings</th>
                </tr>
            </thead>
            <tbody>
            
            { users && users.length &&
            users.map(user => (
                <tr>
                    <th>{user._id}</th>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.createdAt}</td>
                    
                    <td className='text-green-500'><Link to={`/user-listings/${user._id}`}
                    >Show</Link></td>
                </tr>
            ))}
            </tbody>
            
        </table> 
      
        

    </div>
  )
}

export default UsersPanel
