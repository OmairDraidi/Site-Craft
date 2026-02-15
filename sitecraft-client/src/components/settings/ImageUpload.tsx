import { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { resolveImageUrl } from '../../utils/url';

interface ImageUploadProps {
    label: string;
    currentImage?: string;
    onUpload: (file: File) => void;
    accept?: string;
    maxSize?: number; // in MB
}

export const ImageUpload = ({
    label,
    currentImage,
    onUpload,
    accept = '.png,.jpg,.jpeg,.svg',
    maxSize = 2
}: ImageUploadProps) => {
    // preview is for local blobs before upload finish
    const [preview, setPreview] = useState<string | undefined>();
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset local preview when currentImage changes (from server)
    useEffect(() => {
        if (currentImage) {
            setPreview(undefined);
        }
    }, [currentImage]);

    const validateFile = (file: File): string | null => {
        const maxSizeBytes = maxSize * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            return `File exceeds ${maxSize}MB`;
        }

        const allowedTypes = accept.split(',').map(t => t.trim());
        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
        if (!allowedTypes.includes(fileExtension)) {
            return `Only ${allowedTypes.join(', ')} allowed`;
        }

        return null;
    };

    const handleFile = (file: File) => {
        setError('');
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        // Create local preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Notify parent
        onUpload(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const displayImage = preview || resolveImageUrl(currentImage);

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">{label}</label>

            <div
                className={`relative group h-40 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden ${isDragging
                        ? 'border-[#F6C453] bg-[#F6C453]/5'
                        : 'border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/[0.08]'
                    } ${error ? 'border-red-500/50 bg-red-500/5' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                {displayImage ? (
                    <>
                        <img
                            src={displayImage}
                            alt={label}
                            className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col gap-2 backdrop-blur-[2px]">
                            <div className="w-10 h-10 rounded-full bg-[#F6C453] text-black flex items-center justify-center shadow-lg">
                                <PlusIcon className="w-5 h-5" />
                            </div>
                            <span className="text-white text-[10px] font-bold uppercase tracking-wider">Change {label}</span>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#F6C453]/10 group-hover:border-[#F6C453]/20 transition-colors">
                            <Upload className="w-6 h-6 text-gray-500 group-hover:text-[#F6C453]" />
                        </div>
                        <p className="text-xs text-gray-400 font-medium">
                            <span className="text-white">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-[10px] text-gray-600 mt-1">
                            {accept.toUpperCase().replace(/\./g, '')} (max {maxSize}MB)
                        </p>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept={accept}
                    onChange={handleFileChange}
                />
            </div>

            {error && <p className="text-xs text-red-500 mt-1 pl-1 font-medium italic">⚠ {error}</p>}
        </div>
    );
};

const PlusIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
    </svg>
);
