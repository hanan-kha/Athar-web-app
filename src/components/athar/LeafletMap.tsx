import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Loc = {
  id: string;
  name: string;
  name_ar: string | null;
  latitude: number;
  longitude: number;
  category: string;
};

const brandIcon = L.divIcon({
  className: "athar-pin",
  html: `<div style="width:32px;height:32px;border-radius:50%;background:#7D5A3C;border:3px solid white;box-shadow:0 4px 10px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;color:white;font-size:14px">📍</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function LeafletMap({
  view,
  tileUrl,
  tileAttr,
  locations,
  onSelect,
}: {
  view: string;
  tileUrl: string;
  tileAttr: string;
  locations: Loc[];
  onSelect?: (id: string) => void;
}) {
  const palestineBounds = L.latLngBounds([29.3, 34.2], [33.4, 35.9]);
  return (
    <MapContainer
      center={[31.9, 35.2]}
      zoom={8}
      minZoom={7}
      maxZoom={16}
      maxBounds={palestineBounds}
      maxBoundsViscosity={1}
      scrollWheelZoom
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer key={view} url={tileUrl} attribution={tileAttr} />
      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={[loc.latitude, loc.longitude]}
          icon={brandIcon}
          eventHandlers={{
            click: () => onSelect?.(loc.id),
          }}
        >
          <Popup>
            <div className="min-w-[180px]">
              <p className="font-serif font-bold text-sm">{loc.name}</p>
              <p className="font-arabic text-sm">{loc.name_ar}</p>
              <p className="text-xs text-muted-foreground mt-1">{loc.category}</p>
              <button
                onClick={() => onSelect?.(loc.id)}
                className="inline-block mt-2 text-xs font-semibold text-brand"
              >
                View details →
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}