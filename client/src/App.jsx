import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes.jsx";
import LoadingScreen from "./components/ui/LoadingScreen";
import { Toaster } from "react-hot-toast";

import { InteractiveBackground } from "./components/ui/InteractiveBackground";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-from)] to-[var(--bg-to)] text-[var(--text-primary)] transition-colors duration-500 overflow-x-hidden relative">
      {/* Dynamic Animated Vector Drones & Interactive Ambient Mesh Gradient Background */}
      <InteractiveBackground />
      
      <div className="min-h-screen relative z-10">
        <React.Suspense fallback={<LoadingScreen />}>
          <Toaster 
            position="top-center" 
            reverseOrder={false}
            toastOptions={{
              className: 'glass-panel text-[var(--text-primary)] rounded-xl border border-white/20 dark:border-gray-800/40',
              duration: 3500,
            }}
          />
          <RouterProvider router={router} />
        </React.Suspense>
      </div>
    </div>
  );
}

export default App;
