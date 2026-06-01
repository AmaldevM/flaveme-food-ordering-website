import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

// Helper component to auto-rotate models
const AutoRotatingGroup = ({ children }) => {
  const groupRef = useRef();
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });
  return <group ref={groupRef}>{children}</group>;
};

// 3D Stylized Burger Model
const BurgerModel = () => {
  return (
    <group position={[0, -0.4, 0]} scale={[1.2, 1.2, 1.2]}>
      {/* Bottom Bun */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.25, 32]} />
        <meshStandardMaterial color="#d97706" roughness={0.4} />
      </mesh>

      {/* Meat Patty */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.2, 32]} />
        <meshStandardMaterial color="#451a03" roughness={0.8} bumpScale={0.1} />
      </mesh>

      {/* Cheese Slice */}
      <mesh position={[0, 0.32, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[1.2, 0.03, 1.2]} />
        <meshStandardMaterial color="#eab308" roughness={0.2} />
      </mesh>

      {/* Lettuce Layer */}
      <mesh position={[0, 0.38, 0]}>
        <torusGeometry args={[0.75, 0.08, 16, 100]} />
        <meshStandardMaterial color="#22c55e" roughness={0.6} />
      </mesh>

      {/* Top Bun */}
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#d97706" roughness={0.4} />
      </mesh>

      {/* Sesame Seeds */}
      {Array.from({ length: 15 }).map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / 15);
        const theta = Math.sqrt(15 * Math.PI) * phi;
        const x = 0.6 * Math.sin(phi) * Math.cos(theta);
        const z = 0.6 * Math.sin(phi) * Math.sin(theta);
        const y = 0.55 + 0.6 * Math.cos(phi);
        if (y > 0.8) {
          return (
            <mesh key={i} position={[x, y, z]} rotation={[phi, theta, 0]}>
              <boxGeometry args={[0.04, 0.02, 0.08]} />
              <meshStandardMaterial color="#fef08a" />
            </mesh>
          );
        }
        return null;
      })}
    </group>
  );
};

