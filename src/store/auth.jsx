import {React,useEffect,useState} from "react";
import { createContext,useContext } from "react";
export const authContext = createContext();
export const AuthProvider = ({children}) =>{
    const [token,setToken] = useState(localStorage.getItem("token"));
    const [userData,setUserData] = useState();
    const [cardData, setCardData] = useState([]);
    const [isLoading,setLoading] = useState(true);
    const [admin,setAdmin] = useState();
    const authBearerToken = `Bearer ${token}`;
    const setTokenInLs = (token)=>{
            setToken(token);
            localStorage.setItem("token",token)
     }
     const isLoggedIn = !!token;
    let LogoutUser = (token)=>{
        setToken(""); //removing the token from the state
        setAdmin(false);
        localStorage.removeItem("token"); //removing the token from the local storage
    }

    const authentication = async() =>{
        try{
            const response = await fetch("https://vercel-backend-eight-chi.vercel.app/api/auth/user",{ //calling user controller which is returning user data after validating the token stored 
            // in ls and then reriving the payload which contains user email and using findOne() method of mongooose to retrive data associated with that email.
                method:"GET",
                headers: {
                    Authorization: authBearerToken,
                },
            }
            )
            if(response.ok){
                let Data = await response.json();
                setUserData(Data);
                setLoading(false);
                console.log("isAdmin is",Data.isAdmin)
                setAdmin(Data.isAdmin);
            }
        }catch(error){
            console.log("error from the authentication function at auth.jsx" + error)
        }


    }


//to fetch the card details on the services page
    
    const getServices = async ()=>{
        try{
            const response = await fetch("https://vercel-backend-eight-chi.vercel.app/service", {
                method:"GET"
            })
            if(response.ok){
                const data = await response.json();
                console.log(data);
                setCardData(data);
                
            }
        }catch(error){
            console.log("error from the card/auth.jsx" + error);
        }
 
    }

    useEffect(()=>{
        getServices();
        authentication();
    },[token]);

    return(
    <authContext.Provider value={{cardData,userData,isLoggedIn,setTokenInLs,LogoutUser,authBearerToken,token,isLoading,admin}}>
        {children}
    </authContext.Provider>
    )
}
export const useAuth = ()=>{
    return useContext(authContext);
}