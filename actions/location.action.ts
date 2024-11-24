/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { LocationWithAddress } from "@/interfaces/api-responses.interface";
import { IGetAddressFromLocationParams } from "@/interfaces/location.interface";
import { addressToGeocoding, geocodingToAddress } from "@/libs/neshan";
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
    return location;
  } catch (error) {
    throw new Error("Error while saving location");
  }
};

export const getAllLocationsAction = async () => {
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
};

export const deleteLocationAction = async (id: number) => {
  try {
    const exist = await prisma.location.findUnique({ where: { id } });
    if (!exist) return;
    await prisma.location.delete({
      where: {
        id,
      },
    });
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
