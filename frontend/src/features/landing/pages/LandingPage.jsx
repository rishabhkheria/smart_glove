import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <section className="heroPage">
      <p className="eyebrow">Assistive Wearable Technology</p>
      <h1>AI Smart Glove for Gesture to Speech Conversion</h1>
      <p className="heroCopy">
        A compact smart glove system that interprets hand gestures, speaks the
        detected meaning, and streams live sensor telemetry for monitoring.
      </p>

      <div className="heroCta">
        <Link to="/dashboard" className="ctaPrimary">
          Open Live Dashboard
        </Link>
        <Link to="/project-info" className="ctaGhost">
          View Full Project Info
        </Link>
      </div>
    </section>
  );
}

export default LandingPage;
