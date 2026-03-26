import { useMutation, useQueryClient } from '@tanstack/react-query';
import { importsService } from '@/lib/api';

export function useUploadFile() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, isSuccess, error } = useMutation({
    mutationFn: (file: File) => importsService.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['import-stats'] });
    },
  });

  return {
    upload: mutateAsync,
    isLoading: isPending,
    isSuccess,
    error,
  };
}
