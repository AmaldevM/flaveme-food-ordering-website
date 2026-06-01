import React from 'react';
import { useNavigate } from 'react-router-dom';

const BasicCard = ({ rest }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg p-4 border border-gray-100 dark:border-gray-700/50 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl flex flex-col justify-between">
      <div>
        <div
          className="h-44 bg-cover bg-center rounded-xl"
          style={{ backgroundImage: `url(${rest.image || "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"})` }}
        />
        <h3 className="text-xl font-bold mt-4 text-gray-900 dark:text-white font-montserrat">{rest.name}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2">{rest.description || "Fresh and delicious items prepared daily."}</p>
        <div className="flex items-center gap-2 mt-3">
          <span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs px-2.5 py-1 rounded-full font-bold">
            ★ {rest.rating || "4.5"}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold">
            {rest.cuisine || "General Cuisine"}
          </span>
        </div>
      </div>
      <button
        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-4 py-2.5 mt-5 rounded-xl w-full shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all"
        onClick={() => navigate(`/user/restaurants/${rest._id}`)}
      >
        Explore Menu
      </button>
    </div>
  );
};

export default BasicCard;
