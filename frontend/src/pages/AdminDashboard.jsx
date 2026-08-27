import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const [instructors, setInstructors] = useState([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);

  const [lectures, setLectures] = useState([]);
  const [loadingLectures, setLoadingLectures] = useState(false);

  const [showCourseForm, setShowCourseForm] = useState(false);
  const [savingCourse, setSavingCourse] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);

  const [showLectureForm, setShowLectureForm] = useState(false);
  const [savingLecture, setSavingLecture] = useState(false);
  const [editingLectureId, setEditingLectureId] = useState(null);

  const [courseForm, setCourseForm] = useState({
    name: "",
    level: "",
    description: "",
    image: "",
  });

  const [lectureForm, setLectureForm] = useState({
    course: "",
    instructor: "",
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    room: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const token = localStorage.getItem("token");

      const response = await axios.get("https://online-lecture-scheduling-backend-kgcl.onrender.com/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourses(response.data.courses || []);
    } catch (error) {
      console.error("FETCH COURSES ERROR:", error);
      alert(error.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      setLoadingInstructors(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://online-lecture-scheduling-backend-kgcl.onrender.com/api/auth/instructors",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInstructors(response.data.instructors || []);
    } catch (error) {
      console.error("FETCH INSTRUCTORS ERROR:", error);
      alert(error.response?.data?.message || "Failed to fetch instructors");
    } finally {
      setLoadingInstructors(false);
    }
  };

  const fetchLectures = async () => {
    try {
      setLoadingLectures(true);
      const token = localStorage.getItem("token");

      const response = await axios.get("https://online-lecture-scheduling-backend-kgcl.onrender.com/api/lectures", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("LECTURES RESPONSE:", response.data);
      setLectures(response.data.lectures || []);
    } catch (error) {
      console.error("FETCH LECTURES ERROR:", error);
      alert(error.response?.data?.message || "Failed to fetch lectures");
    } finally {
      setLoadingLectures(false);
    }
  };

  const openCreateCourseForm = () => {
    setEditingCourseId(null);
    setCourseForm({ name: "", level: "", description: "", image: "" });
    setShowCourseForm(true);
  };

  const openEditCourseForm = (course) => {
    setEditingCourseId(course._id);
    setCourseForm({
      name: course.name || "",
      level: course.level || "",
      description: course.description || "",
      image: course.image || "",
    });
    setShowCourseForm(true);
  };

  const closeCourseForm = () => {
    setShowCourseForm(false);
    setEditingCourseId(null);
    setCourseForm({ name: "", level: "", description: "", image: "" });
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();

    try {
      setSavingCourse(true);
      const token = localStorage.getItem("token");

      if (editingCourseId) {
        await axios.put(
          `https://online-lecture-scheduling-backend-kgcl.onrender.com/api/courses/${editingCourseId}`,
          courseForm,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        alert("Course updated successfully");
      } else {
        await axios.post("https://online-lecture-scheduling-backend-kgcl.onrender.com/api/courses", courseForm, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        alert("Course created successfully");
      }

      closeCourseForm();
      await fetchCourses();
    } catch (error) {
      console.error("COURSE SAVE ERROR:", error);
      alert(error.response?.data?.message || "Failed to save course");
    } finally {
      setSavingCourse(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://online-lecture-scheduling-backend-kgcl.onrender.com/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Course deleted successfully");
      await fetchCourses();
    } catch (error) {
      console.error("DELETE COURSE ERROR:", error);
      alert(error.response?.data?.message || "Failed to delete course");
    }
  };

  const openCreateLectureForm = () => {
    setEditingLectureId(null);
    setLectureForm({
      course: "",
      instructor: "",
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      room: "",
    });
    setShowLectureForm(true);
  };

  const openEditLectureForm = (lecture) => {
    setEditingLectureId(lecture._id);
    setLectureForm({
      course: lecture.course?._id || "",
      instructor: lecture.instructor?._id || "",
      title: lecture.title || "",
      description: lecture.description || "",
      date: lecture.date
        ? new Date(lecture.date).toISOString().split("T")[0]
        : "",
      startTime: lecture.startTime || "",
      endTime: lecture.endTime || "",
      room: lecture.room || "",
    });
    setShowLectureForm(true);
  };

  const closeLectureForm = () => {
    setShowLectureForm(false);
    setEditingLectureId(null);
    setLectureForm({
      course: "",
      instructor: "",
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      room: "",
    });
  };

  const handleLectureSubmit = async (e) => {
    e.preventDefault();

    try {
      setSavingLecture(true);
      const token = localStorage.getItem("token");

      if (editingLectureId) {
        await axios.put(
          `https://online-lecture-scheduling-backend-kgcl.onrender.com/api/lectures/${editingLectureId}`,
          lectureForm,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        alert("Lecture updated successfully");
      } else {
        await axios.post("https://online-lecture-scheduling-backend-kgcl.onrender.com/api/lectures", lectureForm, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        alert("Lecture created successfully");
      }

      closeLectureForm();
      await fetchLectures();
    } catch (error) {
      console.error("LECTURE SAVE ERROR:", error);
      alert(error.response?.data?.message || "Failed to save lecture");
    } finally {
      setSavingLecture(false);
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lecture?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://online-lecture-scheduling-backend-kgcl.onrender.com/api/lectures/${lectureId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Lecture deleted successfully");
      await fetchLectures();
    } catch (error) {
      console.error("DELETE LECTURE ERROR:", error);
      alert(error.response?.data?.message || "Failed to delete lecture");
    }
  };

  useEffect(() => {
    if (activeMenu === "Courses") {
      fetchCourses();
    }

    if (activeMenu === "Instructors") {
      fetchInstructors();
    }

    if (activeMenu === "Lectures") {
      fetchLectures();
      if (courses.length === 0) fetchCourses();
      if (instructors.length === 0) fetchInstructors();
    }
  }, [activeMenu]);

  const menuItems = [
    { name: "Dashboard", icon: "⌂" },
    { name: "Courses", icon: "▣" },
    { name: "Instructors", icon: "♟" },
    { name: "Lectures", icon: "▤" },
  ];

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="admin-layout">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

        * { box-sizing: border-box; }

        .admin-layout {
          min-height: 100vh;
          display: flex;
          background: #EDEAE1;
          color: #14213D;
          font-family: 'Inter', sans-serif;
        }

        .sidebar {
          width: 250px;
          min-height: 100vh;
          background: #14213D;
          background-image: radial-gradient(circle at 100% 0%, rgba(232, 163, 61, 0.08), transparent 45%);
          color: #F4F1E8;
          padding: 26px 16px;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          margin-bottom: 36px;
        }

        .logo-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: #E8A33D;
          color: #14213D;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 17px;
        }

        .sidebar-logo span {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 17px;
          letter-spacing: 0.01em;
        }

        .sidebar-menu { display: flex; flex-direction: column; gap: 4px; }

        .menu-item {
          width: 100%;
          border: none;
          background: transparent;
          color: #A9AFC2;
          padding: 12px 14px;
          border-radius: 9px;
          text-align: left;
          font-size: 13.5px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .menu-item span { font-size: 14px; width: 16px; text-align: center; }

        .menu-item:hover { background: rgba(255, 255, 255, 0.06); color: #F4F1E8; }

        .menu-item.active {
          background: rgba(232, 163, 61, 0.16);
          color: #E8A33D;
        }

        .logout-button {
          margin-top: auto;
          border: none;
          background: transparent;
          color: #A9AFC2;
          padding: 12px 14px;
          border-radius: 9px;
          text-align: left;
          font-size: 13.5px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 16px;
          margin-top: 12px;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .logout-button:hover { background: rgba(255, 255, 255, 0.06); color: #F4F1E8; }

        .admin-main { flex: 1; padding: 34px 44px; }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 34px;
        }

        .header-label {
          margin: 0 0 6px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #C97F1D;
        }

        .dashboard-header h1 {
          margin: 0;
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 28px;
          color: #14213D;
        }

        .admin-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FAF7F0;
          border: 1px solid #E4E0D3;
          padding: 8px 16px 8px 8px;
          border-radius: 12px;
        }

        .profile-avatar {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #14213D;
          color: #E8A33D;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 15px;
        }

        .admin-profile strong { display: block; font-size: 13.5px; font-weight: 500; color: #14213D; }
        .admin-profile span { display: block; color: #8A8E80; font-size: 11.5px; margin-top: 2px; }

        .welcome-section { margin-bottom: 26px; }

        .welcome-section h2 {
          margin: 0 0 6px;
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 22px;
          color: #14213D;
        }

        .welcome-section p { margin: 0; color: #7A7F72; font-size: 14px; }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: #FAF7F0;
          border: 1px solid #E4E0D3;
          border-radius: 14px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background: rgba(232, 163, 61, 0.14);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .stat-card p { margin: 0 0 4px; color: #8A8E80; font-size: 12.5px; }
        .stat-card h2 { margin: 0; font-family: 'Fraunces', serif; font-weight: 500; font-size: 24px; color: #14213D; }

        .dashboard-section {
          background: #FAF7F0;
          border: 1px solid #E4E0D3;
          border-radius: 14px;
          padding: 24px;
        }

        .section-heading { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
        .section-heading h2 { margin: 0 0 5px; font-family: 'Fraunces', serif; font-weight: 500; font-size: 18px; color: #14213D; }
        .section-heading p { margin: 0; color: #8A8E80; font-size: 13px; }

        .action-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 18px; }

        .action-card {
          border: 1px solid #E4E0D3;
          background: #FFFFFF;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 13px;
          text-align: left;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.15s ease, transform 0.12s ease;
        }

        .action-card:hover { border-color: #E8A33D; transform: translateY(-2px); }
        .action-card > span { font-size: 22px; }
        .action-card div { flex: 1; }
        .action-card h3 { margin: 0 0 3px; font-size: 13.5px; font-weight: 500; color: #14213D; }
        .action-card p { margin: 0; color: #8A8E80; font-size: 11.5px; }
        .action-card b { color: #C97F1D; font-weight: 500; }

        .add-course-button {
          border: none;
          background: #14213D;
          color: #F4F1E8;
          padding: 10px 16px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: 0.2s ease;
          white-space: nowrap;
        }

        .add-course-button:hover { background: #C97F1D; }

        .course-form {
          margin-top: 22px;
          padding: 20px;
          background: #FFFFFF;
          border: 1px solid #E4E0D3;
          border-radius: 12px;
        }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; margin-bottom: 7px; font-size: 12px; font-weight: 600; color: #14213D; }

        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          padding: 11px 12px;
          border: 1px solid #E4E0D3;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          outline: none;
          background: #FFFFFF;
          color: #14213D;
        }

        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #C97F1D; }
        .form-group textarea { min-height: 90px; resize: vertical; }

        .form-buttons { display: flex; gap: 10px; }
        .save-button, .cancel-button { border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; }
        .save-button { background: #14213D; color: #FFFFFF; }
        .save-button:hover { background: #C97F1D; }
        .save-button:disabled { opacity: 0.6; cursor: not-allowed; }
        .cancel-button { background: #EDEAE1; color: #14213D; }
        .cancel-button:hover { background: #E4E0D3; }

        .courses-table-wrapper { width: 100%; overflow-x: auto; }
        .courses-table { width: 100%; border-collapse: collapse; margin-top: 16px; }

        .courses-table th {
          text-align: left;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #8A8E80;
          padding: 10px 14px;
          border-bottom: 1px solid #E4E0D3;
          white-space: nowrap;
        }

        .courses-table td { font-size: 13.5px; color: #14213D; padding: 12px 14px; border-bottom: 1px solid #EFEBE0; }
        .courses-table tr:last-child td { border-bottom: none; }

        .course-description { max-width: 320px; color: #7A7F72 !important; }
        .course-actions { display: flex; gap: 8px; }

        .edit-button, .delete-button { border: none; padding: 7px 11px; border-radius: 7px; font-size: 11.5px; cursor: pointer; white-space: nowrap; }
        .edit-button { background: rgba(232, 163, 61, 0.14); color: #C97F1D; }
        .delete-button { background: #F5E5E2; color: #A23B2A; }
        .edit-button:hover { background: #E8A33D; color: #14213D; }
        .delete-button:hover { background: #A23B2A; color: #FFFFFF; }

        .role-badge {
          padding: 5px 10px;
          border-radius: 20px;
          background: rgba(232, 163, 61, 0.14);
          color: #C97F1D;
          font-size: 12px;
          font-weight: 600;
        }

        .time-badge {
          padding: 4px 9px;
          border-radius: 7px;
          background: #EDEAE1;
          color: #14213D;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
        }

        .empty-state { text-align: center; padding: 40px 20px; color: #8A8E80; font-size: 13.5px; }

        .placeholder-section {
          min-height: 380px;
          background: #FAF7F0;
          border: 1px solid #E4E0D3;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .placeholder-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: rgba(232, 163, 61, 0.14);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 16px;
        }

        .placeholder-section h2 { margin: 0 0 8px; font-family: 'Fraunces', serif; font-weight: 500; font-size: 19px; color: #14213D; }
        .placeholder-section p { color: #8A8E80; font-size: 13.5px; max-width: 320px; }

        @media (max-width: 900px) {
          .stats-grid, .action-grid, .form-row { grid-template-columns: 1fr; }
        }

        @media (max-width: 780px) {
          .admin-layout { flex-direction: column; }
          .sidebar { width: 100%; min-height: auto; position: static; }
          .admin-main { padding: 24px; }
          .section-heading { align-items: flex-start; flex-direction: column; }
          .add-course-button { width: 100%; }
        }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">L</div>
          <span>LectureFlow</span>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={activeMenu === item.name ? "menu-item active" : "menu-item"}
              onClick={() => setActiveMenu(item.name)}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <span>↪</span>
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="dashboard-header">
          <div>
            <p className="header-label">Admin panel</p>
            <h1>{activeMenu}</h1>
          </div>

          <div className="admin-profile">
            <div className="profile-avatar">{user?.name?.charAt(0) || "A"}</div>
            <div>
              <strong>{user?.name || "Admin"}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        {activeMenu === "Dashboard" && (
          <>
            <div className="welcome-section">
              <h2>Welcome back, {user?.name || "Admin"}</h2>
              <p>Here's what's happening with your lecture scheduling system.</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div><p>Total courses</p><h2>{courses.length}</h2></div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">👨‍🏫</div>
                <div><p>Total instructors</p><h2>{instructors.length}</h2></div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🗓️</div>
                <div><p>Total lectures</p><h2>{lectures.length}</h2></div>
              </div>
            </div>

            <section className="dashboard-section">
              <div className="section-heading">
                <div>
                  <h2>Quick actions</h2>
                  <p>Manage your scheduling system quickly.</p>
                </div>
              </div>

              <div className="action-grid">
                <button onClick={() => setActiveMenu("Courses")} className="action-card">
                  <span>📚</span>
                  <div><h3>Manage courses</h3><p>Create and manage courses</p></div>
                  <b>→</b>
                </button>

                <button onClick={() => setActiveMenu("Instructors")} className="action-card">
                  <span>👨‍🏫</span>
                  <div><h3>View instructors</h3><p>Manage all instructors</p></div>
                  <b>→</b>
                </button>

                <button onClick={() => setActiveMenu("Lectures")} className="action-card">
                  <span>🗓️</span>
                  <div><h3>Manage lectures</h3><p>Schedule and manage lectures</p></div>
                  <b>→</b>
                </button>
              </div>
            </section>
          </>
        )}

        {activeMenu === "Courses" && (
          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <h2>Course management</h2>
                <p>Create, update and manage all courses.</p>
              </div>

              <button className="add-course-button" onClick={openCreateCourseForm}>
                + Add Course
              </button>
            </div>

            {showCourseForm && (
              <form className="course-form" onSubmit={handleCourseSubmit}>
                <div className="form-group">
                  <label>Course Name</label>
                  <input
                    type="text"
                    placeholder="e.g. MERN Stack Development"
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Level</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    required
                  >
                    <option value="">Select level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Enter course description"
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/course.jpg"
                    value={courseForm.image}
                    onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                  />
                </div>

                <div className="form-buttons">
                  <button type="submit" className="save-button" disabled={savingCourse}>
                    {savingCourse ? "Saving..." : editingCourseId ? "Update Course" : "Create Course"}
                  </button>
                  <button type="button" className="cancel-button" onClick={closeCourseForm}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {loadingCourses && <div className="empty-state">Loading courses...</div>}
            {!loadingCourses && courses.length === 0 && (
              <div className="empty-state">No courses found yet.</div>
            )}

            {!loadingCourses && courses.length > 0 && (
              <div className="courses-table-wrapper">
                <table className="courses-table">
                  <thead>
                    <tr>
                      <th>Course name</th>
                      <th>Level</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course._id}>
                        <td>{course.name}</td>
                        <td>{course.level}</td>
                        <td className="course-description">{course.description}</td>
                        <td>
                          <div className="course-actions">
                            <button className="edit-button" onClick={() => openEditCourseForm(course)}>
                              Edit
                            </button>
                            <button className="delete-button" onClick={() => handleDeleteCourse(course._id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeMenu === "Instructors" && (
          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <h2>Instructor management</h2>
                <p>All instructors currently registered in the system.</p>
              </div>
            </div>

            {loadingInstructors && <div className="empty-state">Loading instructors...</div>}
            {!loadingInstructors && instructors.length === 0 && (
              <div className="empty-state">No instructors found yet.</div>
            )}

            {!loadingInstructors && instructors.length > 0 && (
              <div className="courses-table-wrapper">
                <table className="courses-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instructors.map((instructor) => (
                      <tr key={instructor._id}>
                        <td>{instructor.name}</td>
                        <td>{instructor.email}</td>
                        <td><span className="role-badge">{instructor.role}</span></td>
                        <td>{formatDate(instructor.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeMenu === "Lectures" && (
          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <h2>Lecture management</h2>
                <p>Schedule and manage all lectures.</p>
              </div>

              <button className="add-course-button" onClick={openCreateLectureForm}>
                + Add Lecture
              </button>
            </div>

            {showLectureForm && (
              <form className="course-form" onSubmit={handleLectureSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Course</label>
                    <select
                      value={lectureForm.course}
                      onChange={(e) => setLectureForm({ ...lectureForm, course: e.target.value })}
                      required
                    >
                      <option value="">Select course</option>
                      {courses.map((course) => (
                        <option key={course._id} value={course._id}>{course.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Instructor</label>
                    <select
                      value={lectureForm.instructor}
                      onChange={(e) => setLectureForm({ ...lectureForm, instructor: e.target.value })}
                      required
                    >
                      <option value="">Select instructor</option>
                      {instructors.map((instructor) => (
                        <option key={instructor._id} value={instructor._id}>{instructor.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Lecture Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Introduction to React Hooks"
                    value={lectureForm.title}
                    onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Enter lecture description"
                    value={lectureForm.description}
                    onChange={(e) => setLectureForm({ ...lectureForm, description: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={lectureForm.date}
                      onChange={(e) => setLectureForm({ ...lectureForm, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Room</label>
                    <input
                      type="text"
                      placeholder="e.g. Room 204"
                      value={lectureForm.room}
                      onChange={(e) => setLectureForm({ ...lectureForm, room: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Time</label>
                    <input
                      type="time"
                      value={lectureForm.startTime}
                      onChange={(e) => setLectureForm({ ...lectureForm, startTime: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>End Time</label>
                    <input
                      type="time"
                      value={lectureForm.endTime}
                      onChange={(e) => setLectureForm({ ...lectureForm, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-buttons">
                  <button type="submit" className="save-button" disabled={savingLecture}>
                    {savingLecture ? "Saving..." : editingLectureId ? "Update Lecture" : "Create Lecture"}
                  </button>
                  <button type="button" className="cancel-button" onClick={closeLectureForm}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {loadingLectures && <div className="empty-state">Loading lectures...</div>}
            {!loadingLectures && lectures.length === 0 && (
              <div className="empty-state">No lectures scheduled yet.</div>
            )}

            {!loadingLectures && lectures.length > 0 && (
              <div className="courses-table-wrapper">
                <table className="courses-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Course</th>
                      <th>Instructor</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Room</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lectures.map((lecture) => (
                      <tr key={lecture._id}>
                        <td>{lecture.title}</td>
                        <td>{lecture.course?.name || "—"}</td>
                        <td>{lecture.instructor?.name || "—"}</td>
                        <td>{formatDate(lecture.date)}</td>
                        <td><span className="time-badge">{lecture.startTime} – {lecture.endTime}</span></td>
                        <td>{lecture.room || "—"}</td>
                        <td>
                          <div className="course-actions">
                            <button className="edit-button" onClick={() => openEditLectureForm(lecture)}>
                              Edit
                            </button>
                            <button className="delete-button" onClick={() => handleDeleteLecture(lecture._id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;