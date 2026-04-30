import { useEffect } from "react";

const featureCards = [
  {
    icon: "🧠",
    title: "Gesture Recognition",
    text: "KNN-based machine learning interpretation using 5 flex sensors plus MPU pitch-roll data.",
  },
  {
    icon: "🗣️",
    title: "Speech Synthesis",
    text: "Detected gesture labels are converted into natural spoken output in real time.",
  },
  {
    icon: "🚨",
    title: "Emergency Alert",
    text: "Critical gestures trigger immediate emergency messaging workflows and notifications.",
  },
  {
    icon: "⚡",
    title: "Live Telemetry",
    text: "High-performance frontend dashboard displays glove values and motion status seamlessly.",
  },
];

const stack = [
  { name: "React", icon: "⚛️" },
  { name: "CSS Modules", icon: "🎨" },
  { name: "Axios", icon: "📡" },
  { name: "Flask", icon: "🌶️" },
  { name: "Python", icon: "🐍" },
  { name: "ESP32", icon: "📟" },
  { name: "Arduino IDE", icon: "♾️" },
  { name: "KNN ML", icon: "🤖" },
];

function ProjectInfoPage() {
  useEffect(() => { document.title = "Smart Glove | Architecture"; }, []);
  return (
    <section>
      <div style={{ marginBottom: '3rem' }}>
        <h1>System Architecture</h1>
        <p className="pageSubtext">
          A comprehensive overview of the Smart Glove's technical foundation, workflow, and technology stack.
        </p>
      </div>

      <section>
        <h2 style={{ color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>Core Capabilities</h2>
        <div className="infoGrid">
          {featureCards.map((feature) => (
            <article className="featureCard" key={feature.title}>
              <div className="featureIcon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="workflowContainer">
        <h2 style={{ marginBottom: '1rem' }}>Data Pipeline</h2>
        <p style={{ color: 'var(--text-muted)' }}>Real-time data flow from hardware to user output.</p>
        
        <div className="workflowSteps">
          <div className="workflowStep">Glove Sensors</div>
          <div className="workflowArrow">➔</div>
          <div className="workflowStep">ESP32</div>
          <div className="workflowArrow">➔</div>
          <div className="workflowStep">Flask ML API</div>
          <div className="workflowArrow">➔</div>
          <div className="workflowStep">React UI</div>
          <div className="workflowArrow">➔</div>
          <div className="workflowStep">Voice Engine</div>
        </div>
      </div>

      <section style={{ marginTop: '3rem' }}>
        <h2 style={{ color: 'var(--accent-secondary)', marginBottom: '1.5rem' }}>Technology Stack</h2>
        <div className="techStack">
          {stack.map((tech) => (
            <span key={tech.name} className="techPill">
              <span>{tech.icon}</span> {tech.name}
            </span>
          ))}
        </div>
      </section>
    </section>
  );
}

export default ProjectInfoPage;
