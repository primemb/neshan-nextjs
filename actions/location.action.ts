/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { LocationWithAddress } from "@/interfaces/api-responses.interface";
import {
  ICoordinate,
  IGetAddressFromLocationParams,
} from "@/interfaces/location.interface";
import {
  addressToGeocoding,
  directionApi,
  geocodingToAddress,
  tspApi,
} from "@/libs/neshan";
import prisma from "@/libs/prisma";

export const saveNewlocationAction = async ({
  lat,
  lng,
}: IGetAddressFromLocationParams) => {
  try {
    const data = await geocodingToAddress({ lat, lng });
    const location: LocationWithAddress = await prisma.location.create({
      data: {
        latitude: lat,
        longitude: lng,
        address: {
          create: {
            formatted_address: data.formatted_address,
            route_name: data.route_name,
            route_type: data.route_type,
            neighbourhood: data.neighbourhood,
            city: data.city,
            state: data.state,
            place: data.place,
            municipality_zone: data.municipality_zone,
            in_traffic_zone: data.in_traffic_zone,
            in_odd_even_zone: data.in_odd_even_zone,
            village: data.village ? data.village : undefined,
            county: data.county,
            district: data.district,
          },
        },
      },
      include: {
        address: true,
      },
    });
    revalidateTag("locations");
    return location;
  } catch (error) {
    throw new Error("Error while saving location");
  }
};

export const getAllLocationsAction = unstable_cache(
  async () => {
    try {
      const locations: LocationWithAddress[] = await prisma.location.findMany({
        include: {
          address: true,
        },
      });
      return locations;
    } catch (error) {
      throw new Error("Error while fetching locations");
    }
  },
  ["locations"],
  {
    tags: ["locations"],
  }
);

export const deleteLocationAction = async (id: number) => {
  try {
    const exist = await prisma.location.findUnique({
      where: { id },
      include: { address: true },
    });
    if (!exist) return;
    await prisma.$transaction([
      prisma.location.delete({
        where: {
          id,
        },
      }),
      prisma.address.deleteMany({
        where: {
          id: exist.address?.id,
        },
      }),
    ]);
    revalidateTag("locations");
  } catch (error) {
    console.log(error);
    throw new Error("Error while deleting location");
  }
};

export const addLocationFromAddressAction = async (
  address: string
): Promise<LocationWithAddress | { error: string }> => {
  if (!address) return { error: "آدرس نمی تواند خالی باشد" };

  try {
    const data = await addressToGeocoding(address);

    if (data.status !== "OK") {
      return { error: "آدرس مورد نظر یافت نشد" };
    }

    return await saveNewlocationAction({
      lat: data.location.y,
      lng: data.location.x,
    });
  } catch (error) {
    return { error: "مشکلی پیش آمد مجدد امتحان کنید" };
  }
};

export const directionInfoAction = async (
  start: ICoordinate | null,
  locations: ICoordinate[]
) => {
  const tspLocations = await tspApi({
    waypoints: locations,
    sourceIsAnyPoint: false,
  });

  let origin: ICoordinate = { lat: 0, lng: 0 };
  if (start) {
    origin = {
      lat: start.lat,
      lng: start.lng,
    };
  } else {
    origin = {
      lat: tspLocations.points[0].location[0],
      lng: tspLocations.points[0].location[1],
    };
  }

  const destination = {
    lat: tspLocations.points[tspLocations.points.length - 1].location[0],
    lng: tspLocations.points[tspLocations.points.length - 1].location[1],
  };

  const waypoints = tspLocations.points.slice(
    1,
    tspLocations.points.length - 1
  );

  const directions = await directionApi(
    origin,
    destination,
    waypoints.map((point) => ({
      lat: point.location[0],
      lng: point.location[1],
    }))
  );

  return directions;
};
