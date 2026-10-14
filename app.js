import express from "express";

const app = express();

const PORT = 3000;

app.listen(PORT,async () =>{
    console.log(`servidor corriendo en el puerto ${PORT}`)
})