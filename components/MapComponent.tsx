import React, { FC } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

const DEFAULT_ZOOM = 8;
const DEFAULT_SCROLL_WHEEL_ZOOM = true;

interface MapComponentProps {
  lists: Array<Array<any>>;
  pos: [number, number];
  zoom?: number;
  scrollWheelZoom?: boolean;
}

const MapComponent: FC<MapComponentProps> = ({
  lists,
  pos,
  zoom = DEFAULT_ZOOM,
  scrollWheelZoom = DEFAULT_SCROLL_WHEEL_ZOOM,
}) => (
  <MapContainer
    style={{ height: '600px' }}
    center={pos}
    zoom={zoom}
    scrollWheelZoom={scrollWheelZoom}
  >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {lists.map(list => list
      .map(({ id, coordinates, name }) => {
        if (!id || !coordinates) return null

        return (
          <Marker
            key={id}
            position={coordinates}
          >
            <Popup>
              {name}
            </Popup>
          </Marker>
        )
      }))}
  </MapContainer>
)

export default MapComponent