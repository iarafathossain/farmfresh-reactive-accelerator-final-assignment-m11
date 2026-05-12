import cloudinary from "@/libs/cloudinary";
import { TUploadKind, UploadResponse } from "@/types";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { Readable } from "stream";

export const uploadImage = async (
  file: File,
  kind: TUploadKind,
): Promise<UploadResponse> => {
  try {
    // check file
    if (!file) return { success: false, error: "No file uploaded." };

    // convert into buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // dynamic folder path
    let folder = "farmfresh";
    if (kind === "avatar") folder += "/avatar";
    if (kind === "product") folder += "/product_images";

    // upload images to cloudinary
    const result: UploadApiResponse | undefined = await new Promise(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder, resource_type: "image" },
          (
            err: UploadApiErrorResponse | undefined,
            res: UploadApiResponse | undefined,
          ) => {
            if (err) {
              return reject(err);
            }
            resolve(res);
          },
        );
        Readable.from(buffer).pipe(uploadStream);
      },
    );

    if (!result) {
      return {
        success: false,
        error: "Upload failed: no response from cloudinary",
      };
    }

    // final return result
    const finalResult: UploadResponse = {
      success: true,
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
    };
    return finalResult;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { success: false, error: err?.message };
    }
    if (typeof err === "string") {
      return { success: false, error: err };
    }

    return { success: false, error: "An unknown upload error occurred." };
  }
};
