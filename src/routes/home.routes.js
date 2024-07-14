// 1. Import express.
import express from "express";
import HomeController from "../controllers/home.controller.js";
import { uploadFile } from "../middlewares/file-upload.middleware.js";

// 2. Initialize Express router.
const homeRouter = express.Router();
const homeController = new HomeController();

// All the paths to the controller methods.
// homepage route
homeRouter.get("/", (req, res) => {
  homeController.homePage(req, res);
});
// fileupload route
homeRouter.post("/fileUpload", uploadFile.single("csvFile"), (req, res) => {
  homeController.addCsvFile(req, res);
});
// to view file
homeRouter.get("/viewFile", (req, res) => {
  homeController.viewCsvFile(req, res);
});
// to delete file
homeRouter.get("/deleteFile", (req, res) => {
  homeController.deleteCsvFile(req, res);
});
export default homeRouter;
