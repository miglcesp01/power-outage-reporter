"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapComponentProps {
  position: { lat: number; lng: number } | null;
  setPosition: (position: { lat: number; lng: number }) => void;
  setAddress: (address: string) => void; // New prop to update the address
}

export default function MapComponent({ position, setPosition, setAddress }: MapComponentProps) {
  const [mapCenter] = useState<[number, number]>(position ? [position.lat, position.lng] : [40.7128, -74.006]);

  // Handle map click events
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });

        // Perform reverse geocoding to get the address
        fetchAddress(lat, lng);
      },
    });
    return null;
  }

  // Fetch address using OpenStreetMap Nominatim API
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            "User-Agent": "PowerOutageReporter/1.0 (your-email@example.com)", // Replace with your email
          },
        }
      );
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name); // Update the address in OutageReporter
      } else {
        setAddress("Address not found");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Error fetching address");
    }
  };

  useEffect(() => {
    if (position) {
      fetchAddress(position.lat, position.lng); // Fetch address when position is set initially
    }
  }, []);

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      className="rounded-md"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {position && <Marker position={[position.lat, position.lng]} />}
      <MapClickHandler />
    </MapContainer>
  );
}