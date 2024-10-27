import { Graph } from "@cosmograph/cosmos";
import React, { useCallback, useEffect, useState } from "react";
import { getPlanets } from "../services/planetPositionsService";
import "../styles/userProfile.css";

const toRadians = (degrees) => degrees * (Math.PI / 180);

const raToDegrees = (hours) => hours * 15; // 1 hour = 15 degrees

const planetDistancesFromSun = {
  mercury: 0.387,
  venus: 0.723,
  earth: 1,
  mars: 1.524,
  jupiter: 5.204,
  saturn: 9.582,
  uranus: 19.218,
  neptune: 30.11,
  pluto: 39.482,
  moon: 0.00257,
};

const getPlanetRadiusAU = (id) => {
  const sizes = {
    mercury: 0.0045,
    venus: 0.0047,
    earth: 0.000012,
    mars: 0.0099,
    jupiter: 0.05,
    saturn: 0.0001,
    uranus: 0.0663,
    neptune: 0.0354,
    pluto: 0.72,
    sun: 0.0047,
    moon: 0.000012,
  };
  return sizes[id.toLowerCase()] || 0.005;
};

const generateOrbit = (centerX, centerY, planetId, numPoints = 100) => {
  if (planetId.toLowerCase() === "moon") {
    return [];
  }
  const radius = planetDistancesFromSun[planetId.toLowerCase()] - getPlanetRadiusAU(planetId) * 10 || 1;
  const orbit = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (2 * Math.PI * i) / numPoints;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    orbit.push({ x, y });
  }
  return orbit;
};

const planetFunFacts = {
  mercury: "Mercury is the smallest planet in our Solar System.",
  venus: "Venus is the hottest planet in our Solar System.",
  earth: "Earth is the only planet known to support life.",
  mars: "Mars is known as the Red Planet.",
  jupiter: "Jupiter is the largest planet in our Solar System.",
  saturn: "Saturn is famous for its prominent ring system.",
  uranus: "Uranus rotates on its side.",
  neptune: "Neptune has the strongest winds in the Solar System.",
  pluto: "Pluto is now classified as a dwarf planet.",
  moon: "The Moon is Earth's only natural satellite.",
  sun: "The Sun is the star at the center of our Solar System.",
};

const Typewriter = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index++;
      if (index > text.length) {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [text]);

  return <p>{displayedText}</p>;
};

