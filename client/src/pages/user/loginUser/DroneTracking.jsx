import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Sparkles as DreiSparkles } from "@react-three/drei";
import { axiosInstance } from "../../../config/axiosInstance";
import * as THREE from "three";
import { 
  Navigation, 
  Battery, 
  Plane, 
  MapPin, 
  Timer, 
  ShieldCheck, 
  ListFilter, 
  Loader2, 
  ArrowLeft,
  Play,
  RotateCcw,
  Sparkles
} from "lucide-react";
import toast from "react-hot-toast";
import { requestNotificationPermission, showBrowserNotification } from "../../../utils/pushNotifications";

// Stylized 3D Low-Poly City Map Component
function CityMap() {
  // Generate random building positions and sizes
  const buildings = [
    { pos: [-10, 2, -10], size: [3, 4, 3], color: "#4f46e5" },
    { pos: [-8, 3, -4], size: [2, 6, 2], color: "#06b6d4" },
    { pos: [-4, 1.5, -8], size: [3, 3, 3], color: "#7c3aed" },
    { pos: [0, 4, -12], size: [4, 8, 4], color: "#3b82f6" },
    { pos: [6, 2, -10], size: [3, 4, 2], color: "#ec4899" },
    { pos: [12, 3, -12], size: [2, 6, 3], color: "#f43f5e" },
    { pos: [-12, 2.5, 2], size: [4, 5, 2], color: "#8b5cf6" },
    { pos: [-6, 3.5, 8], size: [2, 7, 2], color: "#10b981" },
    { pos: [-2, 1.5, 4], size: [3, 3, 3], color: "#14b8a6" },
    { pos: [4, 4.5, 10], size: [2.5, 9, 2.5], color: "#f59e0b" },
    { pos: [8, 2, 4], size: [3, 4, 3], color: "#3b82f6" },
    { pos: [10, 3, 8], size: [2, 6, 2], color: "#a855f7" },
  ];

  return (
    <group>
      {/* Ground Grid & Base */}
      <gridHelper args={[60, 60, "#4f46e5", "#1e293b"]} position={[0, -0.01, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Buildings */}
      {buildings.map((b, idx) => (
        <mesh key={idx} position={b.pos} castShadow receiveShadow>
          <boxGeometry args={b.size} />
          <meshStandardMaterial 
            color={b.color} 
            roughness={0.4} 
            metalness={0.1}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Restaurant Building (Takeoff Point) */}
      <group position={[-18, 0, -18]}>
        <mesh castShadow receiveShadow position={[0, 2.5, 0]}>
          <boxGeometry args={[4, 5, 4]} />
          <meshStandardMaterial color="#ef4444" roughness={0.2} emissive="#ef4444" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0, 5.1, 0]}>
          <cylinderGeometry args={[2.5, 2.5, 0.2, 32]} />
          <meshStandardMaterial color="#b91c1c" />
        </mesh>
        {/* Glowing chef sign / marker */}
        <mesh position={[0, 6, 0]}>
          <octahedronGeometry args={[0.8]} />
          <meshStandardMaterial color="#fca5a5" emissive="#ef4444" emissiveIntensity={1} />
        </mesh>
      </group>

      {/* Customer House (Landing Point) */}
      <group position={[18, 0, 18]}>
        <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
          <boxGeometry args={[3.5, 3, 3.5]} />
          <meshStandardMaterial color="#10b981" roughness={0.3} emissive="#10b981" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0, 3.1, 0]}>
          <coneGeometry args={[2.8, 1.8, 4]} rotation={[0, Math.PI / 4, 0]} />
          <meshStandardMaterial color="#047857" />
        </mesh>
        {/* Landing Pad */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[2.2, 2.2, 0.05, 32]} />
          <meshStandardMaterial color="#059669" roughness={0.5} />
        </mesh>
        {/* Glowing home marker */}
        <mesh position={[0, 4.3, 0]}>
          <octahedronGeometry args={[0.7]} />
          <meshStandardMaterial color="#a7f3d0" emissive="#10b981" emissiveIntensity={1} />
        </mesh>
      </group>
    </group>
  );
}

