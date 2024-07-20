import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
import YourListing from './pages/YourListing'
import EditListing from './pages/UpdateListing'
import ListingPage from './pages/ListingPage'
import Search from './pages/Search'
import UsersPanel from './pages/UsersPanel'
import UserListings from './pages/UserListings'
const App = () => {
  return <BrowserRouter>
  <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignIn/>} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/about" element={<About />} />
      <Route path="/search" element={<Search />} />
      <Route path="/listings/:listingId" element={<ListingPage />} />
      <Route element={<PrivateRoute />}>
         <Route path="/users-panel" element={<UsersPanel />} />
         <Route path="/user-listings/:id" element={<UserListings />} />
         <Route path="/profile" element={<Profile />} />
         <Route path="/listing" element={<CreateListing />} />
         <Route path="/your-listings" element={<YourListing />} />
         <Route path="/edit-listing/:listingId" element={<EditListing />} />
      </Route>
    </Routes>
    </BrowserRouter>
}

export default App
