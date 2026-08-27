// import Lecture from "../models/lecture.model.js";
// import { Course } from "../models/course.model.js";
// import { User } from "../models/user.model.js";

// export const createLecture = async (req, res) => {
//   try {
//     const {
//       course,
//       instructor,
//       date,
//       title,
//       description,
//     } = req.body;

//     // 1. Check required fields
//     if (!course || !instructor || !date || !title) {
//       return res.status(400).json({
//         success: false,
//         message: "Course, instructor, date and title are required",
//       });
//     }

//     // 2. Check course exists
//     const existingCourse = await Course.findById(course);

//     if (!existingCourse) {
//       return res.status(404).json({
//         success: false,
//         message: "Course not found",
//       });
//     }

//     // 3. Check instructor exists
//     const existingInstructor = await User.findOne({
//       _id: instructor,
//       role: "instructor",
//     });

//     if (!existingInstructor) {
//       return res.status(404).json({
//         success: false,
//         message: "Instructor not found",
//       });
//     }

//     // 4. Check instructor conflict
//     const existingLecture = await Lecture.findOne({
//       instructor,
//       date: new Date(date),
//     });

//     if (existingLecture) {
//       return res.status(409).json({
//         success: false,
//         message:
//           "This instructor already has a lecture assigned on this date",
//       });
//     }

//     // 5. Create lecture
//     const lecture = await Lecture.create({
//       course,
//       instructor,
//       date: new Date(date),
//       title,
//       description: description || "",
//     });

//     // 6. Return created lecture
//     return res.status(201).json({
//       success: true,
//       message: "Lecture created successfully",
//       lecture,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to create lecture",
//       error: error.message,
//     });
//   }
// };

// export const getMyLectures = async (req, res) => {
//   try {
//     const instructorId = req.user.userId;

//     const lectures = await Lecture.find({
//       instructor: instructorId,
//     })
//       .populate("course", "name level")
//       .populate("instructor", "name email")
//       .sort({ date: 1 });

//     return res.status(200).json({
//       success: true,
//       message: "Your lectures fetched successfully",
//       lectures,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch your lectures",
//       error: error.message,
//     });
//   }
// };

// export const getAllLectures = async (req, res) => {
//   try {
//     const lectures = await Lecture.find()
//       .populate("course", "name level")
//       .populate("instructor", "name email")
//       .sort({ date: 1 });

//     return res.status(200).json({
//       success: true,
//       message: "All lectures fetched successfully",
//       lectures,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch lectures",
//       error: error.message,
//     });
//   }
// };

// export const updateLecture = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       course,
//       instructor,
//       date,
//       title,
//       description,
//     } = req.body;

//     const lecture = await Lecture.findById(id);

//     if (!lecture) {
//       return res.status(404).json({
//         success: false,
//         message: "Lecture not found",
//       });
//     }

//     // If instructor/date is changing,
//     // check for another lecture with same instructor/date
//     if (instructor || date) {
//       const newInstructor = instructor || lecture.instructor;
//       const newDate = date ? new Date(date) : lecture.date;

//       const conflictingLecture = await Lecture.findOne({
//         _id: { $ne: id },
//         instructor: newInstructor,
//         date: newDate,
//       });

//       if (conflictingLecture) {
//         return res.status(409).json({
//           success: false,
//           message:
//             "This instructor already has a lecture assigned on this date",
//         });
//       }
//     }

//     if (course) {
//       const existingCourse = await Course.findById(course);

//       if (!existingCourse) {
//         return res.status(404).json({
//           success: false,
//           message: "Course not found",
//         });
//       }

//       lecture.course = course;
//     }

//     if (instructor) {
//       const existingInstructor = await User.findOne({
//         _id: instructor,
//         role: "instructor",
//       });

//       if (!existingInstructor) {
//         return res.status(404).json({
//           success: false,
//           message: "Instructor not found",
//         });
//       }

//       lecture.instructor = instructor;
//     }

//     if (date) lecture.date = new Date(date);
//     if (title) lecture.title = title;
//     if (description !== undefined) {
//       lecture.description = description;
//     }

