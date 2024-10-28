import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";



interface MapProps {
  lat: number;
  lon: number;
}

export const Map: React.FC<MapProps> = ({ lat, lon }) => {
  return (
    <MapContainer
      center={[lat, lon]}
      zoom={5}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lon]} >
        <Popup>
          Location: {lat}, {lon}
        </Popup>
      </Marker>
    </MapContainer>
  );
};