const PlanetPositionPage = () => {
  const [bodies, setBodies] = useState([]);
  const [graph, setGraph] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const fetchPlanetData = useCallback(async (selectedDate) => {
    try {
      const response = await getPlanets(selectedDate);

      const data = await response;

      const sunData = data.data.table.rows.find((entry) => entry.entry.name.toLowerCase() === "sun");

      // Sun's coordinates
      const sunDistanceFromEarthAU = parseFloat(sunData.cells[0].distance.fromEarth.au);
      const sunRightAscensionHours = parseFloat(sunData.cells[0].position.equatorial.rightAscension.hours);
      const sunDeclinationDegrees = parseFloat(sunData.cells[0].position.equatorial.declination.degrees);

      const sunRaRadians = toRadians(raToDegrees(sunRightAscensionHours));
      const sunDecRadians = toRadians(sunDeclinationDegrees);

      const sunX = sunDistanceFromEarthAU * Math.cos(sunDecRadians) * Math.cos(sunRaRadians);
      const sunY = sunDistanceFromEarthAU * Math.cos(sunDecRadians) * Math.sin(sunRaRadians);
      const sunZ = sunDistanceFromEarthAU * Math.sin(sunDecRadians);

      const orbitNodes = [];
      const planetNodes = new Set();

      let earthPosition = null;

      data.data.table.rows.forEach((entry) => {
        const distanceFromEarthAU = parseFloat(entry.cells[0].distance.fromEarth.au);
        const rightAscensionHours = parseFloat(entry.cells[0].position.equatorial.rightAscension.hours);
        const declinationDegrees = parseFloat(entry.cells[0].position.equatorial.declination.degrees);

        const raRadians = toRadians(raToDegrees(rightAscensionHours));
        const decRadians = toRadians(declinationDegrees);

        const x = distanceFromEarthAU * Math.cos(decRadians) * Math.cos(raRadians) - sunX;
        const y = distanceFromEarthAU * Math.cos(decRadians) * Math.sin(raRadians) - sunY;
        const z = distanceFromEarthAU * Math.sin(decRadians) - sunZ;

        if (entry.entry.id.toLowerCase() === "earth") {
          earthPosition = { x, y, z };
        }

        if (!orbitNodes.some((node) => node.id.startsWith(entry.entry.id)) && entry.entry.id.toLowerCase() !== "moon") {
          const orbitPoints = generateOrbit(0, 0, entry.entry.id).map((point, index) => ({
            id: `${entry.entry.id}_orbit_${index}`,
            label: `${entry.entry.name} Orbit`,
            x: point.x,
            y: point.y,
            z: 0,
            color: "gray",
            size: 1,
            isOrbitNode: true,
          }));
          orbitNodes.push(...orbitPoints);
        }

        planetNodes.add({
          id: entry.entry.id,
          label: entry.entry.name,
          x: x,
          y: y,
          z: z,
          color: getColor(entry.entry.id),
          size: getSize(entry.entry.id),
        });
      });

      const moonData = data.data.table.rows.find((entry) => entry.entry.id.toLowerCase() === "moon");
      if (earthPosition && moonData) {
        const moonDistanceFromEarthAU = parseFloat(moonData.cells[0].distance.fromEarth.au);
        const moonRightAscensionHours = parseFloat(moonData.cells[0].position.equatorial.rightAscension.hours);
        const moonDeclinationDegrees = parseFloat(moonData.cells[0].position.equatorial.declination.degrees);

        const moonRaRadians = toRadians(raToDegrees(moonRightAscensionHours));
        const moonDecRadians = toRadians(moonDeclinationDegrees);

        const scaleFactor = 100;
        const moonX = scaleFactor * moonDistanceFromEarthAU * Math.cos(moonDecRadians) * Math.cos(moonRaRadians);
        const moonY = scaleFactor * moonDistanceFromEarthAU * Math.cos(moonDecRadians) * Math.sin(moonRaRadians);
        const moonZ = scaleFactor * moonDistanceFromEarthAU * Math.sin(moonDecRadians);

        planetNodes.add({
          id: "moon",
          label: "Moon",
          x: earthPosition.x + moonX,
          y: earthPosition.y + moonY,
          z: earthPosition.z + moonZ,
          color: getColor("moon"),
          size: getSize("moon"),
        });
      }

      planetNodes.add({
        id: "sun",
        label: "Sun",
        x: 0,
        y: 0,
        z: 0,
        color: getColor("sun"),
        size: getSize("sun"),
      });

      setBodies([...orbitNodes, ...Array.from(planetNodes)]);
    } catch (error) {
      console.error("Error fetching planet data:", error);
    }
  }, []);

  useEffect(() => {
    fetchPlanetData(date);
  }, [date, fetchPlanetData]);

  useEffect(() => {
    if (!graph) {
      const canvas = document.getElementById("cosmos-container");
      const newGraph = new Graph(canvas, {
        simulation: {
          repulsion: 0,
          centeringForce: 0.5,
        },
        renderLinks: false,
        nodeGreyoutOpacity: 1,
        nodeColor: (node) => (node.isOrbitNode ? "gray" : node.color || "white"),
        nodeSize: (node) => (node.isOrbitNode ? 1 : node.size || 5),
        events: {
          onClick: (node) => {
            if (node && !node.isOrbitNode) {
              setSelectedPlanet(node);
            } else {
              setSelectedPlanet(null);
            }
          },
        },
      });

      setGraph(newGraph);
    }
  }, [graph]);

  useEffect(() => {
    if (graph && bodies.length > 0) {
      graph.setData(bodies, []);

      const sun = bodies.find((body) => body.id === "sun");

      if (sun) {
        graph.zoomToNodeById(sun.id, 1);
        graph.selectNodeById(sun.id);
      }
    }
  }, [graph, bodies]);

  const getColor = (id) => {
    const colors = {
      mercury: "gray",
      venus: "yellow",
      earth: "blue",
      mars: "red",
      jupiter: "orange",
      saturn: "goldenrod",
      uranus: "lightseagreen",
      neptune: "darkblue",
      pluto: "lightgray",
      moon: "white",
      sun: "orange",
    };
    return colors[id.toLowerCase()] || "white";
  };

  const getSize = (id) => {
    const sizes = {
      mercury: 10,
      venus: 12,
      earth: 14,
      mars: 12,
      jupiter: 20,
      saturn: 18,
      uranus: 16,
      neptune: 14,
      pluto: 8,
      moon: 6,
      sun: 20,
    };
    return sizes[id.toLowerCase()] || 5;
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const incrementDate = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    setDate(newDate.toISOString().split("T")[0]);
  };

  const decrementDate = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    setDate(newDate.toISOString().split("T")[0]);
  };

  return (
    <div className="text-center" style={{ backgroundColor: "#222", position: "relative", height: "100vh" }}>
      <h1 style={{ color: "#fff" }}>Planetary Visualization</h1>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <button onClick={decrementDate} style={{ width: "70px" }}>
          -1 Day
        </button>
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          className="custom-date-input"
          style={{ margin: "0 10px", width: "140px", backgroundColor: "#222", color: "#fff", borderColor: "black" }}
        />
        <button onClick={incrementDate} style={{ width: "70px" }}>
          +1 Day
        </button>
      </div>
      <canvas id="cosmos-container" style={{ width: "100%", height: "calc(100vh - 140px)" }}></canvas>
      {selectedPlanet && !selectedPlanet.isOrbitNode && (
        <div
          className="planet-card"
          style={{
            position: "absolute",
            bottom: "120px",
            left: "10px",
            width: "300px",
            backgroundColor: "#444",
            color: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            transform: "translateY(0)",
          }}
        >
          <h2>
            <Typewriter text={selectedPlanet.label} />
          </h2>
          <Typewriter text={planetFunFacts[selectedPlanet.id.toLowerCase()] || "No fun facts available."} />
          <button onClick={() => setSelectedPlanet(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default PlanetPositionPage;
