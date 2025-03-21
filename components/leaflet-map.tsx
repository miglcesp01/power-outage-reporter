"use client"

import { useEffect, useState } from "react"
// Do not import Leaflet directly here

export default function LeafletMap({
  position,
  setPosition,
}: {
  position: { lat: number; lng: number } | null
  setPosition: (position: { lat: number; lng: number }) => void
}) {
  const [map, setMap] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)
  const defaultPosition = position || { lat: 40.7128, lng: -74.006 }

  // Initialize the map
  useEffect(() => {
    // Import Leaflet dynamically only on the client
    const initializeMap = async () => {
      // Dynamic import of leaflet
      const L = await import("leaflet")
      await import("leaflet/dist/leaflet.css")

      // Fix the default icon issue
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      })

      // Check if map is already initialized
      if (!map) {
        // Create map instance
        const mapInstance = L.map("map").setView([defaultPosition.lat, defaultPosition.lng], 13)

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstance)

        // Add click event
        mapInstance.on("click", (e: any) => {
          const { lat, lng } = e.latlng
          setPosition({ lat, lng })
        })

        // Save map instance
        setMap(mapInstance)
      }
    }

    initializeMap()

    // Cleanup function
    return () => {
      if (map) {
        map.remove()
        setMap(null)
      }
    }
  }, []) // Empty dependency array to run only once

  // Handle marker updates
  useEffect(() => {
    const updateMarker = async () => {
      if (!map || !position) return

      // Remove existing marker if it exists
      if (marker) {
        marker.remove()
      }

      // Dynamic import of leaflet
      const L = await import("leaflet")

      // Add new marker
      const newMarker = L.marker([position.lat, position.lng]).addTo(map)
      setMarker(newMarker)

      // Center map on marker
      map.setView([position.lat, position.lng], map.getZoom())
    }

    updateMarker()
  }, [map, position])

  return <div id="map" style={{ height: "100%", width: "100%" }}></div>
}

