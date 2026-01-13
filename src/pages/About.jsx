import aryan from "../assets/creators/aryan.jpg";
import akshat from "../assets/creators/akshat.jpg";
import parth from "../assets/creators/parth.jpg";
import kamal from "../assets/creators/kamal.jpg";

export default function About() {
  return (
    <div className="page">
      <h1 className="page-title">ℹ️ About Budget Buddy</h1>

      {}
      <div className="glass-card">
        <h2>What is Budget Buddy?</h2>
        <p>
          Budget Buddy is a smart personal finance web application that helps
          users track expenses, plan savings goals, and improve financial
          discipline using real-time data and intelligent insights.
        </p>

        <h3>🚀 Services</h3>
        <ul>
          <li>Expense tracking & budgeting</li>
          <li>Goal-based savings planning</li>
          <li>Reward-driven voucher system</li>
          <li>Advanced analytics & insights</li>
        </ul>

        <h3>✨ Uniqueness</h3>
        <p>
          Budget Buddy gamifies savings by rewarding discipline. It connects
          analytics, planning, and incentives into a single seamless
          experience.
        </p>

        <h3>🌍 Real-Life Problems Solved</h3>
        <p>
          Users often overspend due to lack of awareness and motivation.
          Budget Buddy fixes this by combining tracking, goal planning, and
          real rewards.
        </p>
      </div>

      {}
      <h1 className="page-title">👨‍💻 Creators</h1>

      {}
      <div className="creators-top">
        <div className="creator-card">
          <img src={aryan} alt="Aryan" className="creator-avatar" />
          <h3>Aryan Sharma</h3>
          <p>
            Implemented all ideas and integrated frontend with backend,
            handling authentication, databases, and complete system flow.
          </p>
        </div>
      </div>

      {}
      <div className="creators-grid">
        <div className="creator-card">
          <img src={akshat} alt="Akshat" className="creator-avatar" />
          <h3>Akshat Sharma</h3>
          <p>
            Developed analytics logic, charts, and implemented data analysis
            concepts for meaningful financial insights.
          </p>
        </div>

        <div className="creator-card">
          <img src={parth} alt="Parth" className="creator-avatar" />
          <h3>Parth Aggarwal</h3>
          <p>
            Ideation, PPT creation, and overall design architecture of the
            Budget Buddy project.
          </p>
        </div>

        <div className="creator-card">
          <img src={kamal} alt="Kamal" className="creator-avatar" />
          <h3>Kamal Kumar Kasaudhan</h3>
          <p>
            Project ideation, PPT preparation, and system architecture design.
          </p>
        </div>

        <div className="creator-card">
          <div className="creator-avatar placeholder">👤</div>
          <h3>Priyanshi Saini</h3>
          <p>
            Designed the complete UI theme and layout, focusing on
            glassmorphism and user experience.
          </p>
        </div>
      </div>
    </div>
  );
}
