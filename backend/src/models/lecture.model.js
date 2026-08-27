// // import mongoose from "mongoose";

// // const lectureSchema = new mongoose.Schema(
// //   {
// //     course: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "Course",
// //       required: true,
// //     },

// //     instructor: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "User",
// //       required: true,
// //     },

// //     date: {
// //       type: Date,
// //       required: true,
// //     },

// //     title: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },

// //     description: {
// //       type: String,
// //       default: "",
// //       trim: true,
// //     },
// //   },
// //   {
// //     timestamps: true,
// //   }
// // );

// // export const Lecture = mongoose.model("Lecture", lectureSchema);


// import mongoose from "mongoose";

// const lectureSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     description: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     date: {
//       type: Date,
//       required: true,
//     },

//     startTime: {
//       type: String,
//       required: true,
//     },

//     endTime: {
//       type: String,
//       required: true,
//     },

//     instructor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Lecture = mongoose.model("Lecture", lectureSchema);

// export default Lecture;


import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    room: {
      type: String,
      default: "",
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;