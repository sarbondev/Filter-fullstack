import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Loader2, ImagePlus } from 'lucide-react';
import { useUploadSingleMutation, useUploadMultipleMutation, useDeleteFileMutation } from '@/store/api/uploadApi';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
  error?: string;
}

export function ImageUpload({ value, onChange, multiple = false, maxFiles = 10, label, error }: ImageUploadProps) {
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSingle, { isLoading: singleLoading }] = useUploadSingleMutation();
  const [uploadMultiple, { isLoading: multiLoading }] = useUploadMultipleMutation();
  const [deleteFile] = useDeleteFileMutation();
  const isLoading = singleLoading || multiLoading;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);

    try {
      if (multiple && files.length > 1) {
        const formData = new FormData();
        const count = Math.min(files.length, maxFiles - value.length);
        for (let i = 0; i < count; i++) {
          formData.append('files', files[i]);
        }
        const result = await uploadMultiple(formData).unwrap();
        onChange([...value, ...result.map((r) => r.url)]);
      } else {
        const formData = new FormData();
        formData.append('file', files[0]);
        const result = await uploadSingle(formData).unwrap();
        if (multiple) {
          onChange([...value, result.url]);
        } else {
          onChange([result.url]);
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
      const apiErr = err as { data?: { message?: string }; status?: number; error?: string };
      const msg = apiErr.data?.message || apiErr.error || t('common.uploadFailed');
      setUploadError(msg);
    }

    if (fileRef.current) fileRef.current.value = '';
  };

  const removeImage = async (index: number) => {
    const url = value[index];
    // Only call delete API for server-uploaded files
    if (url && url.startsWith('/uploads/')) {
      try {
        await deleteFile(url).unwrap();
      } catch (err) {
        console.error('Delete failed:', err);
        setUploadError(t('common.deleteFailed'));
      }
    }
    onChange(value.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const canUpload = multiple ? value.length < maxFiles : value.length === 0;

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}

      {/* Preview grid */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {value.map((url, i) => (
            <div key={i} className="group relative h-28 w-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="%23cbd5e1" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>';
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1.5 right-1.5 rounded-full bg-red-500 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {canUpload && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-6 cursor-pointer transition-colors ${
            dragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50'
          } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          ) : (
            <ImagePlus className="h-8 w-8 text-slate-400" />
          )}
          <div className="text-center">
            <p className="text-sm font-medium text-slate-600">
              {isLoading ? t('common.loading') : t('common.uploadClick')}
            </p>
            <p className="text-xs text-slate-400 mt-1">{t('common.uploadFormats')}</p>
          </div>
        </div>
      )}

      {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
