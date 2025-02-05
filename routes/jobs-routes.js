const express = require("express");
const {
  createJobs,
  getJobs,
  updateJob,
  deleteJob,
  jobStats,
} = require("../controllers/jobs-controller.js");
const protect = require("../middlewares/auth-middleware.js");

const router = express.Router();

//create job
router.post("/create", protect, createJobs);
//get job
router.get("/get-jobs", protect, getJobs);
//update job
router.patch("/update-job/:id", protect, updateJob);
//delete job
router.delete("/delete-job/:id", protect, deleteJob);
//jobs stats filter
router.get("/job-stats", protect, jobStats);

module.exports = router;
