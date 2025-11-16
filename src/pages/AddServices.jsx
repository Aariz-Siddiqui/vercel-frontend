import React, { useState } from 'react';
import { toast } from 'react-toastify';
const AddServices = () => {
    const [data,setData] = useState({
        service:"",
        description:"",
        price:"",
        provider:""
    })
    const handleInput = (e)=>{
        const name = e.target.name;
        const value = e.target.value;
        setData({
            ...data,
            [name]:value
    })
    }
const handleSubmit = async(e)=>{
    e.preventDefault();
    try{
        const response = await fetch("https://vercel-backend-eight-chi.vercel.app/api/admin/services/addservice",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        })
        const result = await response.json();
        if (response.ok) {
            console.log(result);
          toast.success("Document inserted successfully!");
        }
        else{
            toast.error(result.message)
        } 
    }catch(error){
            toast.error(error);
    }
}
    
  return (
    <div>
      <form>
        <input type="text" name='service' id='service' onChange={handleInput}/>
        <label for="service"> service </label><br/>
        
        <input type="text" name='description' id='description' onChange={handleInput}/>
        <label for="description"> description </label><br/>
        
        <input type="number" name='price' id='price' onChange={handleInput}/>
        <label for="price"> price </label><br/>
        
        <input type="text" name='provider' id='provider' onChange={handleInput}/>
        <label for="provider"> provider </label><br/>
        <button onClick={handleSubmit}> Submit </button>
      </form>

    </div>
  )
}

export default AddServices
