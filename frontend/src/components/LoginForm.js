import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

function LoginForm() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [ invalid, setInvalid] = useState(false);

    async function handleSubmit(event) {

        event.preventDefault();

        console.log("LOG")

        try {

            const response = await fetch('https://chat-app-p7p1.onrender.com/user/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            console.log("HIIIII", response);

            const json = await response.json();

            if (response.ok && json.currentUser !== null) {
                setInvalid(false);
                // Authentication successful, handle accordingly
                console.log('Authentication Successful!');
                
                const navigateToHome = () => {
                    navigate('/');
                }

                navigateToHome();

            } else {
                // Authentication failed, handle accordingly
                console.log('Authentication failed');
                setInvalid(true);
            }
        } catch (error) {
            console.log('Error during authentication:', error);
        }
    }

    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    return (
        <div className='w-full h-[100vh] bg-[#111b21] flex justify-center items-center'>
            <div className='w-[45%] h-[75%] bg-[#202c33] flex flex-col items-center font-sans rounded-xl'>
                <div className='py-3 text-[#e9edef] text-3xl tracking-wider font-medium mt-4'>
                    <h1 className=''>Welcome back!</h1>
                </div>
                <div className='h-full w-96 mt-10'>
                    <form method="POST" onSubmit={handleSubmit} className='flex flex-col space-y-10'>

                        <input name="username" type="text" placeholder="Username" onChange={handleInputChange} className="px-4 py-3 bg-[#2a3942] border border-[#2a3942] rounded-lg w-full focus:ring-0 focus:outline-none focus:border-[#2a3942] placeholder-[#8696a0] caret-[#8696a0] text-[#d1d7db]" />
                        <div>
                            <input name="password" type="password" placeholder="Password" onChange={handleInputChange} className="px-4 py-3 bg-[#2a3942] border border-[#2a3942] rounded-lg w-full focus:ring-0 focus:outline-none focus:border-[#2a3942] placeholder-[#8696a0] caret-[#8696a0] text-[#d1d7db]" />  
                            { invalid &&<p className='w-96 text-center text-sm absolute mt-1 text-red-vivid-500 font-normal tracking-wide'> Invalid Username or Password </p> }
                        </div>                        
                        <button type="submit" className='bg-[#00a884] rounded-full px-3 py-3 w-44 place-self-center text-base text-[#111b21] font-medium tracking-wide'>Login In</button>

                    </form>

                    <div className='w-full mt-[5.5rem] flex justify-center'>
                        <p className='text-[#d1d7db] text-base font-medium tracking-wide'>Need an account? <Link to='/register' className='text-[#00a884] underline decoration-solid underline-offset-4'>Register</Link> </p>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default LoginForm;




// import { Link } from "react-router-dom"

// const LoginForm = () => {
//     async function handleSubmit(e) {
//         // Prevent the browser from reloading the page
//         e.preventDefault();
    
//         // Read the form data
//         const form = e.target;
//         console.log(e.target);
//         const formData = new FormData(form);
        
//         const formJson = Object.fromEntries(formData.entries());
//         console.log("OOO", formJson);
  
//         // You can pass formData as a fetch body directly:
//         try{
//             const response = await fetch('/user/register', { method: form.method, mode: 'cors',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: formJson });
//                 console.log("OOO", formData);

//             if (response.redirected) {
//                 // Manual redirect detected, check the location header for the redirect URL
//                 console.log('Manual redirect URL:', response.url);
//                 //window.location.href = response.url;
//             } else {
//                 // No manual redirect, handle the response as needed
//                 console.log('No manual redirect');
//             }
//             // const response = await fetch('/user/test', { method: "GET" });
//             // const json = await response.json();
//             // console.log(json, response.url);
//         }
//         catch(err){
//             console.log("Nope: ", err);
//         }
    
//         // Or you can work with it as a plain object:
//         // const formJson = Object.fromEntries(formData.entries());
//         // console.log(formJson);
//       }
    
//       return (
//         <form method="POST" onSubmit={handleSubmit}>

//             <input name="username" type="text" placeholder="Username" />
//             <input name="password" type="password" placeholder="******" />
//             <button type="submit">Submit form</button>

//         </form>
//       );

// }

// export default LoginForm