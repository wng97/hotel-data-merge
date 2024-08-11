export interface getHotelsDataSchema {
  ids?: string[];
  destination_id?: number;
}

export interface SupplierAcme {
  Id: string;
  DestinationId: number;
  Name: string;
  Latitude?: number | null | string;
  Longitude?: number | null | string;
  Address: string;
  City: string;
  Country: string;
  PostalCode: string;
  Description: string;
  Facilities: string[];
}

export interface SupplierPatagonia {
  id: string;
  destination: number;
  name: string;
  lat: number;
  lng: number;
  address: string | null;
  info: string | null;
  amenities: string[] | null;
  images: {
    rooms: PatagoniaImage[];
    amenities: PatagoniaImage[];
  };
}

interface PatagoniaImage {
  url: string;
  description: string;
}

export interface SupplierPaperflies {
  hotel_id: string;
  destination_id: number;
  hotel_name: string;
  location: {
    address: string;
    country: string;
  };
  details: string;
  amenities: {
    general: string[];
    room: string[];
  };
  images: {
    rooms: PaperfliesImage[];
    site: PaperfliesImage[];
  };
  booking_conditions: string[];
}

interface PaperfliesImage {
  link: string;
  caption: string;
}

export type SupplierKey = "acme" | "patagonia" | "paperflies";

export interface Hotel {
  id: string;
  destination_id: number;
  name: string;
  location: {
    address?: string;
    city?: string;
    country?: string;
    postal_code?: string;
    latitude?: number;
    longitude?: number;
  };
  description: string;
  amenities: string[];
  images: {
    rooms?: HotelImage[];
    amenities?: HotelImage[];
  };
  notes: string[];
}

export interface HotelImage {
  url: string;
  captions: string;
}

export type SupplierDataIntegrationBuilder = (
  supplierData: SupplierAcme[] & SupplierPatagonia[] & SupplierPaperflies[]
) => Record<string, Partial<Hotel>>;
