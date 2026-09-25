import React, { useMemo, useState, useEffect } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  projX: number;
  projY: number;
  opacity: number;
  size: number;
}

interface Edge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
}

export const PaymentsGlobe: React.FC = () => {
  const [rotation, setRotation] = useState(0);

  // Subtle slow rotation effect to make the globe feel alive
  useEffect(() => {
    let animId: number;
    const animate = () => {
      setRotation((prev) => (prev + 0.15) % 360);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const { points, edges, startPoint, endPoint } = useMemo(() => {
    const R = 155;
    const cx = 240;
    const cy = 230;
    const numPoints = 84;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    // Angle conversions for tilt
    const rotY = (rotation * Math.PI) / 180;
    const tiltX = (18 * Math.PI) / 180; // 18 deg forward tilt

    const pts3D: Point3D[] = [];

    for (let i = 0; i < numPoints; i++) {
      const y0 = 1 - (i / (numPoints - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y0 * y0);
      const theta = phi * i + rotY;

      const x0 = Math.cos(theta) * radiusAtY;
      const z0 = Math.sin(theta) * radiusAtY;

      // Rotate around X (tilt)
      const x1 = x0;
      const y1 = y0 * Math.cos(tiltX) - z0 * Math.sin(tiltX);
      const z1 = y0 * Math.sin(tiltX) + z0 * Math.cos(tiltX);

      // Perspective projection
      const k = 1.3 / (1.3 - z1 * 0.3);
      const projX = cx + x1 * R * k;
      const projY = cy - y1 * R * k;

      // Opacity: front facing points brighter, rear dimmer
      const normZ = (z1 + 1) / 2; // 0 to 1
      const opacity = 0.18 + normZ * 0.72;
      const size = 1.2 + normZ * 1.6;

      pts3D.push({ x: x1, y: y1, z: z1, projX, projY, opacity, size });
    }

    // Connect nearest neighbors with faint network lines
    const edgeList: Edge[] = [];
    const maxDist = 0.42;

    for (let i = 0; i < pts3D.length; i++) {
      for (let j = i + 1; j < pts3D.length; j++) {
        const dx = pts3D[i].x - pts3D[j].x;
        const dy = pts3D[i].y - pts3D[j].y;
        const dz = pts3D[i].z - pts3D[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDist) {
          const avgZ = (pts3D[i].z + pts3D[j].z) / 2;
          const edgeOpacity = Math.max(0.04, (avgZ + 1) * 0.14);
          edgeList.push({
            x1: pts3D[i].projX,
            y1: pts3D[i].projY,
            x2: pts3D[j].projX,
            y2: pts3D[j].projY,
            opacity: edgeOpacity,
          });
        }
      }
    }

    // Two fixed prominent transaction nodes matching the user's screenshot:
    // Left node (Hot pink): ~(-0.65, 0.2, 0.7)
    // Right node (Sky blue): ~(0.75, -0.28, 0.6)
    const p1X = cx - 92;
    const p1Y = cy - 25;
    const p2X = cx + 118;
    const p2Y = cy + 76;

    return {
      points: pts3D,
      edges: edgeList,
      startPoint: { x: p1X, y: p1Y },
      endPoint: { x: p2X, y: p2Y },
    };
  }, [rotation]);

  // Curved arc control point arcing smoothly over the northern hemisphere
  const controlX = 220;
  const controlY = 120;
  const arcPath = `M ${startPoint.x} ${startPoint.y} Q ${controlX} ${controlY} ${endPoint.x} ${endPoint.y}`;

  return (
    <div className="relative w-full h-[400px] sm:h-[440px] flex items-center justify-center select-none pointer-events-none">
      {/* SVG Canvas for Globe, Mesh & Transaction Arc */}
      <svg
        className="w-full max-w-[460px] h-full"
        viewBox="0 0 480 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient for Arc: Hot Pink/Magenta -> Violet -> Sky Blue */}
          <linearGradient id="arcGlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="45%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          {/* Filter for arc neon glow */}
          <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Radial glow for pink node */}
          <radialGradient id="pinkGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F43F5E" stopOpacity="1" />
            <stop offset="60%" stopColor="#F43F5E" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
          </radialGradient>

          {/* Radial glow for blue node */}
          <radialGradient id="blueGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="1" />
            <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Faint Sphere Outer Rim Halo */}
        <circle
          cx="240"
          cy="230"
          r="155"
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* Geodesic Mesh Interconnecting Lines */}
        <g>
          {edges.map((edge, i) => (
            <line
              key={i}
              x1={edge.x1}
              y1={edge.y1}
              x2={edge.x2}
              y2={edge.y2}
              stroke="white"
              strokeOpacity={edge.opacity}
              strokeWidth="0.8"
            />
          ))}
        </g>

        {/* Sphere Dot Constellation */}
        <g>
          {points.map((pt, i) => (
            <circle
              key={i}
              cx={pt.projX}
              cy={pt.projY}
              r={pt.size}
              fill="white"
              fillOpacity={pt.opacity}
            />
          ))}
        </g>

        {/* Neon Glowing Arc connecting Start and End Nodes */}
        {/* Underglow Path */}
        <path
          d={arcPath}
          fill="none"
          stroke="url(#arcGlowGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.35"
          filter="url(#arcGlow)"
        />

        {/* Crisp Main Arc Path */}
        <path
          d={arcPath}
          fill="none"
          stroke="url(#arcGlowGradient)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* Start Node (Hot Pink on the left) */}
        {/* Outer pulse ring */}
        <circle
          cx={startPoint.x}
          cy={startPoint.y}
          r="11"
          fill="url(#pinkGlow)"
          opacity="0.8"
        />
        <circle
          cx={startPoint.x}
          cy={startPoint.y}
          r="6.5"
          fill="#121317"
          stroke="#F43F5E"
          strokeWidth="2"
        />
        <circle
          cx={startPoint.x}
          cy={startPoint.y}
          r="3"
          fill="#F43F5E"
        />
        <circle
          cx={startPoint.x}
          cy={startPoint.y}
          r="1.2"
          fill="#FFFFFF"
        />

        {/* End Node (Sky Blue on the right) */}
        {/* Outer pulse ring */}
        <circle
          cx={endPoint.x}
          cy={endPoint.y}
          r="11"
          fill="url(#blueGlow)"
          opacity="0.8"
        />
        <circle
          cx={endPoint.x}
          cy={endPoint.y}
          r="6.5"
          fill="#121317"
          stroke="#38BDF8"
          strokeWidth="2"
        />
        <circle
          cx={endPoint.x}
          cy={endPoint.y}
          r="3"
          fill="#38BDF8"
        />
        <circle
          cx={endPoint.x}
          cy={endPoint.y}
          r="1.2"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
};
