import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/config/axiosInstance";
import { useNavigate } from "react-router-dom";
import BasicCard from "@/components/user/BasicCard";
import { RestCarousel } from "@/components/user/RestCarousel";

export const RestaurantPage = () => {
  const [restData, setRestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getAllRest = async () => {
    try {
      setLoading(true);
      console.log("Fetching restaurants...");
      const response = await axiosInstance({
        method: "GET",
        url: "/rest/restaurants",
      });
      console.log("Restaurant Data Fetched", response.data);
      setRestData(response.data.restaurants || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError("Failed to load restaurants. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllRest();
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 rounded-lg shadow-lg">
      <main className="sm:py-4 md:py-6 lg:py-6 xl:py-6 m-6">
        <h2 className="text-lg font-bold text-center leading-tight text-white sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl">
          Top <span className="text-amber-400">Restaurants</span>
        </h2>

        {/* Carousel Section */}
        <RestCarousel />

        {/* Loading, Error, or Data Section */}
        {loading && <p className="text-center mt-4">Loading...</p>}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
        {!loading && restData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {restData.map((rest) => (
              <BasicCard key={rest.id} rest={rest} />
            ))}
          </div>
        )}
        {!loading && !error && restData.length === 0 && (
          <p className="text-center mt-6 text-gray-400">
            No restaurants found.
          </p>
        )}
      </main>
    </div>
  );
};
