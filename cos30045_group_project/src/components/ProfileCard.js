import React from 'react'

const ProfileCard = ({ profilePicture, name, links }) => {
    return (
      <div className="card bg-gray-300 p-6 rounded-xl transition-all duration-300 ease-in-out hover:shadow-xl hover:ring-2 hover:ring-blue-500 hover:filter hover:drop-shadow-xl hover:brightness-110">
  <img
    src={profilePicture}
    alt={`${name}'s profile`}
    className="profile-picture rounded-xl w-[150px] h-[150px] object-cover mx-auto transition-all duration-300 ease-in-out hover:scale-105"
  />
  <div className="mt-2">
    <div className="flex w-full justify-center align-center">
      <h2 className="name text-gray-900 font-bold text-nowrap transition-all duration-300 ease-in-out hover:text-blue-500">
        {name}
      </h2>
    </div>
    <div className="links flex w-full justify-center align-center mt-2">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-2 transition-all duration-300 ease-in-out hover:scale-110 hover:text-blue-500"
        >
          <img
            src={link.image}
            alt={`${name}'s ${link.label}`}
            className="profile-links w-[30px] transition-all duration-300 ease-in-out hover:drop-shadow-lg"
          />
        </a>
      ))}
    </div>
  </div>
</div>

    );
  };
  
  export default ProfileCard;
