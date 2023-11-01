import { useEffect, useState, useRef } from "react";

const GroupIcon = (prop) => {

    const { iconUrl, width, height } = prop;

    return (
        <img className="rounded-full shadow-lg" style={ { width: width, height: height } } src={ iconUrl }/>
    )
}

export default GroupIcon;