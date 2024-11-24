import {
  IAdrressToLocation,
  ILocationToAddress,
} from "@/interfaces/api-responses.interface";
import { IGetAddressFromLocationParams } from "@/interfaces/location.interface";

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
