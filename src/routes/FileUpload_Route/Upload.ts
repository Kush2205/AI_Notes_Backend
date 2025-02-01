import express from 'express';
import multer from 'multer';
import { uploadOnCloudinary, deleteOnCloudinary } from '../../utils/cloudinary';
import { FileUpload } from '../../db/db';
import { authmiddleware } from '../../middleware/auth.middleware';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]),authmiddleware, async (req, res): Promise<any> => {
    try {
        const { name, content, userId } = req.body;
        
        if (!name || !userId) {
            return res.status(400).json({ message: "Name and userId are required." });
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const audiolocalpath = files.audio ? files.audio[0] : null;
        const audioUploadResult = files.audio ? await uploadOnCloudinary(files.audio[0].path) : null;
        const imageUploadResult = files.image ? await uploadOnCloudinary(files.image[0].path) : null;
       
        const newFile = new FileUpload({
            name,
            Content: content,
            Imageurl: imageUploadResult ? imageUploadResult.secure_url : null,
            AudioUrl: audioUploadResult ? audioUploadResult.secure_url: null,
            ImageName: files.image ? files.image[0].originalname : null,
            AudioName: audiolocalpath ? files.audio[0].originalname : null,
            ImageId: imageUploadResult.public_id ? imageUploadResult.public_id : null,
            AudioId: audioUploadResult.public_id ? audioUploadResult.public_id : null,
            ImageType: imageUploadResult ? imageUploadResult.resource_type : null,
            AudioType: audioUploadResult ? audioUploadResult.resource_type : null,
            userId: userId
        });
 
        const response = await newFile.save();
        res.status(200).json(response);
        return;
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
        return;
    }
});

router.delete('/delete',authmiddleware, async (req, res): Promise<any> => {
       try{
             const {id} = req.body;
                if(!id){
                    return res.status(400).json({message : "Id is required"});
                }
                const file = await FileUpload.findById(id);
                if(!file){
                    return res.status(400).json({message : "File not found"});
                }
                if(file.ImageId || file.AudioId){
                const imageDeleteResult = file.ImageId ? await deleteOnCloudinary(file.ImageId , file.ImageType) : null;
                const audioDeleteResult =  file.AudioId ? await deleteOnCloudinary(file.AudioId , file.AudioType) : null;
                
                const result = await FileUpload.findByIdAndDelete(id);
                res.status(200).json({message : "File deleted successfully"});
       }
    }
    catch(error){
        res.status(500).json({message : "Internal Server Error", error});
    }
})

router.get('/getall',authmiddleware, async (req, res): Promise<any> => {
    try {
        const files = await FileUpload.find({ userId: req.body.userId });
        res.status(200).json(files);
        return;
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
        return;
    }
})

router.put('/update',authmiddleware, async (req, res): Promise<any> => {
    //update logic here
})

export default router;