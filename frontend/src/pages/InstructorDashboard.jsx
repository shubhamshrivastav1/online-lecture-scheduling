import { useEffect, useState } from "react";
import axios from "axios";

function InstructorDashboard() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const fetchMyLectures = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:8000/api/lectures/my-lectures",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("MY LECTURES:", response.data);

      setLectures(response.data.lectures || []);
    } catch (error) {
      console.error("FETCH MY LECTURES ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to fetch your lectures"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLectures();
  }, []);

  const formatDate = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="instructor-layout">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

        * { box-sizing: border-box; }

        .instructor-layout {
          min-height: 100vh;
          background: #EDEAE1;
          color: #14213D;
          font-family: 'Inter', sans-serif;
        }

        .instructor-header {
          background: #14213D;
          background-image: radial-gradient(circle at 100% 0%, rgba(232, 163, 61, 0.08), transparent 45%);
          color: #F4F1E8;
          padding: 22px 44px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-logo-icon {
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

        .header-brand-text h1 {
          margin: 0;
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 19px;
          color: #F4F1E8;
        }

        .header-brand-text p {
          margin: 3px 0 0;
          color: #A9AFC2;
          font-size: 11.5px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .instructor-profile {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .profile-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(232, 163, 61, 0.16);
          color: #E8A33D;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 14px;
        }

        .instructor-profile strong {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #F4F1E8;
        }

        .instructor-profile span {
          display: block;
          color: #A9AFC2;
          font-size: 11px;
          margin-top: 1px;
        }

        .logout-button {
          border: none;
          background: transparent;
          color: #A9AFC2;
          padding: 10px 14px;
          border-radius: 9px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          border: 1px solid rgba(255, 255, 255, 0.14);
          transition: background 0.15s ease, color 0.15s ease;
        }

        .logout-button:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #F4F1E8;
        }

        .instructor-main {
          padding: 38px 44px;
        }

        .welcome-section {
          margin-bottom: 26px;
        }

        .welcome-section h2 {
          margin: 0 0 6px;
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 22px;
          color: #14213D;
        }

        .welcome-section p {
          margin: 0;
          color: #7A7F72;
          font-size: 14px;
        }

        .lecture-section {
          background: #FAF7F0;
          border: 1px solid #E4E0D3;
          border-radius: 14px;
          padding: 24px;
        }

        .lecture-section h2 {
          margin: 0 0 5px;
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 18px;
          color: #14213D;
        }

        .lecture-section > p {
          margin-top: 0;
          color: #8A8E80;
          font-size: 13px;
        }

        .lecture-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .lecture-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 18px;
        }

        .lecture-table th {
          text-align: left;
          padding: 10px 14px;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #8A8E80;
          border-bottom: 1px solid #E4E0D3;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .lecture-table td {
          padding: 13px 14px;
          font-size: 13.5px;
          color: #14213D;
          border-bottom: 1px solid #EFEBE0;
        }

        .lecture-table tr:last-child td {
          border-bottom: none;
        }

        .time-badge {
          background: #EDEAE1;
          color: #14213D;
          padding: 4px 9px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #8A8E80;
          font-size: 13.5px;
        }

        @media (max-width: 700px) {
          .instructor-header {
            padding: 18px 22px;
            flex-wrap: wrap;
            gap: 14px;
          }

          .instructor-main {
            padding: 26px 22px;
          }

          .header-brand-text h1 {
            font-size: 17px;
          }
        }
      `}</style>

      <header className="instructor-header">
        <div className="header-brand">
          <div className="header-logo-icon">L</div>
          <div className="header-brand-text">
            <h1>LectureFlow</h1>
            <p>Instructor panel</p>
          </div>
        </div>

        <div className="header-right">
          <div className="instructor-profile">
            <div className="profile-avatar">
              {user?.name?.charAt(0) || "I"}
            </div>
            <div>
              <strong>{user?.name || "Instructor"}</strong>
              <span>Instructor</span>
            </div>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="instructor-main">
        <div className="welcome-section">
          <h2>Welcome, {user?.name || "Instructor"}</h2>
          <p>Here are your assigned lectures.</p>
        </div>

        <section className="lecture-section">
          <h2>My lectures</h2>
          <p>Lectures assigned to you by the administrator.</p>

          {loading && (
            <div className="empty-state">Loading lectures...</div>
          )}

          {!loading && lectures.length === 0 && (
            <div className="empty-state">No lectures assigned yet.</div>
          )}

          {!loading && lectures.length > 0 && (
            <div className="lecture-table-wrapper">
              <table className="lecture-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Course</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Room</th>
                  </tr>
                </thead>

                <tbody>
                  {lectures.map((lecture) => (
                    <tr key={lecture._id}>
                      <td>{lecture.title}</td>
                      <td>{lecture.course?.name || "—"}</td>
                      <td>{formatDate(lecture.date)}</td>
                      <td>
                        <span className="time-badge">
                          {lecture.startTime} – {lecture.endTime}
                        </span>
                      </td>
                      <td>{lecture.room || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default InstructorDashboard;