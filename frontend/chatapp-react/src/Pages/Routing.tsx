import {Routes, Route} from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import NotFound from './NotFound';
import ResetPassword from './resetPassword';
import Profile from './Profile/Profile';
import ProtectedRoutes from '../utils/ProtectedRoutes';
import PublicRoutes from '../utils/PublicRoutes'
function Routing() {
  return (
    <Routes>

      <Route path='/' element={<Home />} />
  <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/reset-password/:token' element={<ResetPassword />} />
   
   
   <Route element={<PublicRoutes />}>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
</Route>

<Route element={<ProtectedRoutes />}>
    <Route path="/profile" element={<Profile />} />
  </Route>
        <Route path='*' element={<NotFound />} /> 
    </Routes>   




  )
}

export default Routing