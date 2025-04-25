"use client";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapViewProps {
  lat: number;
  lng: number;
  title: string;
}

export default function MapView({ lat, lng, title }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current!,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
      center: [lng, lat],
      zoom: 10,
    });

    const markerEl = document.createElement("div");
    markerEl.className = "custom-marker";
    markerEl.style.backgroundImage = "url('/marker-icon.png')";
    markerEl.style.width = "40px";
    markerEl.style.height = "40px";
    markerEl.style.backgroundSize = "cover";
    markerEl.style.borderRadius = "50%";

    const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
        <div class="text-sm p-2">
          <h3 class="text-base font-bold">${title}</h3>
          <p>Pinned Location</p>
        </div>
      `);

    map.on("load", () => {
      map.resize();
    });

    new maplibregl.Marker().setLngLat([lng, lat]).setPopup(popup).addTo(map);
    mapRef.current = map;
  }, [lat, lng, title]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[50vh] mt-4 rounded-lg border"
    />
  );
}
