import { useEffect, useState } from "react";

const Notify = (prop) => {

    const { message, error, success, hideNotify } = prop;

    const [ show, setShow ] = useState(true);

    useEffect(() => {

        console.log("Message: ", message, "Error: ", error, "Success: ", success);

        setShow(true);

        setTimeout(() => {
            console.log("Before");

            hideNotify();
            setShow(false);
            // console.log("After");
            // console.log("Message: ", message, "Error: ", error, "Success: ", success);
        }, 6000);
    });

    return(
        <div className={`transition-all duration-700 ease-in-out absolute w-[100vh] translate-x-[-50%] ${ show ? "animate-notify" : "" } translate-y-[1000px] left-[50%]`}>
            <div className="flex flex-col items-center justify-center">
                { success && <div className="w-[40%] flex flex-row py-7 px-3 items-center justify-center rounded-3xl bg-[#00a884] bg-opacity-80 shadow-2xl">
                    <div className="w-full text-center text-[#111B21] font-open font-semibold tracking-wider text-md">
                        <p>{ message }</p>
                    </div>
                </div> }
                { error && <div className="w-[40%] flex flex-row py-7 px-3 items-center justify-center rounded-3xl bg-red-vivid-600 bg-opacity-80 shadow-2xl">
                    <div className="w-full text-center text-[#111B21] font-open font-semibold tracking-wider text-md">
                        <p>{ message }</p>
                    </div>
                </div> }
            </div>
        </div>
    )

}

export default Notify;