import './App.css';
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Loginpage from './pages/Loginpage';
import Registerpage from './pages/Registerpage';
import { ToastContainer } from 'react-toastify';
import Navbar from './Entrance/Navbar';
import Hero from './Entrance/Herosection';
import Productspage from './pages/productspage';
import Bagpage from './pages/Bagpage';
import Footer from './Entrance/Footer';
import Favoritespage from './pages/Favoritespage';
import { Favoritesprovider } from './context/Favoritescontext';
import About from './pages/Aboutpage';
import Profile from './pages/Profilepage';
import Checkoutpage from './pages/Checkoutpage';
import Orderconfirmationpage from './pages/Orderconfirmationpage';
import Productdetailpage from './pages/Productdetailpage';
import Orderdetailpage from './pages/orderdetailpage';
import Admindashboard from './admin/pages/Admindashboard';
import Productslayout from './admin/pages/layouts/productslayout';
import Userslayout from './admin/pages/layouts/Userslayout';
import Orderslayout from './admin/pages/layouts/Orderslayout';
import Layout from './admin/pages/layouts/Layout';
import Forgotpassword from './components/Forgotpassword';
import AdminRoute from './components/AdminRoute';
import UserRoute from './components/UserRoute';
import NotFound from './components/NotFound';
import SplashScreen from './Entrance/SplashScreen';
import Resetpassword from './components/Resetpasswordpage';

// 👇 import Framer Motion for fade animation
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

function App() {
  const location = useLocation();
  const isadmin = location.pathname.startsWith("/admin");

  // 👇 Splash screen state
  const [loading, setLoading] = useState(()=>{
    const SeenSplash = sessionStorage.getItem("peakpacksplash");
    return SeenSplash ? false :true;

  });

//this for only splach on one user start , if seconf=d time refrsh or on another refresh it didnt show 

  useEffect(() => {

    if (loading){
      const timer = setTimeout(() =>{
        sessionStorage.setItem("peakpacksplash","true");
        setLoading(false)

      },2500);

      return ()=> clearTimeout(timer);
       

    }

  }, []);

  return (
    <>
      <Favoritesprovider>
        {/* 👇 AnimatePresence ensures smooth fade-out of splash */}
        <AnimatePresence>
          {loading ? (
            <motion.div
              key="splash"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <SplashScreen />
            </motion.div>
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {!isadmin && <Navbar />}

              <ToastContainer position='top-center' autoClose={1000} />

              <Routes>
                {/* Global routes */}
                <Route path='/' element={<Hero />} />
                <Route path='/shop' element={<Productspage />} />
                <Route path='/shop/:id' element={<Productdetailpage />} />
                <Route path='/Registerpage' element={<Registerpage />} />
                <Route path='/Loginpage' element={<Loginpage />} />
                <Route path='/about' element={<About />} />
                <Route path='/forgotpassword' element={<Forgotpassword />} />
                <Route path='/resetpassword' element={<Resetpassword/>} />

                {/* User-only routes */}
                <Route path='/bag' element={<UserRoute><Bagpage /></UserRoute>} />
                <Route path='/favorites' element={<UserRoute><Favoritespage /></UserRoute>} />
                <Route path='/profile' element={<UserRoute><Profile /></UserRoute>} />
                <Route path='/checkout' element={<UserRoute><Checkoutpage /></UserRoute>} />
                <Route path='/orderdetailpage' element={<UserRoute><Orderdetailpage /></UserRoute>} />
                <Route path='/orderconfirmation' element={<UserRoute><Orderconfirmationpage /></UserRoute>} />

                {/* Admin-only routes */}
                <Route path="/admin" element={<AdminRoute><Layout /></AdminRoute>}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<Admindashboard />} />
                  <Route path="products" element={<Productslayout />} />
                  <Route path="users" element={<Userslayout />} />
                  <Route path="orders" element={<Orderslayout />} />
                </Route>

                {/* Fallback route */}
                <Route path="*" element={<NotFound />} />
              </Routes>

              {!isadmin && <Footer />}
            </motion.div>
          )}
        </AnimatePresence>
      </Favoritesprovider>
    </>
  );
}

export default App;
