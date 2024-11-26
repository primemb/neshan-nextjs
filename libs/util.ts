import { ICoordinate } from "@/interfaces/location.interface";

export const makeWaypointsString = (waypoints: ICoordinate[]) => {
  return waypoints
    .map((waypoint) => {
      return `${waypoint.lat},${waypoint.lng}`;
    })
    .join("|");
};
