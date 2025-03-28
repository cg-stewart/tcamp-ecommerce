"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/utils/uploadthing";
import { Button } from "@/components/ui/button";
import { Cloud, File, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface UploadButtonProps {
  endpoint: "workshopResourceUploader" | "customDesignUploader";
  onUploadComplete?: (urls: string[]) => void;
  className?: string;
  buttonText?: string;
}

export default function UploadButton({
  endpoint,
  onUploadComplete,
  className,
  buttonText = "Upload files"
}: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      const urls = res.map((file) => file.url);
      
      toast({
        title: "Upload complete",
        description: `Successfully uploaded ${res.length} file(s)`,
      });
      
      if (onUploadComplete) onUploadComplete(urls);
    },
    onUploadError: (error) => {
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    await startUpload(Array.from(files));
  };
  
  return (
    <div className={cn("flex items-center", className)}>
      <label htmlFor="file-upload" className="cursor-pointer">
        <Button 
          type="button" 
          disabled={isUploading}
          className="relative"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Cloud className="h-4 w-4 mr-2" />
              {buttonText}
            </>
          )}
        </Button>
        <input
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>
    </div>
  );
}
