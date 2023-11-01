
const Message = (prop) => {

    const { message, currentUser } = prop;

    //Time to 12hrs
    function convertTo12HourFormat(time24hr) {
        const date = new Date(`2000-01-01T${time24hr}`);
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).toLowerCase()
        .replace(/\s/g, '');
    }

    return(
        message && message.sender._id.toString() === currentUser._id.toString() ? 
        (
        <div className="message inline-flex pr-[20px] mb-3.5 font-open justify-end">
            <div className="bg-[#005c4b] flex flex-col pl-[9px] pr-[7px] pb-[4px] pt-[5.5px] rounded-[9.67px] w-auto max-w-[45%]">
                <div className="w-full pr-12">
                    <p className="text-sm text-[#e9edef] break-words">{message.content}</p>
                </div>
                <div className="relative -mt-[0.68rem] mr-[0.1rem]">
                    <span className="float-right text-[0.6875rem] text-[#ffffff99]">{convertTo12HourFormat(message.time)}</span>
                </div>
            </div>
        </div>
        ) :
        (
            <div className="message inline-flex pl-[25px] mb-3.5 font-open">
                <div className="bg-[#202c33] flex flex-col pl-[9px] pr-[7px] pb-[4px] pt-[5.5px] rounded-[9.67px] w-auto max-w-[45%]">
                    <div className="w-full pr-12">
                        <p className="text-sm text-[#e9edef] break-words">{message.content}</p>
                    </div>
                    <div className="relative -mt-[0.68rem] mr-[0.1rem]">
                        <span className="float-right text-[0.6875rem] text-[#ffffff99]">{convertTo12HourFormat(message.time)}</span>
                    </div>
                </div>
            </div>
        )
    )

}
//message 
//flex flex-col max-w-[50%] items-start justify-center  bg-[#202c33]
export default Message;