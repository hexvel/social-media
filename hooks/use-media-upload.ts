import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";

export interface AttachmentProps {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

const useMediaUpload = () => {
  const { toast } = useToast();

  const [attachments, setAttachments] = useState<AttachmentProps[]>([]);

  const [uploadProgess, setUploadProgess] = useState<number>();

  const { startUpload, isUploading } = useUploadThing("attachment", {
    onBeforeUploadBegin(files) {
      const renamedFiles = files.map((file) => {
        const extersion = file.name.split(".").pop();

        return new File(
          [file],
          `attachment_${crypto.randomUUID()}.${extersion}`,
          {
            type: file.type,
          },
        );
      });

      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({
          file,
          isUploading: true,
        })),
      ]);

      return renamedFiles;
    },
    onUploadProgress: setUploadProgess,
    onClientUploadComplete(res) {
      setAttachments((prev) =>
        prev.map((attachment) => {
          const uploadResult = res.find((r) => r.name === attachment.file.name);

          if (!uploadResult) return attachment;

          return {
            ...attachment,
            mediaId: uploadResult.serverData.mediaId,
            isUploading: false,
          };
        }),
      );
    },
    onUploadError(error) {
      setAttachments((prev) => prev.filter((a) => !a.isUploading));
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleStartUpload = (files: File[]) => {
    if (isUploading) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Upload in progress",
      });
      return;
    }

    if (attachments.length + files.length > 5) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot upload more than 5 files",
      });
      return;
    }

    startUpload(files);
  };

  const removeAttachment = (fileName: string) => {
    setAttachments((prev) => prev.filter((a) => a.file.name !== fileName));
  };

  const reset = () => {
    setAttachments([]);
    setUploadProgess(undefined);
  };

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgess,
    removeAttachment,
    reset,
  };
};

export default useMediaUpload;
