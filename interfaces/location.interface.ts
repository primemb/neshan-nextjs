export interface ICoordinate {
  lat: number;
  lng: number;
}

export type IGetAddressFromLocationParams = ICoordinate;

export interface GeoLocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
}
