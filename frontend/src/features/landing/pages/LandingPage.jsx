import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <section className="heroSection">
      <div className="heroBadge">
        <div className="pulseDot"></div>
        Assistive Wearable Technology
      </div>
      
      <h1>AI Smart Glove for<br/>Gesture to Speech</h1>
      
      <p className="pageSubtext" style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
        A next-generation compact smart glove system. Interprets hand gestures in real-time, 
        speaks the detected meaning via AI, and streams live sensor telemetry to a premium dashboard.
      </p>

      <div className="heroCta">
        <Link to="/dashboard" className="btn btnPrimary">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          Open Live Dashboard
        </Link>
        <Link to="/project-info" className="btn btnSecondary">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="12" x2="2" y2="12"></line>
            <polyline points="15 5 22 12 15 19"></polyline>
          </svg>
          View Architecture
        </Link>
      </div>
    </section>
  );
}

export default LandingPage;
