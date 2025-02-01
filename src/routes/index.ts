import express from 'express';
import authRouter from './Auth_Route/Auth';
import uploadRouter from './FileUpload_Route/Upload';
const mainrouter = express.Router();
mainrouter.use('/auth', authRouter);
mainrouter.use('/notes', uploadRouter);
export default mainrouter;