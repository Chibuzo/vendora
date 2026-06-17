'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

export interface GenerateUploadUrlInput {
  filename: string;
  contentType: string;
  prefix?: string;
}

export interface GenerateUploadUrlResponse {
  url: string;
  key: string;
}

export function useGenerateUploadUrl() {
  return useMutation({
    mutationFn: async (payload: GenerateUploadUrlInput) =>
      (
        await apiClient.post<GenerateUploadUrlResponse, GenerateUploadUrlInput>(
          '/storage/upload-url',
          payload
        )
      ).data
  });
}

export function useUploadImage() {
  const { mutateAsync: generateUrl } = useGenerateUploadUrl();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const upload = async (file: File, prefix?: string): Promise<string> => {
    setIsUploading(true);
    setError(null);

    try {
      // 1. Get presigned URL
      const { url, key } = await generateUrl({
        filename: file.name,
        contentType: file.type,
        prefix
      });

      // 2. Upload file directly to R2
      const response = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });

      if (!response.ok) {
        throw new Error('Failed to upload file to storage');
      }

      // 3. Construct the public URL
      const baseUrl = process.env.NEXT_PUBLIC_STORAGE_URL?.replace(/\/$/, '') ?? '';
      const publicUrl = `${baseUrl}/${key}`;

      return publicUrl;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Unknown error during upload');
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    upload,
    isUploading,
    error
  };
}
