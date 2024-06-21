import { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

const Login = () => {
    return(
        <div className="login">
            <LoginForm />
            //This is for Torque360
            <!--Start of Tawk.to Script-->
            <script type="text/javascript">
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/66756d39eaf3bd8d4d12f57f/1i0tb5b46';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();
            </script>
            <!--End of Tawk.to Script-->
        </div>
    )
}

export default Login;
