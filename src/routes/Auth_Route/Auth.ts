import express, { Request, Response ,Router } from 'express';
import { User } from '../../db/db';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import zod from 'zod';

dotenv.config();
const router = Router();
const jwtsecret:string = process.env.JWT_SECRET || "";
router.post('/register', async (req :Request , res :any) => {
    const schema = zod.object({
        name: zod.string().min(3),
        email: zod.string().email(),
        password: zod.string().min(6),
    });
    try {
        schema.parse(req.body);
    } catch (error : any) {
        return res.status(400).json({ error: error.errors });
    }
    const { name, email, password } = req.body;
    try{
        const userExists = await User.findOne({
        username: email
        });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists . Please try a new username.' });
        }
        const newUser = await User.create({
            name: name,
          username: email,
            password : password,
           
        });
        return res.json(newUser);
    }
    catch(error){
        return res.status(400).json({ error});
    }
   
})

router.post('/login', async (req: Request, res: any) => {
    const schema = zod.object({
        email: zod.string().email(),
        password: zod.string().min(6),
    });
    try {
        schema.parse(req.body);
    } catch (error: any) {
        return res.status(400).json({ error: error.errors });
    }
    try {
        const { email , password } = req.body;
        const userExists = await User.findOne({username :email , password : password});
        
    if (!userExists) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: userExists._id }, jwtsecret);
    return res.json({ token });
    } catch (error) {
        return res.status(400).json({ error: 'Something went wrong please try again after some time' });
    }
    
})
export default router;