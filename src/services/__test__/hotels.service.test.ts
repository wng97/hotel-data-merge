import { beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import { getHotelsData, loadSupplierData } from "../hotels.service";
import sup1 from "./fakeRes/sup1.json";
import sup2 from "./fakeRes/sup2.json";
import sup3 from "./fakeRes/sup3.json";
import MockAdapter from "axios-mock-adapter";
import { afterEach } from "node:test";

const adapter = new MockAdapter(axios);
describe("Hotels Service", () => {
  beforeEach(() => {
    adapter
      .onGet("https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/acme")
      .reply(200, sup1);
    adapter
      .onGet("https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/patagonia")
      .reply(200, sup2);
    adapter
      .onGet("https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/paperflies")
      .reply(200, sup3);
  });
  afterEach(() => {
    adapter.restore();
  });

  it("should return supplier data with no error", async () => {
    // Test implementation
    const result = await getHotelsData();
    const suppliersData = await loadSupplierData();
    expect(suppliersData).toEqual({
      acme: sup1,
      patagonia: sup2,
      paperflies: sup3,
    });
    expect(result).toBe("success");
  });
  it("should return error if getHotelData returned error", async () => {
    // Test implementation
    adapter
      .onGet("https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/patagonia")
      .reply(500); // Internal Server Error

    try {
      await loadSupplierData();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
