import { Router } from "express";
import { getHotels } from "../controllers";

const routers = Router();
console.log("rou");
routers.post("/hotels", getHotels);

export default routers;
