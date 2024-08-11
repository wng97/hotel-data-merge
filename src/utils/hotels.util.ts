import {
  Hotel,
  HotelImage,
  SupplierAcme,
  SupplierDataIntegrationBuilder,
  SupplierKey,
  SupplierPaperflies,
  SupplierPatagonia,
} from "../interfaces";
import * as cache from "memory-cache";

const acmeSupplierDataConverter: SupplierDataIntegrationBuilder = (
  supplierData: SupplierAcme[]
) => {
  return supplierData?.reduce((acc: Record<string, Partial<Hotel>>, hotel) => {
    acc[hotel.Id] = {
      id: hotel.Id,
      destination_id: hotel.DestinationId,
      name: hotel.Name ? hotel.Name.trim() : "",
      location: {
        address: hotel.Address ? hotel.Address.trim() : "",
        city: hotel.City ? hotel.City.trim() : "",
        country: hotel.Country ? hotel.Country.trim() : "",
        postal_code: hotel.PostalCode ? hotel.PostalCode.trim() : "",
        latitude:
          typeof hotel.Latitude === "number" ? hotel.Latitude : undefined,
        longitude:
          typeof hotel.Longitude === "number" ? hotel.Longitude : undefined,
      },
      description: hotel.Description ? hotel.Description.trim() : "",
      amenities: hotel.Facilities.map((facility) => facility.trim()),
      images: {},
      notes: [],
    };
    return acc;
  }, {});
};

const patagoniaSupplierDataConverter: SupplierDataIntegrationBuilder = (
  supplierData: SupplierPatagonia[]
) => {
  return supplierData.reduce((acc: Record<string, Partial<Hotel>>, hotel) => {
    acc[hotel.id] = {
      id: hotel.id,
      destination_id: hotel.destination,
      name: hotel.name ? hotel.name.trim() : "",
      location: {
        address: hotel.address ? hotel.address.trim() : "",
        latitude: hotel.lat ? hotel.lat : undefined,
        longitude: hotel.lng ? hotel.lng : undefined,
      },
      description: hotel.info ? hotel.info.trim() : "",
      amenities: hotel.amenities
        ? hotel.amenities.map((amenities) => amenities.trim())
        : [],
      images: {
        rooms: hotel.images.rooms.map((room) => {
          return {
            url: room.url,
            captions: room.description,
          };
        }),
        amenities: hotel.images.amenities.map((amenities) => {
          return {
            url: amenities.url,
            captions: amenities.description,
          };
        }),
      },
      notes: [],
    };
    return acc;
  }, {});
};

const paperfliesSupplierDataConverter: SupplierDataIntegrationBuilder = (
  supplierData: SupplierPaperflies[]
) => {
  // console.log(supplierData);
  return supplierData.reduce((acc: Record<string, Partial<Hotel>>, hotel) => {
    const amenities_general = hotel.amenities.general.map((amenities) =>
      amenities.trim()
    );

    const amenities_room = hotel.amenities.room.map((amenities) =>
      amenities.trim()
    );
    const consolidated_amenities = [...amenities_general, ...amenities_room];
    acc[hotel.hotel_id] = {
      id: hotel.hotel_id,
      destination_id: hotel.destination_id,
      name: hotel.hotel_name ? hotel.hotel_name.trim() : "",
      location: {
        address: hotel.location.address ? hotel.location.address.trim() : "",
        country: hotel.location.country ? hotel.location.country.trim() : "",
      },
      description: hotel.details ? hotel.details.trim() : "",
      amenities: consolidated_amenities,
      images: {
        rooms: hotel.images.rooms.map((room) => {
          return {
            url: room.link,
            captions: room.caption,
          };
        }),
        amenities: hotel.images.site.map((site) => {
          return {
            url: site.link,
            captions: site.caption,
          };
        }),
      },
      notes: hotel.booking_conditions.map((note) => note?.trim()),
    };
    return acc;
  }, {});
};

