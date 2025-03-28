import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { currentUser } from "@clerk/nextjs/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Workshop resource uploader
  workshopResourceUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
    pdf: { maxFileSize: "16MB", maxFileCount: 10 },
    text: { maxFileSize: "2MB", maxFileCount: 10 },
    audio: { maxFileSize: "32MB", maxFileCount: 5 },
    video: { maxFileSize: "128MB", maxFileCount: 3 }
  })
    .middleware(async () => {
      // This code runs on your server before upload
      const user = await currentUser();

      // If you throw, the user will not be able to upload
      if (!user || !user.id) {
        throw new UploadThingError("Unauthorized");
      }

      // Get admin status from user metadata or other source
      // For now we'll just authenticate the user
      const isAdmin = true; // Replace with actual admin check

      if (!isAdmin) {
        throw new UploadThingError("Not an admin");
      }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.ufsUrl);

      // Save the file URL to your database here

      return { fileUrl: file.ufsUrl };
    }),

  // Custom design uploader for users
  customDesignUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 5 },
    pdf: { maxFileSize: "8MB", maxFileCount: 2 },
  })
    .middleware(async () => {
      const user = await currentUser();

      if (!user || !user.id) {
        throw new UploadThingError("Unauthorized");
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Custom design upload complete for userId:", metadata.userId);
      console.log("File URL:", file.ufsUrl);

      return { fileUrl: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
