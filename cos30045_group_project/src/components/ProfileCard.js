import React from 'react'

const ProfileCard = ({ profilePicture, name, links }) => {
    return (
      <div className="card bg-gray-300 p-6 rounded-xl">
        <img src={profilePicture} alt={`${name}'s profile`} className="profile-picture rounded-xl w-[150px] h-[150px] object-cover mx-auto" />
        <div className='mt-2'>
            <div className="flex w-full justify-center align-center"><h2 className="name text-gray-900 font-bold text-nowrap">{name}</h2></div>
            <div className="links flex w-full justify-center align-center mt-2">
            {links.map((link, index) => (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className='mx-2'>
                <img src={link.image} alt={`${name}'s ${link.label}`} className="profile-links w-[30px]" />
                </a>
            ))}
            </div>
        </div>
        
      </div>
    );
  };
  
  export default ProfileCard;
