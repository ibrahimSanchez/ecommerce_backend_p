import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { CloudinaryService } from "./cloudinary.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("file")
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor("file"))
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1023 * 1024 * 4 }),
          new FileTypeValidator({ fileType: ".(png|jpg|jpeg)" }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.cloudinaryService.uploadFile(file);
  }

@Get()
getHello(){
  return this.cloudinaryService.gethello()
}


}
