"use client";

import { $Enums } from "@prisma/client";
import { UploadDropzone } from "@/utils/uploadthing";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";

interface FileUploaderProps {
  onChange: (value: { name: string; url: string; type: $Enums.FileType }[]) => void;
  value: { name: string; url: string; type: $Enums.FileType }[];
}

export const FileUpload = ({ value, onChange }: FileUploaderProps) => {
  const [selectedType, setSelectedType] = useState<$Enums.FileType | undefined>(undefined);

  return (
    <div>
      {/* Uploaded files preview */}
      {value?.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-4">
          {value.map((file) => (
            <div key={file.url} className="relative w-[200px] h-[200px] rounded-lg">
              <Image
                src={file.type === "IMAGE" ? file.url : "/pdf.png"}
                alt={file.name}
                className="object-cover rounded-lg"
                fill
              />
              <button
                type="button"
                onClick={() => onChange(value.filter((f) => f.url !== file.url))}
                className="absolute -top-2 -right-2 p-1 bg-rose-500 rounded-full text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload buttons or dropzone */}
      {selectedType ? (
        <UploadDropzone
          endpoint={selectedType === "IMAGE" ? "imageUploader" : "documentUploader"}
          onClientUploadComplete={(res) => {
            const newFiles = res?.map((f) => ({
              name: f.name,
              url: f.url,
              type: selectedType,
            }));
            onChange([...value, ...(newFiles || [])]);
            setSelectedType(undefined);
          }}
          onUploadError={(error: Error) => console.log(`ERROR: Upload ${error.message}`)}
        />
      ) : (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setSelectedType("IMAGE")}
            className={cn(selectedType === "IMAGE" && "bg-slate-200")}
          >
            Image
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedType("PDF")}
            className={cn(selectedType === "PDF" && "bg-slate-200")}
          >
            PDF
          </Button>
        </div>
      )}
    </div>
  );
};
