import Lecture from "../models/lecture.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";

// ==============================
// CREATE LECTURE
// ==============================
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

    // 1. Check required fields
    if (
      !course ||
      !instructor ||
      !date ||
      !startTime ||
      !endTime ||
      !title
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Course, instructor, date, start time, end time and title are required",
      });
    }

    // 2. Check start time and end time
    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    // 3. Check course exists
    const existingCourse = await Course.findById(course);

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 4. Check instructor exists
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

    // ==========================================
    // 5. CHECK INSTRUCTOR TIME CONFLICT
    // ==========================================

    const lecturesOnSameDay = await Lecture.find({
      instructor,
      date: new Date(date),
    });

    const hasInstructorConflict = lecturesOnSameDay.some((lecture) => {
      return (
        startTime < lecture.endTime &&
        endTime > lecture.startTime
      );
    });

    if (hasInstructorConflict) {
      return res.status(409).json({
        success: false,
        message: "Instructor already has a lecture at this time",
      });
    }

    // ==========================================
    // 6. CHECK ROOM TIME CONFLICT
    // ==========================================

    if (room) {
      const lecturesInSameRoom = await Lecture.find({
        room,
        date: new Date(date),
      });

      const hasRoomConflict = lecturesInSameRoom.some((lecture) => {
        return (
          startTime < lecture.endTime &&
          endTime > lecture.startTime
        );
      });

      if (hasRoomConflict) {
        return res.status(409).json({
          success: false,
          message: "This room is already booked at this time",
        });
      }
    }

    // ==========================================
    // 7. CREATE LECTURE
    // ==========================================

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

    // 8. Return response
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

// ==============================
// GET MY LECTURES
// ==============================
export const getMyLectures = async (req, res) => {
  try {
    const instructorId = req.user.userId;

    const lectures = await Lecture.find({
      instructor: instructorId,
    })
      .populate("course", "name level")
      .populate("instructor", "name email")
      .sort({ date: 1, startTime: 1 });

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

// ==============================
// GET ALL LECTURES
// ==============================
export const getAllLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find()
      .populate("course", "name level")
      .populate("instructor", "name email")
      .sort({ date: 1, startTime: 1 });

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

// ==============================
// UPDATE LECTURE
// ==============================
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

    // 1. Find lecture
    const lecture = await Lecture.findById(id);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // New values or existing values
    const newInstructor = instructor || lecture.instructor;
    const newDate = date ? new Date(date) : lecture.date;
    const newStartTime = startTime || lecture.startTime;
    const newEndTime = endTime || lecture.endTime;
    const newRoom = room !== undefined ? room : lecture.room;

    // 2. Validate time
    if (newStartTime >= newEndTime) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    // ==========================================
    // 3. CHECK INSTRUCTOR CONFLICT
    // ==========================================

    const instructorLectures = await Lecture.find({
      _id: { $ne: id },
      instructor: newInstructor,
      date: newDate,
    });

    const hasInstructorConflict = instructorLectures.some((existingLecture) => {
      return (
        newStartTime < existingLecture.endTime &&
        newEndTime > existingLecture.startTime
      );
    });

    if (hasInstructorConflict) {
      return res.status(409).json({
        success: false,
        message: "Instructor already has a lecture at this time",
      });
    }

    // ==========================================
    // 4. CHECK ROOM CONFLICT
    // ==========================================

    if (newRoom) {
      const roomLectures = await Lecture.find({
        _id: { $ne: id },
        room: newRoom,
        date: newDate,
      });

      const hasRoomConflict = roomLectures.some((existingLecture) => {
        return (
          newStartTime < existingLecture.endTime &&
          newEndTime > existingLecture.startTime
        );
      });

      if (hasRoomConflict) {
        return res.status(409).json({
          success: false,
          message: "This room is already booked at this time",
        });
      }
    }

    // ==========================================
    // 5. CHECK COURSE
    // ==========================================

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

    // ==========================================
    // 6. CHECK INSTRUCTOR
    // ==========================================

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

    // ==========================================
    // 7. UPDATE FIELDS
    // ==========================================

    if (date) lecture.date = newDate;
    if (startTime) lecture.startTime = newStartTime;
    if (endTime) lecture.endTime = newEndTime;
    if (title) lecture.title = title;

    if (description !== undefined) {
      lecture.description = description;
    }

    if (room !== undefined) {
      lecture.room = room;
    }

    // 8. Save
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

// ==============================
// DELETE LECTURE
// ==============================
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