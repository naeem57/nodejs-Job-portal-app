const { mongoose } = require("mongoose");
const Job = require("../models/jobs-model.js");
const moment = require("moment");

//create job
const createJobs = async (req, res, next) => {
  const { company, position } = req.body;

  if (!company || !position) {
    next("Please provide all fields!");
  }

  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(201).json({ message: "job created successfully!", job });
};

//Get Jobs
const getJobs = async (req, res) => {
  const { status, workType, search, sort } = req.query;

  //condition for searching queries
  const queryObject = {
    createdBy: req.user.userId,
  };

  //logic Filters
  if (status && status !== "all") {
    queryObject.status = status;
  }

  if (workType && workType !== "all") {
    queryObject.workType = workType;
  }

  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  let queryResult = Job.find(queryObject);

  //sorting
  if (sort === "latest") {
    queryResult = queryResult.sort("-createdAt");
  }

  if (sort === "oldest") {
    queryResult = queryResult.sort("createdAt");
  }

  if (sort === "a-z") {
    queryResult = queryResult.sort("position");
  }

  if (sort === "z-a") {
    queryResult = queryResult.sort("-position");
  }

  //pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  queryResult = queryResult.skip(skip).limit(limit);
  //job count
  const totalJobs = await Job.countDocuments(queryResult);
  const numOfPage = Math.ceil(totalJobs / limit);

  const jobs = await queryResult;

  //   const jobs = await Job.find({ createdBy: req.user.userId });
  res.status(200).json({
    totalJobs,
    jobs,
    numOfPage,
  });
};

//update job
const updateJob = async (req, res, next) => {
  const { id } = req.params;
  const { company, position } = req.body;

  if (!company || !position) {
    next("Please provide all fields!");
  }

  const job = await Job.findOne({ _id: id });
  if (!job) {
    next("no jobs found!");
  }

  if (!req.user.userId === job.createdBy.toString()) {
    next("your are not authorized to update this job!");
    return;
  }

  const updateJob = await Job.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ message: "job updated!", updateJob });
};

//delete job
const deleteJob = async (req, res, next) => {
  const { id } = req.params;

  const job = await Job.findOne({ _id: id });
  if (!job) {
    next("no jobs found!");
  }

  if (!req.user.userId === job.createdBy.toString()) {
    next("your are not authorized to delete this job!");
    return;
  }

  await job.deleteOne();
  res.status(200).json({ message: "job deleted!" });
};

//jobs stats and filter
const jobStats = async (req, res) => {
  const stats = await Job.aggregate([
    //search by user jobs
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  //defualt stats
  const defaultStats = {
    pending: stats.pending || 0,
    reject: stats.reject || 0,
    interview: stats.interview || 0,
  };

  //monthly yearly stats
  let monthlyApplication = await Job.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  // Format the output for readability
  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year - 1)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

  res
    .status(200)
    .json({ totalJob: stats.length, defaultStats, monthlyApplication });
};

module.exports = {
  createJobs,
  getJobs,
  updateJob,
  deleteJob,
  jobStats,
};
