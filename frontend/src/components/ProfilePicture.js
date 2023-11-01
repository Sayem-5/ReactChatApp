import { useEffect, useState, useRef } from "react";

const ProfilePicture = (prop) => {

    const { pictureUrl, width, height } = prop;

    return (
        <img className="rounded-full shadow-lg" style={ { width: width, height: height } } src={ pictureUrl }/>
    )
}

export default ProfilePicture;