const express = require("express");
const Router = express.Router();
const Courses = require("../Models/Course");
const { body, validationResult } = require("express-validator");
Router.post(
  "/course",
  [body("name").isLength(3), body("price").isLength(10)],
  async (req, res, next) => {
    const result = validationResult(req);
    console.log(
      result?.errors?.map((itm) => {
        return {
          message: `${itm.path} is required`,
          success: false,
          status: 400,
        };
      })
    );
    try {
      // function validateObjectsInArray(obj, expectedKeys, index, total) {
      //   for (let key in obj) {
      //     if (!expectedKeys.includes(key)) {
      //       throw new Error(`Unexpected key '${key}' found in Your file`);
      //     }
      //   }
      // }

      // const expectedKeys = [
      //   "name",
      //   "startDate",
      //   "endDate",
      //   "price",
      //   "collegeName",
      //   "address",
      //   "city",
      //   "state",
      //   "country",
      //   "pincode",
      //   "registrationFees",
      // ];

      // try {
      //   validateObjectsInArray(req.body, expectedKeys);
      // } catch (error) {
      //   console.log(error);
      // }
      let body = req.body;
      let AddCourse = await Courses.create(body);

      let Result = AddCourse.save();

      if (Result) {
        res.status(200).send({
          success: true,
          message: "Course added successfuly",
          status: 200,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

Router.get("/courses", async (req, res, next) => {
  try {
    let count = req.query.count || 5;
    let page = req.query.page || 1;

    let search = req.query.search;

    let TotalDocs = await Courses.countDocuments();
    let filters = {};
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },

        { price: { $regex: search, $options: "i" } },
        { collegeName: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
      ];
    }

    let Data = await Courses.find(filters)
      .limit(count)
      .skip((page - 1) * count)
      .select("-password");

    if (Data) {
      res.status(200).send({
        success: true,
        data: Data,
        total: TotalDocs,
        status: 200,
        message: "Courses fetched successfuly",
      });
    }
  } catch (error) {
    next(error);
  }
});

Router.put("/course", async (req, res, next) => {
  try {
    let { id } = req.body;

    let find = await Courses.findById(id);

    if (!find) {
      return res
        .status(400)
        .send({ success: false, message: "Course not found", status: 400 });
    }

    let UpsetFields = await Courses.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          updatedAt: Date.now(),
          ...req.body,
        },
      }
    );

    if (UpsetFields) {
      res.status(200).send({
        success: true,
        message: "Course updated successfuly",
        status: 200,
      });
    }
  } catch (error) {
    next(error);
  }
});

Router.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send({ error: "Internal Server Error" });
});

module.exports = Router;