// 3D Stylized Pizza Model
const PizzaModel = () => {
  return (
    <group position={[0, -0.1, 0]} rotation={[0.4, 0, 0]} scale={[1.3, 1.3, 1.3]}>
      {/* Crust Base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 0.08, 32]} />
        <meshStandardMaterial color="#b45309" roughness={0.5} />
      </mesh>

      {/* Cheese Base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.03, 32]} />
        <meshStandardMaterial color="#fef08a" roughness={0.3} />
      </mesh>

      {/* Raised Outer Crust */}
      <mesh position={[0, 0.04, 0]}>
        <torusGeometry args={[1.02, 0.08, 16, 100]} />
        <meshStandardMaterial color="#92400e" roughness={0.5} />
      </mesh>

      {/* Pepperoni Toppings */}
      {[
        [-0.4, 0.07, -0.3], [0.4, 0.07, 0.3], [-0.3, 0.07, 0.4],
        [0.3, 0.07, -0.4], [0.1, 0.07, 0.1], [-0.5, 0.07, 0.1],
        [0.5, 0.07, -0.1], [0, 0.07, -0.5], [0, 0.07, 0.5]
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
      ))}

      {/* Basil Toppings */}
      {[
        [-0.2, 0.07, -0.1], [0.2, 0.07, 0.1], [0.1, 0.07, -0.2],
        [-0.1, 0.07, 0.2]
      ].map((pos, i) => (
        <mesh key={i} position={pos} rotation={[0, i * 45, 0]}>
          <boxGeometry args={[0.06, 0.02, 0.14]} />
          <meshStandardMaterial color="#16a34a" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
};

// 3D Stylized Donut Model
const DonutModel = () => {
  return (
    <group position={[0, 0, 0]} rotation={[0.4, 0.2, 0]} scale={[1.4, 1.4, 1.4]}>
      {/* Donut Base */}
      <mesh>
        <torusGeometry args={[0.7, 0.28, 32, 100]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.4} />
      </mesh>

      {/* Frosting */}
      <mesh position={[0, 0.05, 0.02]}>
        <torusGeometry args={[0.68, 0.24, 32, 100]} />
        <meshStandardMaterial color="#ec4899" roughness={0.2} />
      </mesh>

      {/* Sprinkles */}
      {[
        // Position offsets
        [-0.4, 0.25, 0.1], [0.4, 0.25, 0.1], [-0.1, 0.28, 0.3],
        [0.1, 0.28, -0.3], [0.3, 0.22, 0.2], [-0.3, 0.22, -0.2],
        [-0.2, 0.27, 0.2], [0.2, 0.27, -0.2], [0, 0.28, 0.4],
        [0, 0.28, -0.4], [0.5, 0.15, 0], [-0.5, 0.15, 0]
      ].map((pos, i) => {
        // Sprinkles colors
        const colors = ["#3b82f6", "#eab308", "#22c55e", "#ffffff", "#f97316"];
        const color = colors[i % colors.length];
        return (
          <mesh key={i} position={pos} rotation={[i * 20, i * 40, i * 10]}>
            <boxGeometry args={[0.04, 0.03, 0.12]} />
            <meshStandardMaterial color={color} roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
};

// 3D Stylized Drink Model
const DrinkModel = () => {
  return (
    <group position={[0, -0.5, 0]} scale={[1.2, 1.2, 1.2]}>
      {/* Cup Glass (Semi-Transparent Outer) */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.55, 0.42, 1.0, 32, 1, true]} />
        <meshStandardMaterial 
          color="#e2e8f0" 
          transparent 
          opacity={0.3} 
          roughness={0.1}
          metalness={0.1}
          side={2} // DoubleSide
        />
      </mesh>

      {/* Drink Liquid (Orange Juice) */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.51, 0.4, 0.8, 32]} />
        <meshStandardMaterial color="#f97316" roughness={0.2} transparent opacity={0.95} />
      </mesh>

      {/* Ice Cubes */}
      {[
        [-0.15, 0.65, 0.15], [0.15, 0.6, -0.15], [0, 0.55, 0]
      ].map((pos, i) => (
        <mesh key={i} position={pos} rotation={[i * 30, i * 45, i * 15]}>
          <boxGeometry args={[0.22, 0.22, 0.22]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.6} roughness={0.1} />
        </mesh>
      ))}

      {/* Straw (Red/White Striped) */}
      <mesh position={[0.2, 0.85, -0.1]} rotation={[0, 0, -0.25]}>
        <cylinderGeometry args={[0.04, 0.04, 1.2, 16]} />
        <meshStandardMaterial color="#ef4444" roughness={0.3} />
      </mesh>
    </group>
  );
};

export const FoodModelViewer = ({ type }) => {
  const renderModel = () => {
    switch (type) {
      case 'burger':
        return <BurgerModel />;
      case 'pizza':
        return <PizzaModel />;
      case 'donut':
        return <DonutModel />;
      case 'drink':
        return <DrinkModel />;
      default:
        return <BurgerModel />;
    }
  };

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing" style={{ minHeight: '350px' }}>
      <Canvas style={{ background: 'transparent' }} shadows>
        {/* Camera config */}
        <PerspectiveCamera makeDefault position={[0, 0, 3.2]} fov={50} />

        {/* High-end Lighting */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
        <pointLight position={[-5, -5, -5]} intensity={0.5} />
        <spotLight position={[0, 5, 2]} intensity={1.0} angle={0.6} penumbra={1} />

        {/* Auto rotating model */}
        <AutoRotatingGroup>
          {renderModel()}
        </AutoRotatingGroup>

        {/* User Interaction */}
        <OrbitControls 
          enableZoom={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 1.6} 
        />
      </Canvas>
    </div>
  );
};
