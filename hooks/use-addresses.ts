"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { getApiErrorMessage } from "@/api/client";
import { addressesApi, type AddressPayload } from "@/api/addresses";

export function useAddresses() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["addresses"],
    queryFn: addressesApi.list,
    enabled: !!accessToken,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddressPayload) => addressesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address added");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<AddressPayload>;
    }) => addressesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address updated");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address deleted");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
