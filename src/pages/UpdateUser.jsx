import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { data, useParams } from 'react-router-dom'
import { useAuth } from '../store/auth';
import { useState } from 'react';
import { toast } from "react-toastify";
const UpdateUser = () => {
  const [data,setData] = useState({
    name:"",
    email:"",
    phone:""
  })
  
  const params = useParams(); //to get user id from params
  const {authBearerToken} = useAuth();
  const singleUserData = async ()=>{
      try{
        const response = await fetch(`http://localhost:8000/api/admin/users/${params.id}`,{
          method:'GET',
          headers:{
            Authorization:authBearerToken
          }
        })
        console.log(params)
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        console.log(response);
        const data = await response.json();
        setData(data);
      }catch(error){
        console.log(`Error from Update user ${error}`);
      }
  }
  const navigate = useNavigate();
  useEffect(()=>{singleUserData()},[])
  const handleInput=(e)=>{
    const name = e.target.name;
    const value = e.target.value;
    setData({
      ...data,
      [name]:value
    }
    )
  }

  const updateUserData = async(e) =>{
    try{
      e.preventDefault();
      const response = await fetch(`http://localhost:8000/api/admin/users/update/${params.id}`,{
        method:"PATCH",
        headers:{
          "Content-Type":"application/json",
          Authorization:authBearerToken
        },
        body:JSON.stringify(data)
      })
      if(response.ok){
        console.log(data.name);
        toast.success("Data updated successfully");
        navigate("/admin/users")
      }

    }catch(error){
      console.log("error from updateUserData"+ error)
    }
  }
  return (
    <section className="section-contact">
      <div className="contact-content container">
        <h1 className="main-heading">Update User Data</h1>
      </div>
      {/* contact page main  */}
      <div className="container grid grid-two-cols">
        {/* contact form content actual  */}
        <section className="section-form">
          <form onSubmit={updateUserData}>
            <div>
              <label htmlFor="username">username</label>
              <input
                type="text"
                name="name"
                id="name"
                autoComplete="off"
                value={data.name}
                onChange={handleInput}
                required
              />
            </div>

            <div>
              <label htmlFor="email">email</label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="off"
                value={data.email}
                onChange={handleInput}
                required
              />
            </div>

            <div>
              <label htmlFor="phone">Mobile</label>
              <input
                type="phone"
                name="phone"
                id="phone"
                autoComplete="off"
                value={data.phone}
                onChange={handleInput}
                required
              />
            </div>

            <div>
              <button type="submit">Update</button>
            </div>
          </form>
        </section>
      </div>
    </section>
  )
}

export default UpdateUser
