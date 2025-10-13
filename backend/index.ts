import express, {Request,Response}from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.post('/generate',(req,res)=>{
    res.send("initialized")
})

app.listen(3000);


