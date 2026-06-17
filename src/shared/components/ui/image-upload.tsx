'use client';

import { useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useUploadImage } from '@/modules/storage/hooks/use-storage-api';
import { Spinner } from '@/shared/components/ui/spinner';

export interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  onRemove?: () => void;
  prefix?: string;
  className?: string;
  label?: string;
  error?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  prefix,
  className,
  label,
  error
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading, error: uploadError } = useUploadImage();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = await upload(file, prefix);
      onChange(url);
    } catch (err) {
      // Error is handled by useUploadImage hook and displayed in the UI
      console.error('Upload failed', err);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    } else {
      onChange('');
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <label className="text-sm font-medium leading-none text-foreground">{label}</label>}

      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={cn(
          'group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-surface transition-colors hover:border-primary-500 hover:bg-neutral-50',
          value ? 'h-48' : 'h-32',
          isUploading && 'pointer-events-none opacity-60',
          (error || uploadError) && 'border-danger-500 bg-danger-50 hover:border-danger-600'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Spinner className="h-6 w-6 text-primary-600" />
            <span className="text-sm font-medium text-muted-foreground">Uploading...</span>
          </div>
        ) : value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Uploaded preview" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-2 top-2 rounded-full bg-danger-500 p-1.5 text-white opacity-0 shadow-sm transition-opacity hover:bg-danger-600 group-hover:opacity-100"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="absolute bottom-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <UploadCloud className="h-3.5 w-3.5" />
              Change image
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="rounded-full bg-neutral-100 p-3 transition-colors group-hover:bg-primary-50 group-hover:text-primary-600">
              <ImageIcon className="h-6 w-6" />
            </div>
            <div className="text-center">
              <span className="text-sm font-medium text-foreground">Click to upload</span>
              <p className="text-xs">SVG, PNG, JPG or GIF</p>
            </div>
          </div>
        )}
      </div>

      {(error || uploadError) && (
        <p className="text-[0.8rem] font-medium text-danger-500">
          {error || uploadError?.message || 'Upload failed'}
        </p>
      )}
    </div>
  );
}
