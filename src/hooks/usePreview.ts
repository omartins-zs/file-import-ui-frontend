import { useQuery } from '@tanstack/react-query';
import { importsService } from '@/lib/api';

export function usePreview(file: File | null) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['import-preview', file?.name, file?.size],
    queryFn: () => (file ? importsService.preview(file) : null),
    enabled: !!file,
    staleTime: Infinity,
  });

  return {
    preview: data,
    isLoading,
    error,
  };
}
