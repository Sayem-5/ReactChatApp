import { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

const Login = () => {
    return(
        <div className="login">
            <LoginForm />
        </div>
    )
}

export default Login;
