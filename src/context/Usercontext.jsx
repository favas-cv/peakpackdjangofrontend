import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

export const Usercontext = createContext();

function Userprovider({ children }) {
  const [user, setuser] = useState(null);
  const [loading,setloading] = useState(true)

  useEffect(() => {

    const fetchUser = async ()=>{
      const token =localStorage.getItem('access_token');
      if (!token){
        setuser(null)
        setloading(false)
        return
      }

      try {
        const res = await axiosInstance.get('accounts/profile/')
        setuser(res.data)
        // localStorage.setItem("user",JSON.stringify(res.data));
        
      } catch (error) {
        setuser(null)

  //       console.log("auth failed ",error);
  //       setuser(null);
  //       localStorage.removeItem('user');
  //       localStorage.removeItem('access_token');

        
        
      }finally{
        setloading(false)
      }
    };
    fetchUser();
  },[]);



//if anyhppend uncommnet this 
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     setuser(JSON.parse(storedUser));
  //   }
  // }, []);
 
  // useEffect(() => {
  //   if (user) {
  //     localStorage.setItem("user", JSON.stringify(user));
  //   } else {
  //     localStorage.removeItem("user");
  //   }
  // }, [user]);

  return (
    <Usercontext.Provider value={{ user, setuser,loading }}>
      {children}
    </Usercontext.Provider>
  );
}

export default Userprovider;
