import axios from "axios";
import {
  SupplierAcme,
  SupplierKey,
  SupplierPaperflies,
  SupplierPatagonia,
} from "../interfaces";
import { hotelDataIntegrationFactory, mergeHotelData } from "../utils";

export const getHotelsData = async () => {
  const suppliersData = await loadSupplierData();

  // console.log("supppppp");
  // console.log(suppliersData);
  supplierDataIntegration(suppliersData);
  return "success";
};

export const loadSupplierData = async () => {
  const supplierUrls = [
    "https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/acme",
    "https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/patagonia",
    "https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/paperflies",
  ];
  const responses = await Promise.all(
    supplierUrls.map((url) => axios.get(url))
  ).catch((err) => {
    throw new Error(err);
  });

  // format data to key and value pair
  return responses.reduce((acc: any, { data }, index) => {
    if (index === 0) {
      acc.acme = data as SupplierAcme[];
    } else if (index === 1) {
      acc.patagonia = data as SupplierPatagonia[];
    } else if (index === 2) {
      acc.paperflies = data as SupplierPaperflies[];
    }

    return acc;
  }, {});
};

export const supplierDataIntegration = (supplierData: {
  [key in SupplierKey]: SupplierAcme[] &
    SupplierPatagonia[] &
    SupplierPaperflies[];
}) => {
  for (const [key, value] of Object.entries(supplierData) as [
    SupplierKey,
    SupplierAcme[] & SupplierPatagonia[] & SupplierPaperflies[]
  ][]) {
    const formatedData = hotelDataIntegrationFactory[key]?.(value);
    mergeHotelData(formatedData);
  }
};
