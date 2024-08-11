import { Request, Response } from "express";
import { z } from "zod";
import { getHotelsData } from "../services";
import * as cache from "memory-cache";
import { getHotelsDataSchema } from "../interfaces";

export const getHotels = async (req: Request, res: Response) => {
  const getHotelsSchema = z
    .object({
      ids: z.array(z.string()),
      destination_id: z.number(),
    })
    .partial()
    .refine(
      ({ ids, destination_id }) =>
        (!!ids && ids.length > 0) || !!destination_id,
      { message: "ids or destination_id is required" }
    );

  const reqBody = getHotelsSchema.parse(req.body);

  await getHotelsData()
    .then(() => {
      getHotelsByCondition(reqBody, res);
    })
    .catch((err: unknown) => {
      if (typeof err === "string") {
        res.status(400).send(err);
      }
      res.status(500).json((err as Error).message);
    });
};

const getHotelsByCondition = (reqBody: getHotelsDataSchema, res: Response) => {
  if (reqBody.ids?.length) {
    console.log("getHotelsByIds");
    const hotels = reqBody.ids.map((id) => cache.get(id) ?? {});
    res.status(200).json(hotels);
  } else {
    const hotels = cache
      .keys()
      .map((key) => cache.get(key))
      .filter((hotel) => hotel.destination_id === reqBody.destination_id);
    res.status(200).json(hotels);
  }
};
