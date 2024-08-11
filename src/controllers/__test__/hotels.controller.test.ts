import { describe, it, vi, expect } from "vitest";
import { createRequest, createResponse } from "node-mocks-http";
import { getHotels } from "../hotels.controller";
import * as hotelsService from "../../services";

describe("Hotels Controller", () => {
  const res = createResponse();

  it("should return hotel based on the provided ID", async () => {
    const fakeRequest = createRequest({
      body: {
        ids: ["iJhz"],
      },
    });
    const getHotelsDataMock = vi
      .spyOn(hotelsService, "getHotelsData")
      .mockResolvedValue("success");
    await getHotels(fakeRequest, res);
    expect(getHotelsDataMock).toHaveBeenCalledOnce();
  });
  it("should return error if getHotelData returned error", async () => {
    const fakeRequest = createRequest({
      body: {
        ids: ["iJhz"],
      },
    });
    const getHotelsDataMock = vi
      .spyOn(hotelsService, "getHotelsData")
      .mockRejectedValue("error");
    await getHotels(fakeRequest, res);
    expect(getHotelsDataMock).toHaveBeenCalledOnce();
    expect(res.statusCode).toBe(500);
  });
  it("should return list of hotels based on the destination_id", async () => {
    const fakeRequest = createRequest({
      body: {
        destination_id: 5432,
      },
    });
    const getHotelsDataMock = vi
      .spyOn(hotelsService, "getHotelsData")
      .mockResolvedValue("success");
    await getHotels(fakeRequest, res);
    expect(getHotelsDataMock).toHaveBeenCalledOnce();
  });
});
