import express from 'express';
import mainrouter from './routes/index';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 8000;
console.log(process.env.PORT);
const app = express();

app.use(express.json());
app.use("/api/v1" , mainrouter);

app.listen(port, () => {console.log('Server is running on port ' + port);});