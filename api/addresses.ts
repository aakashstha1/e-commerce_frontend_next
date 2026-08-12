import { Address } from "@/types/address.type";
import { apiClient } from "./client";

export interface AddressPayload {
  fullName: string;
  country: string;
  city: string;
  state: string;
  postalCode: string;
  street: string;
  isDefault?: boolean;
}

export const addressesApi = {
  list: () =>
    apiClient
      .get<Address[]>("/addresses")
      .then((r) => r.data as unknown as Address[]),
  getById: (id: string) =>
    apiClient
      .get<Address>(`/addresses/${id}`)
      .then((r) => r.data as unknown as Address),
  create: (payload: AddressPayload) =>
    apiClient
      .post<Address>("/addresses", payload)
      .then((r) => r.data as unknown as Address),
  update: (id: string, payload: Partial<AddressPayload>) =>
    apiClient
      .patch<Address>(`/addresses/${id}`, payload)
      .then((r) => r.data as unknown as Address),
  remove: (id: string) =>
    apiClient.delete(`/addresses/${id}`).then((r) => r.data),
};
