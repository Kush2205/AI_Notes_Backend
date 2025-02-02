import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET});

    const uploadOnCloudinary = async (filepath : string) : Promise<any> => {
         try {
            if(!filepath) return ;
             const response = await cloudinary.uploader.upload(filepath , {
                resource_type : "auto"
             })
             fs.unlinkSync(filepath);
             return response;
         } catch (error) {
            fs.unlinkSync(filepath);
             return error;
         }
    }

    const deleteOnCloudinary = async (publicId :any , fileType :any) : Promise<any> => {
         try {
               if(!publicId) return ;
               const response = await cloudinary.uploader.destroy(publicId ,{resource_type : fileType});
               return response;
         } catch (error) {
               return error;
    }
   }
    export  {uploadOnCloudinary , deleteOnCloudinary};