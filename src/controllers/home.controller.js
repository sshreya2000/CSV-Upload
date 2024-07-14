import fs from "fs";
import csv from "csv-parser";
import path from "path";
import { CsvModel } from "../models/csv.model.js";
export default class HomeController {
  // homepage controller to render to homepage view
  async homePage(req, res) {
    const files = await CsvModel.find({});
    return res.render("homePage", { files: files, errorMessage: null });
  }

  // to add csv file
  async addCsvFile(req, res) {
    try {
      const csvFileName = req.file;
      if (!csvFileName.filename.includes(".csv"))
        return res.render("homePage", {
          errorMessage: "Please enter csv File only",
        });
      let results = [];
      fs.createReadStream(csvFileName.path)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          if (req.file) {
            const csvData = new CsvModel({
              filename: req.file.filename,
              header_row: results[0],
              data_rows: results.slice(1),
              // path: newPath
            });
            await csvData.save();
          } else {
            res.status(400).send("No file uploaded");
          }
          return res.redirect("/app/");
        });
    } catch (err) {
      console.log(err);
      return res.render("homePage", { errorMessage: err });
    }
  }

  // to view csv file
  async viewCsvFile(req, res) {
    try {
      const csvFileName = req.query.filename;
      const page = req.query.page;
      if (!csvFileName) {
        return res.render("homePage", { errorMessage: "File Not found" });
      }
      const uploadPath = path.join("./public/uploads", csvFileName);
      const fileData = await new Promise((resolve, reject) => {
        fs.readFile(uploadPath, "utf8", (error, data) => {
          if (error) {
            console.error("An error occurred while reading the file:", error);
            reject(error);
            return;
          }
          const rows = data.trim().split("\n");
          const header_row = rows[0].split(",");
          const data_rows = rows.slice(1).map((row) => {
            const row_data = {};
            row.split(",").forEach((value, index) => {
              row_data[header_row[index]] = value;
            });
            return row_data;
          });
          resolve({ csvFileName, header_row, data_rows, page });
        });
      });
      res.render("csvView", { errorMessage: null, fileData });
    } catch (err) {
      console.log(err);
      return res.render("homePage", { errorMessage: err });
    }
  }

  // to delete csv file
  async deleteCsvFile(req, res) {
    try {
      const csvFileName = req.query.filename;
      if (!csvFileName) {
        return res.render("homePage", { errorMessage: "File Not found" });
      }
      const uploadPath = path.join("./public/uploads", csvFileName);
      await CsvModel.deleteOne({ filename: csvFileName });
      fs.unlink(uploadPath, (err) => {
        if (err) throw err;
        console.log("file is deleted");
      });
      return res.redirect("/app/");
    } catch (err) {
      console.log(err);
      return res.render("homePage", { errorMessage: err });
    }
  }
}
