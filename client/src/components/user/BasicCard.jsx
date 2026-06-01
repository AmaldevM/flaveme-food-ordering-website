import React from 'react';

const BasicCard = ({ rest }) => (
    <div className="bg-gray-700 rounded-lg shadow-md p-4">
      <div
        className="h-36 bg-cover bg-center rounded-md"
        style={{ backgroundImage: `url(${rest.image || "default.jpg"})` }}
      />
      <h3 className="text-lg font-semibold mt-4">{rest.name}</h3>
      <button
        className="bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 mt-4 rounded-md"
        onClick={() => console.log(`Navigate to restaurant ${rest.id}`)}
      >
        Explore
      </button>
    </div>
  );
  

export default BasicCard;