export const hotelDataIntegrationFactory: {
  [key in SupplierKey]: SupplierDataIntegrationBuilder;
} = {
  acme: acmeSupplierDataConverter,
  patagonia: patagoniaSupplierDataConverter,
  paperflies: paperfliesSupplierDataConverter,
};

export const mergeHotelData = (
  newSupplierData: Record<string, Partial<Hotel>>
) => {
  for (const [key, value] of Object.entries(newSupplierData)) {
    const existingHotel = cache.get(key) as Hotel;
    if (!existingHotel) {
      cache.put(key, value);
    } else {
      existingHotel.name = mergeValueByLength(existingHotel.name, value.name);
      existingHotel.location.address = mergeValueByLength(
        existingHotel.location.address ?? "",
        value.location?.address
      );
      existingHotel.location.city = mergeValueByLength(
        existingHotel.location.city ?? "",
        value.location?.city
      );
      existingHotel.location.country = mergeValueByLength(
        existingHotel.location.country ?? "",
        value.location?.country
      );
      existingHotel.location.postal_code = mergeValueByLength(
        existingHotel.location.postal_code ?? "",
        value.location?.postal_code
      );
      existingHotel.location.latitude = mergeLatitudeOrLongitude(
        existingHotel.location.latitude,
        value.location?.latitude
      );
      existingHotel.location.longitude = mergeLatitudeOrLongitude(
        existingHotel.location.longitude,
        value.location?.longitude
      );
      existingHotel.description = mergeValueByLength(
        existingHotel.description,
        value.description
      );
      existingHotel.amenities = mergeUniqueAmenities(
        existingHotel.amenities,
        value.amenities
      );
      existingHotel.images.rooms = mergeImages(
        existingHotel.images?.rooms,
        value.images?.rooms
      );
      existingHotel.images.amenities = mergeImages(
        existingHotel.images?.amenities,
        value.images?.amenities
      );
      existingHotel.notes = mergeNotes(existingHotel?.notes, value?.notes);
      cache.put(key, existingHotel);
    }
  }
};

const mergeValueByLength = (
  existingValue: string,
  newValue: string | undefined
) => {
  return !!newValue && newValue.length > existingValue.length
    ? newValue
    : existingValue;
};

const mergeLatitudeOrLongitude = (
  existingValue: number | undefined,
  value: number | undefined
) => {
  if (typeof existingValue === "number") {
    return existingValue;
  } else {
    return value;
  }
};

// To filter out duplicated amanities from diff suppliers
const mergeUniqueAmenities = (
  existingAmenities: string[],
  newAmenities: string[] | undefined
) => {
  const amenitiesMap = new Map();

  existingAmenities.forEach((item) => {
    const normalized = normalizeString(item);
    amenitiesMap.set(normalized, item);
  });

  newAmenities?.forEach((item) => {
    const normalized = normalizeString(item);
    amenitiesMap.set(normalized, item);
  });

  return Array.from(amenitiesMap.values());
};

// To lowercase and remove spaces
const normalizeString = (str: string) => {
  str.toLowerCase().replace(/\s/g, "");
};

const mergeImages = (
  existingImages: HotelImage[] | undefined,
  newImages: HotelImage[] | undefined
) => {
  const urlMap = new Map();

  existingImages?.forEach((image) => {
    urlMap.set(image.url, image);
  });

  newImages?.forEach((image) => {
    urlMap.set(image.url, image);
  });

  return Array.from(urlMap.values());
};

export const mergeNotes = (
  existingNotes: string[] | undefined,
  newNotes: string[] | undefined
): string[] => {
  if (existingNotes && newNotes) {
    return Array.from(new Set([...existingNotes, ...newNotes]));
  }
  if (!existingNotes && newNotes) {
    return newNotes;
  }
  if (existingNotes && !newNotes) {
    return existingNotes;
  }
  return [];
};
