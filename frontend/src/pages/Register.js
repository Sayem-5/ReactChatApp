import { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";

const Register = () => {
    return(
        <div className="register">
            <RegisterForm />
        </div>
    )
}

export default Register;