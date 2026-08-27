import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "https://online-lecture-scheduling-backend-kgcl.onrender.com/api/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Logged in user:", user);

      if (user.role === "admin") {
        window.location.href = "/admin";
      } else if (user.role === "instructor") {
        window.location.href = "/instructor";
      } else {
        alert("Unknown user role");
      }
    } catch (error) {
      console.error("Login error:", error);

      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

        * { box-sizing: border-box; }

        .login-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #EDEAE1;
          font-family: 'Inter', sans-serif;
          padding: 24px;
        }

        .login-container {
          width: 100%;
          max-width: 1040px;
          min-height: 620px;
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          background: #FAF7F0;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 30px 70px -25px rgba(20, 33, 61, 0.35);
        }

        .login-info {
          background: #14213D;
          background-image:
            radial-gradient(circle at 85% 10%, rgba(232, 163, 61, 0.10), transparent 45%),
            radial-gradient(circle at 0% 100%, rgba(232, 163, 61, 0.06), transparent 40%);
          color: #F4F1E8;
          padding: 48px 44px 36px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-icon {
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

        .brand span {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 18px;
          letter-spacing: 0.01em;
        }

        .info-content { margin: 40px 0 8px; }

        .small-heading {
          font-size: 11.5px;
          letter-spacing: 0.16em;
          color: #E8A33D;
          font-weight: 600;
          margin: 0 0 18px;
          text-transform: uppercase;
        }

        .info-content h1 {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 40px;
          line-height: 1.15;
          margin: 0 0 18px;
          color: #FAF7F0;
        }

        .info-content h1 span {
          color: #E8A33D;
          font-style: italic;
        }

        .info-description {
          font-size: 15px;
          line-height: 1.65;
          color: #B9BFCE;
          margin: 0 0 32px;
          max-width: 380px;
        }

        .timetable {
          display: grid;
          grid-template-columns: 34px repeat(5, 1fr);
          grid-auto-rows: 20px;
          gap: 4px;
          margin-bottom: 32px;
          max-width: 380px;
        }

        .tt-corner { grid-column: 1; grid-row: 1; }

        .tt-day {
          font-size: 10px;
          color: #7C8298;
          text-align: center;
          font-weight: 500;
          letter-spacing: 0.03em;
        }

        .tt-time {
          font-size: 9.5px;
          color: #7C8298;
          display: flex;
          align-items: center;
        }

        .tt-cell {
          background: rgba(255, 255, 255, 0.045);
          border-radius: 3px;
        }

        .tt-block {
          border-radius: 4px;
          opacity: 0;
          animation: ttFadeIn 0.5s ease forwards;
        }

        .tt-block.filled { background: rgba(232, 163, 61, 0.85); }
        .tt-block.outline {
          background: transparent;
          border: 1.4px dashed rgba(232, 163, 61, 0.6);
        }
        .tt-block.live {
          background: rgba(232, 163, 61, 0.85);
          box-shadow: 0 0 0 0 rgba(232, 163, 61, 0.55);
          animation: ttFadeIn 0.5s ease forwards, ttPulse 2.2s ease-in-out 1s infinite;
        }

        @keyframes ttFadeIn {
          from { opacity: 0; transform: translateY(3px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes ttPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232, 163, 61, 0.45); }
          50% { box-shadow: 0 0 0 5px rgba(232, 163, 61, 0); }
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 13px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .feature span {
          width: 19px;
          height: 19px;
          min-width: 19px;
          border-radius: 50%;
          background: rgba(232, 163, 61, 0.16);
          color: #E8A33D;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature p {
          margin: 0;
          font-size: 13.5px;
          color: #D6DAE4;
        }

        .copyright {
          font-size: 12px;
          color: #5C637A;
          margin: 0;
        }

        .login-form-section {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 44px;
        }

        .login-form-container {
          width: 100%;
          max-width: 340px;
        }

        .welcome-icon {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background: #F3ECDC;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          margin-bottom: 20px;
        }

        .login-form-container h2 {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 27px;
          color: #14213D;
          margin: 0 0 6px;
        }

        .form-subtitle {
          font-size: 14px;
          color: #7A7F72;
          margin: 0 0 30px;
        }

        .form-group { margin-bottom: 18px; }

        .form-group label {
          display: block;
          font-size: 12.5px;
          font-weight: 500;
          color: #3D4152;
          margin-bottom: 7px;
        }

        .form-group input {
          width: 100%;
          padding: 12px 14px;
          border: 1.4px solid #E4E0D3;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          background: #FFFFFF;
          color: #14213D;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .form-group input::placeholder { color: #B3AF9F; }

        .form-group input:focus {
          border-color: #E8A33D;
          box-shadow: 0 0 0 3px rgba(232, 163, 61, 0.15);
        }

        .password-row {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 13px;
          top: 38px;
          background: none;
          border: none;
          font-size: 12px;
          color: #8A8E80;
          cursor: pointer;
          padding: 0;
        }

        .form-meta {
          display: flex;
          justify-content: flex-end;
          margin: -6px 0 22px;
        }

        .form-meta a {
          font-size: 12.5px;
          color: #C97F1D;
          text-decoration: none;
          font-weight: 500;
        }

        .login-button {
          width: 100%;
          padding: 13px;
          background: #14213D;
          color: #FAF7F0;
          border: none;
          border-radius: 10px;
          font-size: 14.5px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.15s ease, transform 0.1s ease;
        }

        .login-button:hover { background: #1D2E52; }
        .login-button:active { transform: scale(0.98); }

        .login-button span {
          transition: transform 0.15s ease;
        }

        .login-button:hover span {
          transform: translateX(3px);
        }

        .secure-text {
          text-align: center;
          font-size: 12px;
          color: #9A9686;
          margin: 22px 0 0;
        }

        @media (max-width: 820px) {
          .login-container { grid-template-columns: 1fr; }
          .login-info { display: none; }
          .login-form-section { padding: 40px 28px; }
        }
      `}</style>

      <div className="login-container">
        {/* LEFT SIDE */}
        <div className="login-info">
          <div className="brand">
            <div className="brand-icon">L</div>
            <span>LectureFlow</span>
          </div>

          <div className="info-content">
            <p className="small-heading">Online lecture scheduling</p>
            <h1>
              Every lecture,
              <br />
              <span>perfectly</span> timed.
            </h1>
            <p className="info-description">
              One dashboard for courses, instructors and rooms — built so
              scheduling conflicts can't happen.
            </p>

            <div className="timetable" aria-hidden="true">
              <div className="tt-corner" />
              <div className="tt-day">M</div>
              <div className="tt-day">T</div>
              <div className="tt-day">W</div>
              <div className="tt-day">T</div>
              <div className="tt-day">F</div>

              <div className="tt-time">9</div>
              <div className="tt-cell" />
              <div
                className="tt-block filled"
                style={{ gridRow: "span 2", animationDelay: "0.05s" }}
              />
              <div className="tt-cell" style={{ animationDelay: "0.1s" }} />
              <div className="tt-cell" />
              <div
                className="tt-block outline"
                style={{ animationDelay: "0.15s" }}
              />

              <div className="tt-time">10</div>
              <div
                className="tt-block filled"
                style={{ animationDelay: "0.1s" }}
              />
              <div className="tt-cell" />
              <div
                className="tt-block live"
                style={{ gridRow: "span 2", animationDelay: "0.2s" }}
              />
              <div
                className="tt-block filled"
                style={{ animationDelay: "0.25s" }}
              />
              <div className="tt-cell" />

              <div className="tt-time">11</div>
              <div className="tt-cell" />
              <div
                className="tt-block filled"
                style={{ animationDelay: "0.3s" }}
              />
              <div className="tt-cell" />
              <div
                className="tt-block outline"
                style={{ animationDelay: "0.35s" }}
              />
              <div
                className="tt-block filled"
                style={{ animationDelay: "0.4s" }}
              />

              <div className="tt-time">12</div>
              <div
                className="tt-block filled"
                style={{ animationDelay: "0.45s" }}
              />
              <div className="tt-cell" />
              <div className="tt-cell" />
              <div className="tt-cell" />
              <div
                className="tt-block filled"
                style={{ animationDelay: "0.5s" }}
              />
            </div>

            <div className="features">
              <div className="feature">
                <span>✓</span>
                <p>Build course timetables in minutes</p>
              </div>
              <div className="feature">
                <span>✓</span>
                <p>Catch scheduling conflicts before they happen</p>
              </div>
              <div className="feature">
                <span>✓</span>
                <p>Keep instructors and rooms in sync</p>
              </div>
            </div>
          </div>

          <p className="copyright">© 2026 LectureFlow</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-form-section">
          <div className="login-form-container">
            <div className="welcome-icon">👋</div>
            <h2>Welcome back</h2>
            <p className="form-subtitle">
              Sign in to continue to your dashboard
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="form-group password-row">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="form-meta">
                <a href="#forgot">Forgot password?</a>
              </div>

              <button type="submit" className="login-button">
                Sign In
                <span>→</span>
              </button>
            </form>

            <p className="secure-text">🔒 Secure login • Role-based access</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
