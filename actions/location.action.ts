"use server";

import {
  ILocationToAddress,
  LocationWithAddress,
} from "@/interfaces/api-responses.interface";
import prisma from "@/libs/prisma";

interface IGetAddressFromLocationParams {
  lat: number;
  lng: number;
}

export const saveNewlocation = async ({
  lat,
  lng,
}: IGetAddressFromLocationParams) => {
  try {
    const response = await fetch(
      `${process.env.NESHAN_API_URL}reverse?lat=${lat}&lng=${lng}`,
      {
        headers: {
          "Api-Key": process.env.NESHAN_API_KEY as string,
          "Content-Type": "application/json",
        },
      }
    );
    const data = (await response.json()) as ILocationToAddress;
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
    return location;
  } catch (error) {
    console.error(error);
    throw new Error("Error while saving location");
  }
};

export const getAllLocations = async () => {
  try {
    const locations: LocationWithAddress[] = await prisma.location.findMany({
      include: {
        address: true,
      },
    });
    return locations;
  } catch (error) {
    console.error(error);
    throw new Error("Error while fetching locations");
  }
};

export const deleteLocation = async (id: number) => {
  try {
    await prisma.location.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error while deleting location");
  }
};
