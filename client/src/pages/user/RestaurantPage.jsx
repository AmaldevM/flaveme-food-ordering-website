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
      // Corrected: The backend returns an array of restaurants directly
      setRestData(response.data || []);
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
    <div className="text-white py-10">
      <main className="sm:py-4 md:py-6 lg:py-6 xl:py-6">
        <h2 className="text-2xl font-extrabold text-center leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
          Top <span className="text-amber-400">Restaurants</span>
        </h2>

        {/* Carousel Section */}
        <RestCarousel />

        {/* Loading, Error, or Data Section */}
        {loading && <p className="text-center mt-8 text-gray-400">Loading restaurants...</p>}
        {error && <p className="text-center text-red-400 mt-8 font-semibold">{error}</p>}
        {!loading && restData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10">
            {restData.map((rest) => (
              <BasicCard key={rest._id} rest={rest} />
            ))}
          </div>
        )}
        {!loading && !error && restData.length === 0 && (
          <p className="text-center mt-10 text-gray-400 font-medium">
            No partner restaurants found.
          </p>
        )}
      </main>
    </div>
  );
};
