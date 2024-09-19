import { Graph } from "@cosmograph/cosmos";
import React, { useEffect, useState } from "react";

// Helper function to convert degrees to radians
const toRadians = (degrees) => degrees * (Math.PI / 180);

// Helper function to convert right ascension (hours) to degrees
const raToDegrees = (hours) => hours * 15; // 1 hour = 15 degrees

const PlanetPositionPage = () => {
  const [bodies, setBodies] = useState([]);

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

        // Extract and format the planet data, including the Sun
        const formattedBodies = data.data.table.rows.map((entry) => {
          const distanceFromEarthAU = parseFloat(entry.cells[0].distance.fromEarth.au);
          const distanceFromSunAU = distanceFromEarthAU; // No special treatment for the Sun

          // Extract right ascension (RA) and declination (Dec)
          const rightAscensionHours = parseFloat(entry.cells[0].position.equatorial.rightAscension.hours);
          const declinationDegrees = parseFloat(entry.cells[0].position.equatorial.declination.degrees);

          // Convert RA to degrees and both RA and Dec to radians
          const raRadians = toRadians(raToDegrees(rightAscensionHours));
          const decRadians = toRadians(declinationDegrees);

          // Convert spherical coordinates to Cartesian coordinates
          const x = distanceFromSunAU * Math.cos(decRadians) * Math.cos(raRadians);
          const y = distanceFromSunAU * Math.cos(decRadians) * Math.sin(raRadians);
          const z = distanceFromSunAU * Math.sin(decRadians);

          return {
            id: entry.entry.id,
            label: entry.entry.name,
            x: x, // Use calculated position for the Sun as well
            y: y,
            z: z,
            color: getColor(entry.entry.id),
            size: getSize(entry.entry.id),
          };
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
    const graph = new Graph(document.getElementById("cosmos-container"), {
      simulation: {
        repulsion: 0, // No repulsion, as planets are fixed in orbit
        centeringForce: 0.5, // Ensure everything stays centered
      },
      renderLinks: false, // No need for links between nodes
      nodeColor: (node) => node.color || "white", // Set colors based on the node data
      nodeSize: (node) => node.size || 5, // Increase planet size
      events: {
        onClick: (node) => console.log("Clicked node: ", node),
      },
    });

    if (bodies.length > 0) {
      // Set the graph data, including the Sun and planets
      graph.setData(bodies, []);
    }
  }, [bodies]);

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
