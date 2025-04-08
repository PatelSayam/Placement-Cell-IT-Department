//this model is used for keep track of placement related data altough we can calculate the data at any time 
// we need by just using aggrigation pipeline but here we created seprate schema to avoid accesive db calls
//and makes backend more performance oriented -- we use sub schema so that it is easy to handle 
//data for frontend dev.
//this schema only store calculated summary information not indivisual data
//sub_schema: companyStatSchema


import mongoose from "mongoose";

const companyStatSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  totalPlaced: {
    type: Number,
    default: 0,
  },
  avgPackage: {
    type: Number,
    default: 0,
  },
  highestPackage: {
    type: Number,
    default: 0,
  },
}, { _id: false }); // Prevents creation _id for each subdocument as it is not needed to store 

const placementStatsSchema = new mongoose.Schema({
  batchYear: {
    type: Number,
    required: true,
    unique: true,
  },
  totalStudents: {
    type: Number,
    default: 0,
  },
  totalPlaced: {
    type: Number,
    default: 0,
  },
  avgPackage: {
    type: Number,
    default: 0,
  },
  companyWiseStats: {
    type: [companyStatSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PlacementStats = mongoose.model("PlacementStats", placementStatsSchema);

export default PlacementStats;
