'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { endpoints } from '@/services/endpoints';

/** Mutation to update the current user's profile. */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof endpoints.settings.updateProfile>[0]) =>
      endpoints.settings.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['me'], data);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: () => {
      /* profile update fails gently in demo mode */
    },
  });
}
