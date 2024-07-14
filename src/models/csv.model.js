import mongoose from "mongoose";

// schema structure of csv file into database
const csvSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    header_row: {
      type: [Object],
    },
    data_rows: {
      type: [Object],
    },
  },
  {
    timestamps: true,
  }
);

export const CsvModel = mongoose.model("CSV", csvSchema);
