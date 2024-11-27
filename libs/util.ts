import { IDirectionApiResponse } from "@/interfaces/api-responses.interface";
import { ICoordinate } from "@/interfaces/location.interface";
import { decode } from "@googlemaps/polyline-codec";

export const makeWaypointsString = (waypoints: ICoordinate[]) => {
  return waypoints
    .map((waypoint) => {
      return `${waypoint.lat},${waypoint.lng}`;
    })
    .join("|");
};

export const makeRouteAndPoint = (data: IDirectionApiResponse) => {
  const routes = [];
  const points = [];

  for (let k = 0; k < data.routes.length; k++) {
    for (let j = 0; j < data.routes[k].legs.length; j++) {
      for (let i = 0; i < data.routes[k].legs[j].steps.length; i++) {
        const step = data.routes[k].legs[j].steps[i].polyline;
        const point = data.routes[k].legs[j].steps[i].start_location;

        const route = decode(step, 5);

        route.map((item) => {
          item.reverse();
        });

        routes.push(route);
        points.push(point);
      }
    }
  }

  const routeObj = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "MultiLineString",
          coordinates: routes,
        },
      },
    ],
  };

  const pointsObj = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "MultiPoint",
          coordinates: points,
        },
      },
    ],
  };

  return { routeObj, pointsObj };
};