// Stylized 3D Procedural Hexacopter Drone Component
function Drone({ progress, curve, onPosChange }) {
  const droneRef = useRef();
  const propRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useFrame((state, delta) => {
    if (!curve || !droneRef.current) return;

    // Get current position on Bezier curve (clamp between 0 and 1)
    const t = Math.min(Math.max(progress, 0), 1);
    const pos = curve.getPointAt(t);
    droneRef.current.position.copy(pos);
    onPosChange(pos);

    // Get tangent direction to rotate drone forward
    if (t < 0.99) {
      const nextPos = curve.getPointAt(Math.min(t + 0.005, 1));
      const direction = new THREE.Vector3().subVectors(nextPos, pos).normalize();
      
      // Calculate rotation matrix to look in path direction
      const matrix = new THREE.Matrix4();
      matrix.lookAt(pos, nextPos, new THREE.Vector3(0, 1, 0));
      const targetQuat = new THREE.Quaternion().setFromRotationMatrix(matrix);
      
      // Add slight pitch/tilt based on velocity
      const pitchAngle = t > 0.01 && t < 0.9 ? 0.15 : 0;
      const pitchQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitchAngle);
      targetQuat.multiply(pitchQuat);

      droneRef.current.quaternion.slerp(targetQuat, 0.1);
    } else {
      // Land flat at destination
      const flatQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 4);
      droneRef.current.quaternion.slerp(flatQuat, 0.1);
    }

    // Fast rotation of propellers
    const speedMultiplier = t > 0 && t < 1.0 ? 0.8 : 0.05; // slow down when idle/landed
    propRefs.forEach((pRef) => {
      if (pRef.current) {
        pRef.current.rotation.y += speedMultiplier;
      }
    });
  });

  return (
    <group ref={droneRef}>
      {/* Central Chassis Hub */}
      <mesh castShadow>
        <cylinderGeometry args={[0.7, 0.8, 0.35, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Top Dome */}
      <mesh castShadow position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.45, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#4f46e5" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Carbon Arms (6 arms configuration) */}
      {[...Array(6)].map((_, idx) => {
        const angle = (idx * Math.PI) / 3;
        const armLength = 1.3;
        return (
          <group key={idx} rotation={[0, angle, 0]}>
            {/* Structural Carbon Arm Tube */}
            <mesh castShadow position={[0, 0.05, armLength / 2]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, armLength, 8]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Rotor Engine Pod */}
            <mesh castShadow position={[0, 0.15, armLength]}>
              <cylinderGeometry args={[0.15, 0.15, 0.2, 8]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
            </mesh>

            {/* Propeller Rotors */}
            <mesh ref={propRefs[idx]} castShadow position={[0, 0.27, armLength]}>
              <boxGeometry args={[0.8, 0.015, 0.06]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.5} transparent opacity={0.7} />
            </mesh>

            {/* Glowing arm end lights */}
            <mesh position={[0, 0, armLength + 0.15]}>
              <sphereGeometry args={[0.06]} />
              <meshBasicMaterial color={idx % 2 === 0 ? "#10b981" : "#ef4444"} />
            </mesh>
          </group>
        );
      })}

      {/* Landing Gear Skids */}
      <group position={[0, -0.3, 0]}>
        <mesh castShadow position={[-0.4, 0.1, 0]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.45, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh castShadow position={[0.4, 0.1, 0]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.45, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh castShadow position={[-0.4, -0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.4, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        <mesh castShadow position={[0.4, -0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.4, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
      </group>

      {/* Cargo Hook + Food Box (Orange) */}
      <group position={[0, -0.4, 0]}>
        {/* Hanging wire */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.3]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        {/* Food box itself */}
        <mesh castShadow position={[0, -0.2, 0]}>
          <boxGeometry args={[0.7, 0.6, 0.7]} />
          <meshStandardMaterial color="#f97316" roughness={0.4} emissive="#ea580c" emissiveIntensity={0.15} />
        </mesh>
        {/* Cargo Strap */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.73, 0.1, 0.73]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>
    </group>
  );
}

export default function DroneTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isSimulating, setIsSimulating] = useState(true);

  // Live telemetry states
  const [altitude, setAltitude] = useState(0);
  const [telemetryLogs, setTelemetryLogs] = useState([]);
  const logsContainerRef = useRef(null);

  // Define Bezier Flight Curve path coordinates (A -> Cruising -> B)
  // Restaurant: [-18, 0.5, -18], House: [18, 0.5, 18]
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-18, 0.5, -18), // Takeoff
    new THREE.Vector3(-15, 6, -15),  // Ascend
    new THREE.Vector3(-8, 9, -5),    // Cruising High
    new THREE.Vector3(0, 10, 0),     // Center Cruising
    new THREE.Vector3(8, 9, 5),      // Cruising
    new THREE.Vector3(15, 6, 15),    // Descent Approach
    new THREE.Vector3(18, 0.5, 18)   // Land Pad
  ]);

  const addLogMessage = (msg) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTelemetryLogs((prev) => [...prev, `[${timestamp}] ${msg}`]);
  };

  // Fetch Order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/orderHistory/track-order/${orderId}`);
        setOrder(response.data);
        addLogMessage("Connected to Flave Autonomous Fleet dispatcher.");
        addLogMessage(`Initializing drone route for Order ID: ${orderId.slice(0, 8)}...`);
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Failed to load tracking details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // Simulation tick logic
  useEffect(() => {
    let intervalId;
    if (isSimulating && order) {
      intervalId = setInterval(() => {
        setProgress((prev) => {
          const nextVal = prev + 0.002 * speedMultiplier;
          if (nextVal >= 1) {
            setIsSimulating(false);
            addLogMessage("Destination reached. Package released successfully.");
            addLogMessage("Mission complete. Heading back to base.");
            toast.success("Drone delivered your food!", { duration: 5000 });
            showBrowserNotification("Flave Me Delivery", {
              body: "Your food has been delivered successfully! Bon appétit! 🍕✨",
              tag: "drone-delivery",
            });
            return 1;
          }
          return nextVal;
        });
      }, 50);
    }
    return () => clearInterval(intervalId);
  }, [isSimulating, speedMultiplier, order]);

  // Handle auto-scrolling telemetry logs
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [telemetryLogs]);

  // Log telemetry stages based on progress
  const stageLogsTriggered = useRef(new Set());
  useEffect(() => {
    const logStage = (stage, msg) => {
      if (!stageLogsTriggered.current.has(stage)) {
        stageLogsTriggered.current.add(stage);
        addLogMessage(msg);
      }
    };

    if (progress > 0.01 && progress < 0.05) {
      logStage(1, "Rotor ignition sequence verified. Takeoff authorized.");
      showBrowserNotification("Flave Me Delivery", {
        body: "Your delivery drone is warming up for takeoff! 🛫",
        tag: "drone-delivery",
      });
    }
    if (progress > 0.08 && progress < 0.15) {
      logStage(2, "Ascending to 90m cruising corridor. Wind drift: 3 km/h NW.");
    }
    if (progress > 0.3 && progress < 0.4) {
      logStage(3, "Heading locked. Cruising speed: 45 km/h. Power draw: nominal.");
      showBrowserNotification("Flave Me Delivery", {
        body: "Your delivery drone has taken off and is cruising! 🚀",
        tag: "drone-delivery",
      });
    }
    if (progress > 0.5 && progress < 0.6) {
      logStage(4, "Entering airspace quadrant Delta. Clear flight path.");
    }
    if (progress > 0.8 && progress < 0.88) {
      logStage(5, "Descent corridor established. Reducing speed to 12 km/h.");
      showBrowserNotification("Flave Me Delivery", {
        body: "Your delivery drone is descending for landing! 🛬",
        tag: "drone-delivery",
      });
    }
    if (progress > 0.96 && progress < 0.99) {
      logStage(6, "Target landing pad locked. Confirming release mechanics.");
    }
  }, [progress]);

  const handlePosChange = (pos) => {
    // Convert 3D scene units to real-world meters representation
    setAltitude(Math.round(pos.y * 10));
  };

  const restartSimulation = () => {
    setProgress(0);
    setIsSimulating(true);
    stageLogsTriggered.current.clear();
    setTelemetryLogs([]);
    addLogMessage("Simulation restarted. Re-routing autonomous drone...");
  };

  const getFlightStatusText = () => {
    if (progress === 0) return "Taking Off 🛫";
    if (progress >= 1) return "Food Delivered! ✅";
    if (progress > 0.85) return "Descending 🛬";
    if (progress > 0.15) return "En Route / Cruising 🚀";
    return "Ascending 📈";
  };

  const getOrderItems = () => {
    if (!order || !order.items) return "";
    return order.items.map(item => `${item.menuItem?.name || "Item"} (x${item.quantity})`).join(", ");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-4 font-montserrat">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-sm font-semibold tracking-wider animate-pulse">
          Connecting to Drone Dispatcher...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-6 font-montserrat">
        <h3 className="text-xl font-bold">Failed to load order.</h3>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 bg-indigo-600 rounded-xl font-bold flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Go back Home
        </button>
      </div>
    );
  }

  const droneBattery = Math.max(100 - Math.round(progress * 80), 20);
  const distanceRemaining = ((1 - progress) * 1.8).toFixed(2); // 1.8 km distance representation
  const etaMinutes = Math.floor(Math.max((1 - progress) * 3, 0));
  const etaSeconds = Math.round(Math.max(((1 - progress) * 3 - etaMinutes) * 60, 0));

  return (
    <div className="min-h-screen bg-slate-950 text-white font-montserrat flex flex-col lg:flex-row overflow-hidden pt-4">
      {/* 3D Canvas Viewport */}
      <div className="flex-1 h-[50vh] lg:h-screen relative border-b lg:border-b-0 lg:border-r border-slate-800">
        {/* Floating Heading Overlay */}
        <div className="absolute top-6 left-6 z-10 pointer-events-none">
          <button
            onClick={() => navigate("/")}
            className="pointer-events-auto px-4 py-2 bg-slate-900/80 hover:bg-slate-800/80 backdrop-blur-md rounded-xl border border-slate-700/50 text-xs font-bold flex items-center gap-2 transition-all active:scale-95 mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Exit tracking
          </button>
          
          <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/50 p-4 rounded-2xl shadow-xl flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/30">
              <Plane className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold flex items-center gap-1.5">
                Flave Autonomous Fleet
              </h2>
              <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">
                Drone Delivery Tracker
              </p>
            </div>
          </div>
        </div>

        {/* 3D Render Canvas */}
        <Canvas shadowMap camera={{ position: [-25, 20, 25], fov: 40 }} className="w-full h-full bg-[#0a0f1d]">
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 30, 10]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-10, 20, -10]} intensity={0.6} />

          {/* Low poly environment */}
          <CityMap />

          {/* Dotted path representing curve */}
          <Line 
            points={curve.getPoints(100)} 
            color="#4f46e5" 
            lineWidth={2}
            dashed
            dashScale={2}
            gapSize={1}
          />

          {/* Flashing route particles */}
          <DreiSparkles 
            count={30}
            scale={[35, 10, 35]} 
            size={2} 
            color="#ef4444" 
            speed={0.5} 
          />

          {/* The Flying Drone */}
          <Drone 
            progress={progress} 
            curve={curve} 
            onPosChange={handlePosChange} 
          />

          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            maxPolarAngle={Math.PI / 2.2} // Prevent camera going below ground
          />
        </Canvas>

        {/* Floating Simulation Controls */}
        <div className="absolute bottom-6 left-6 z-10 flex gap-3 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-3 rounded-2xl shadow-xl">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95 ${
              isSimulating ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isSimulating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Pause Flight
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" /> Resume Flight
              </>
            )}
          </button>
          
          <button
            onClick={restartSimulation}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 border border-slate-700/50 cursor-pointer transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>

          <div className="flex items-center gap-1.5 border-l border-slate-800 pl-3">
            {[1, 2, 5].map((multiplier) => (
              <button
                key={multiplier}
                onClick={() => setSpeedMultiplier(multiplier)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  speedMultiplier === multiplier
                    ? "bg-indigo-600 text-white border border-indigo-400"
                    : "bg-slate-800 text-gray-400 hover:bg-slate-700"
                }`}
              >
                {multiplier}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Glassmorphic Telemetry Controls Panel */}
      <div className="w-full lg:w-[420px] bg-slate-950 border-t lg:border-t-0 border-slate-800 p-6 flex flex-col justify-between h-auto lg:h-screen overflow-y-auto no-scrollbar">
        <div>
          {/* Status Banner */}
          <div className="p-4 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/20 rounded-2xl flex items-center justify-between mb-6 shadow-lg shadow-indigo-950/20">
            <div className="flex flex-col">
              <span className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider">Flight Status</span>
              <h3 className="text-base font-extrabold text-white mt-0.5">
                {getFlightStatusText()}
              </h3>
            </div>
            <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase animate-pulse">
              Live Feed
            </span>
          </div>

          {/* Telemetry Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-900/50 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Plane className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 font-semibold uppercase">Altitude</span>
                <span className="font-extrabold text-sm text-white">{altitude} m</span>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Battery className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 font-semibold uppercase">Battery</span>
                <span className="font-extrabold text-sm text-white">{droneBattery}%</span>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Navigation className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 font-semibold uppercase">Distance</span>
                <span className="font-extrabold text-sm text-white">{distanceRemaining} km</span>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                <Timer className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 font-semibold uppercase">ETA</span>
                <span className="font-extrabold text-sm text-white">
                  {etaMinutes}m {etaSeconds}s
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl mb-6 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-400 mb-1.5">
              <span>Restaurant</span>
              <span>User Destination</span>
            </div>
            <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-[10px] text-indigo-400 font-bold">
              <span>🚀 Takeoff Zone</span>
              <span>🎯 {Math.round(progress * 100)}% Complete</span>
              <span>📍 Landing Zone</span>
            </div>
          </div>

          {/* Flight Log System Console */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col mb-6 shadow-inner">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-2 mb-2 flex items-center gap-1.5">
              <ListFilter className="w-3.5 h-3.5 text-indigo-400" />
              Autonomous Flight Logs
            </h4>
            <div 
              ref={logsContainerRef}
              className="h-36 overflow-y-auto no-scrollbar font-mono text-[9px] text-emerald-400 space-y-1.5"
            >
              {telemetryLogs.map((log, index) => (
                <div key={index} className="leading-relaxed">
                  {log}
                </div>
              ))}
              {isSimulating && (
                <div className="flex items-center gap-1 text-[9px] text-emerald-500/60 italic animate-pulse pl-1">
                  <span>●</span> Telemetry transmitting live...
                </div>
              )}
            </div>
          </div>

          {/* Order Summary details card */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 mb-6 shadow-sm">
            <h4 className="font-extrabold text-sm text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Order Package Verification
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Order ID:</span>
                <span className="font-mono text-gray-200">{order._id.slice(0, 16)}...</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Price:</span>
                <span className="font-extrabold text-white text-sm">₹{order.totalAmount}</span>
              </div>
              <div className="flex flex-col gap-1 border-t border-slate-800 pt-2.5">
                <span className="text-gray-400">Items:</span>
                <span className="text-gray-200 font-semibold leading-relaxed">
                  {getOrderItems()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dispatcher footer details */}
        <div className="text-[10px] text-gray-500 text-center font-medium leading-relaxed mt-4">
          👨‍✈️ Flave Fleet Operations. Air Traffic Control Clearance #40921B. Autonomous airspace surveillance enabled.
        </div>
      </div>
    </div>
  );
}
