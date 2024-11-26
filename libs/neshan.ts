import {
  IAdrressToLocation,
  IDirectionApiResponse,
  ILocationToAddress,
  ITSPApiParams,
  ITSPApiResponse,
} from "@/interfaces/api-responses.interface";
import {
  ICoordinate,
  IGetAddressFromLocationParams,
} from "@/interfaces/location.interface";
import { makeWaypointsString } from "./util";

export const geocodingToAddress = async ({
  lat,
  lng,
}: IGetAddressFromLocationParams) => {
  const response = await fetch(
    `${process.env.NESHAN_API_URL}v5/reverse?lat=${lat}&lng=${lng}`,
    {
      headers: {
        "Api-Key": process.env.NESHAN_API_KEY as string,
        "Content-Type": "application/json",
      },
    }
  );
  return (await response.json()) as ILocationToAddress;
};

export const addressToGeocoding = async (adrress: string) => {
  const response = await fetch(
    `${process.env.NESHAN_API_URL}v6/geocoding?address=${adrress}`,
    {
      headers: {
        "Api-Key": process.env.NESHAN_API_KEY as string,
        "Content-Type": "application/json",
      },
    }
  );

  return (await response.json()) as IAdrressToLocation;
};

export const tspApi = async ({
  waypoints,
  sourceIsAnyPoint,
}: ITSPApiParams) => {
  const waypointsString = makeWaypointsString(waypoints);

  const params = new URLSearchParams({
    waypoints: waypointsString,
    sourceIsAnyPoint: sourceIsAnyPoint.toString(),
  });
  const response = await fetch(
    `${process.env.NESHAN_API_URL}v3/trip?${params.toString()}`,
    {
      headers: {
        "Api-Key": process.env.NESHAN_API_KEY as string,
        "Content-Type": "application/json",
      },
    }
  );

  return (await response.json()) as ITSPApiResponse;
};

export const directionApi = async (
  origin: ICoordinate,
  destination: ICoordinate,
  waypoints: ICoordinate[]
) => {
  const waypointsString = makeWaypointsString(waypoints);

  const params = new URLSearchParams({
    origin: `${origin.lat},${origin.lng}`,
    destination: `${destination.lat},${destination.lng}`,
    waypoints: waypointsString,
  });

  const response = await fetch(
    `${process.env.NESHAN_API_URL}v4/direction?${params.toString()}`,
    {
      headers: {
        "Api-Key": process.env.NESHAN_API_KEY as string,
        "Content-Type": "application/json",
      },
    }
  );

  return (await response.json()) as IDirectionApiResponse;
};
