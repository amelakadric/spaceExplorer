import { Graph } from "@cosmograph/cosmos";
import React, { useEffect, useState } from "react";

// Helper function to convert degrees to radians
const toRadians = (degrees) => degrees * (Math.PI / 180);

// Helper function to convert right ascension (hours) to degrees
const raToDegrees = (hours) => hours * 15; // 1 hour = 15 degrees

// Helper function to generate orbit points
const generateOrbit = (centerX, centerY, radius, numPoints = 100) => {
  const orbit = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (2 * Math.PI * i) / numPoints;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    orbit.push({ x, y });
  }
  return orbit;
};

const PlanetPositionPage = () => {
  const [bodies, setBodies] = useState([]);
  const [graph, setGraph] = useState(null); // Track the graph instance

  useEffect(() => {
    // Fetch planet data from the API
    const fetchPlanetData = async () => {
      try {
        const response = await fetch(
          "https://api.astronomyapi.com/api/v2/bodies/positions?longitude=-84.39733&latitude=33.775867&elevation=1&from_date=2024-09-19&to_date=2024-09-19&time=01%3A42%3A38",
          {
            method: "GET",
            headers: {
              Authorization:
                "Basic MTY1YTkwYzgtMWI1ZS00ZDQ1LWJiMWUtMTUwOWQ1YTRhODIxOjAxNGM0ZWUyZjE3ZDA1NWE4MTc1ZjQzMDg2NGY0M2U1YjkyMzcyMzVkZTQwNDA2Zjc2NzMzYmE2YzJiNTUxMTgzMmM3NWM3MzIwMmE5YjRiOWYyMmIwOGUzMjM0OGE5NjliMzUxZThlOWRiYjE2ZWIxMDJhZDRkMDU5YTFjNGNjYjBmNjFhYmYxM2UyMzlhMWJhODY2M2Q5ZTA1MDZkY2E5ZGIyZjgyOWNhMGUxZGQwYjI2MjVmMWE4ZGEwYWYyMDdkMzQ3NzUyYzBlODJkMTE2NmFiNjQwY2Q0ZDVjYzVm",
            },
          }
        );
        const data = await response.json();

        // Find the Sun's data to use its position as the origin
        const sunData = data.data.table.rows.find((entry) => entry.entry.name.toLowerCase() === "sun");

        // Get the Sun's Cartesian coordinates
        const sunDistanceFromEarthAU = parseFloat(sunData.cells[0].distance.fromEarth.au);
        const sunRightAscensionHours = parseFloat(sunData.cells[0].position.equatorial.rightAscension.hours);
        const sunDeclinationDegrees = parseFloat(sunData.cells[0].position.equatorial.declination.degrees);

        const sunRaRadians = toRadians(raToDegrees(sunRightAscensionHours));
        const sunDecRadians = toRadians(sunDeclinationDegrees);

        const sunX = sunDistanceFromEarthAU * Math.cos(sunDecRadians) * Math.cos(sunRaRadians);
        const sunY = sunDistanceFromEarthAU * Math.cos(sunDecRadians) * Math.sin(sunRaRadians);
        const sunZ = sunDistanceFromEarthAU * Math.sin(sunDecRadians);

        // Format the planet data with orbits centered around the Sun
        const formattedBodies = data.data.table.rows.flatMap((entry) => {
          const distanceFromEarthAU = parseFloat(entry.cells[0].distance.fromEarth.au);
          const distanceFromSunAU = distanceFromEarthAU; // Distance from Sun

          // Extract right ascension (RA) and declination (Dec)
          const rightAscensionHours = parseFloat(entry.cells[0].position.equatorial.rightAscension.hours);
          const declinationDegrees = parseFloat(entry.cells[0].position.equatorial.declination.degrees);

          // Convert RA to degrees and both RA and Dec to radians
          const raRadians = toRadians(raToDegrees(rightAscensionHours));
          const decRadians = toRadians(declinationDegrees);

          // Convert spherical coordinates to Cartesian coordinates
          const x = distanceFromSunAU * Math.cos(decRadians) * Math.cos(raRadians) - sunX;
          const y = distanceFromSunAU * Math.cos(decRadians) * Math.sin(raRadians) - sunY;
          const z = distanceFromSunAU * Math.sin(decRadians) - sunZ;

          // Generate orbit nodes around the Sun
          const orbitNodes = generateOrbit(0, 0, distanceFromSunAU).map((point, index) => ({
            id: `${entry.entry.id}_orbit_${index}`,
            label: `${entry.entry.name} Orbit`,
            x: point.x,
            y: point.y,
            z: 0, // Keep orbits on the same plane for simplicity
            color: "gray", // Color for the orbit path
            size: 1, // Small size for orbit nodes
            isOrbitNode: true, // Flag to identify orbit nodes
          }));

          return [
            {
              id: entry.entry.id,
              label: entry.entry.name,
              x: x, // Planet position relative to Sun
              y: y,
              z: z,
              color: getColor(entry.entry.id),
              size: getSize(entry.entry.id),
            },
            ...orbitNodes, // Include orbit nodes
          ];
        });

        // Include the Sun as the center node
        formattedBodies.push({
          id: "sun",
          label: "Sun",
          x: 0, // Center the Sun at origin
          y: 0,
          z: 0,
          color: getColor("sun"),
          size: getSize("sun"),
        });

        setBodies(formattedBodies);
      } catch (error) {
        console.error("Error fetching planet data:", error);
      }
    };

    fetchPlanetData();
  }, []);

  useEffect(() => {
    // Initialize Graph after component mounts and when bodies data is updated
    if (!graph) {
      const canvas = document.getElementById("cosmos-container");
      const newGraph = new Graph(canvas, {
        simulation: {
          repulsion: 0, // No repulsion, as planets are fixed in orbit
          centeringForce: 0.5, // Ensure everything stays centered
        },
        renderLinks: false, // No need for links between nodes
        nodeGreyoutOpacity: 1, // Set opacity to 1 to remove shadow effect
        nodeColor: (node) => (node.isOrbitNode ? "gray" : node.color || "white"), // Set colors based on the node data
        nodeSize: (node) => (node.isOrbitNode ? 1 : node.size || 5), // Small size for orbit nodes
        events: {
          onClick: (node) => console.log("Clicked node: ", node),
        },
      });

      setGraph(newGraph);
    }
  }, [graph]);

  useEffect(() => {
    if (graph && bodies.length > 0) {
      // Set the graph data, including the Sun and planets
      graph.setData(bodies, []);

      // Find the Sun's position
      const sun = bodies.find((body) => body.id === "sun");

      if (sun) {
        // Center the view and zoom on the Sun
        graph.zoomToNodeById(sun.id, 2); // Zoom level 2, can be adjusted
        graph.selectNodeById(sun.id); // Select Sun node
      }
    }
  }, [graph, bodies]); // Run the effect when graph and bodies are available

  // Helper functions for getting color and size based on body id
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
      pluto: "lightgray", // Include Pluto if needed
      sun: "orange",
    };
    return colors[id] || "white";
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
      pluto: 8, // Include Pluto if needed
      sun: 20, // Larger size for the Sun
    };
    return sizes[id] || 5;
  };

  return (
    <div>
      <h1>Planetary Visualization</h1>
      <canvas id="cosmos-container" style={{ width: "100%", height: "600px" }}></canvas>
    </div>
  );
};

export default PlanetPositionPage;