//     await lecture.save();

//     return res.status(200).json({
//       success: true,
//       message: "Lecture updated successfully",
//       lecture,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to update lecture",
//       error: error.message,
//     });
//   }
// };

// export const deleteLecture = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const lecture = await Lecture.findByIdAndDelete(id);

//     if (!lecture) {
//       return res.status(404).json({
//         success: false,
//         message: "Lecture not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Lecture deleted successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete lecture",
//       error: error.message,
//     });
//   }
// };



import Lecture from "../models/lecture.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";

export const createLecture = async (req, res) => {
  try {
    const {
      course,
      instructor,
      date,
      startTime,
      endTime,
      title,
      description,
      room,
    } = req.body;

    if (!course || !instructor || !date || !startTime || !endTime || !title) {
      return res.status(400).json({
        success: false,
        message:
          "Course, instructor, date, start time, end time and title are required",
      });
    }

    const existingCourse = await Course.findById(course);

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const existingInstructor = await User.findOne({
      _id: instructor,
      role: "instructor",
    });

    if (!existingInstructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    // Conflict check: same instructor, same date, same start time
    const existingLecture = await Lecture.findOne({
      instructor,
      date: new Date(date),
      startTime,
    });

    if (existingLecture) {
      return res.status(409).json({
        success: false,
        message:
          "This instructor already has a lecture at this date and time",
      });
    }

    const lecture = await Lecture.create({
      course,
      instructor,
      date: new Date(date),
      startTime,
      endTime,
      title,
      description: description || "",
      room: room || "",
      createdBy: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Lecture created successfully",
      lecture,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create lecture",
      error: error.message,
    });
  }
};

export const getMyLectures = async (req, res) => {
  try {
    const instructorId = req.user.userId;

    const lectures = await Lecture.find({
      instructor: instructorId,
    })
      .populate("course", "name level")
      .populate("instructor", "name email")
      .sort({ date: 1 });

    return res.status(200).json({
      success: true,
      message: "Your lectures fetched successfully",
      lectures,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch your lectures",
      error: error.message,
    });
  }
};

export const getAllLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find()
      .populate("course", "name level")
      .populate("instructor", "name email")
      .sort({ date: 1 });

    return res.status(200).json({
      success: true,
      message: "All lectures fetched successfully",
      lectures,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch lectures",
      error: error.message,
    });
  }
};

export const updateLecture = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      course,
      instructor,
      date,
      startTime,
      endTime,
      title,
      description,
      room,
    } = req.body;

    const lecture = await Lecture.findById(id);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    if (instructor || date || startTime) {
      const newInstructor = instructor || lecture.instructor;
      const newDate = date ? new Date(date) : lecture.date;
      const newStartTime = startTime || lecture.startTime;

      const conflictingLecture = await Lecture.findOne({
        _id: { $ne: id },
        instructor: newInstructor,
        date: newDate,
        startTime: newStartTime,
      });

      if (conflictingLecture) {
        return res.status(409).json({
          success: false,
          message:
            "This instructor already has a lecture at this date and time",
        });
      }
    }

    if (course) {
      const existingCourse = await Course.findById(course);

      if (!existingCourse) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      lecture.course = course;
    }

    if (instructor) {
      const existingInstructor = await User.findOne({
        _id: instructor,
        role: "instructor",
      });

      if (!existingInstructor) {
        return res.status(404).json({
          success: false,
          message: "Instructor not found",
        });
      }

      lecture.instructor = instructor;
    }

    if (date) lecture.date = new Date(date);
    if (startTime) lecture.startTime = startTime;
    if (endTime) lecture.endTime = endTime;
    if (title) lecture.title = title;
    if (description !== undefined) lecture.description = description;
    if (room !== undefined) lecture.room = room;

    await lecture.save();

    return res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
      lecture,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update lecture",
      error: error.message,
    });
  }
};

export const deleteLecture = async (req, res) => {
  try {
    const { id } = req.params;

    const lecture = await Lecture.findByIdAndDelete(id);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete lecture",
      error: error.message,
    });
  }
};