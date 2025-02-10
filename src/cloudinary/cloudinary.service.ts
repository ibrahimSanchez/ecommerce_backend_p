import { Injectable } from "@nestjs/common";
import {
  v2 as cloudinary,
  UploadApiResponse,
} from "cloudinary";
import { CloudinaryResponse } from "./cloudinary-response";
const streamifier = require("streamifier");

@Injectable()
export class CloudinaryService {
  
  
  
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }


  gethello(){
    return 'hello'
  }
}
