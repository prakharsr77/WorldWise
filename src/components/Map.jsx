import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "./Button";

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([28.6448, 77.216721]);
  // const [isMapMoved, setIsMapMoved] = useState(true);
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();
  const [mapLat, mapLng] = useUrlPosition();

  useEffect(
    function () {
      if (mapLat && mapLng)
        setMapPosition([parseFloat(mapLat), parseFloat(mapLng)]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geolocationPosition)
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    },
    [geolocationPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {mapPosition[0] !== geolocationPosition?.lat &&
        mapPosition[1] !== geolocationPosition?.lng && (
          <Button
            type="position"
            onClick={getPosition}
            isLoading={isLoadingPosition}
          >
            {isLoadingPosition ? (
              <>
                <span className={`${styles.icon} ${styles.loading}`}>⏳</span>{" "}
                Finding Your Location...
              </>
            ) : (
              <>
                <span className={styles.icon}>📍</span> Find My Location
              </>
            )}
          </Button>
        )}
      <MapContainer
        center={mapPosition}
        zoom={7}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          noWrap={true}
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition}></ChangeCenter>
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position: [lat, lng] }) {
  const map = useMap();
  map.closePopup();
  map.setView([parseFloat(lat), parseFloat(lng)]);
  return null;
}

function DetectClick({ geolocationPosition, setIsMapMoved }) {
  const navigate = useNavigate();
  // const map = useMap();

  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
    // {
    //   replace: true,
    // }),
    // moveend: () => {
    //   const center = map.getCenter();
    //   const hasMoved =
    //     center.lat !== geolocationPosition?.lat ||
    //     center.lng !== geolocationPosition?.lng;
    //   setIsMapMoved(hasMoved);
    // },
  });
  return null;
}

export default Map;
