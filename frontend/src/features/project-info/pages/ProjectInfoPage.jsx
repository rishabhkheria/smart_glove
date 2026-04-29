const featureCards = [
  {
    title: "Gesture Recognition",
    text: "KNN-based interpretation using 5 flex sensors plus MPU pitch-roll data.",
  },
  {
    title: "Speech Output",
    text: "Detected gesture labels are converted into spoken output in real time.",
  },
  {
    title: "Emergency Alert",
    text: "Critical gestures can trigger emergency messaging workflows.",
  },
  {
    title: "Live Monitoring",
    text: "Frontend dashboard displays glove values and motion status live.",
  },
];

const stack = [
  "React",
  "CSS",
  "Axios",
  "Flask",
  "Python",
  "ESP32",
  "Arduino IDE",
  "KNN ML",
];

function ProjectInfoPage() {
  return (
    <section className="projectInfoPage">
      <h1>Project Information</h1>
      <p className="pageSubtext">
        Complete overview of what the Smart Glove project does and how it is built.
      </p>

      <section className="infoSection" id="features">
        <h2>Features</h2>
        <div className="featureGrid">
          {featureCards.map((feature) => (
            <article className="featureCard" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="infoSection">
        <h2>How It Works</h2>
        <div className="workflowRow">
          <span>Glove Sensors</span>
          <span className="arrow">-&gt;</span>
          <span>ESP32</span>
          <span className="arrow">-&gt;</span>
          <span>Flask API</span>
          <span className="arrow">-&gt;</span>
          <span>React Dashboard</span>
          <span className="arrow">-&gt;</span>
          <span>Voice Output</span>
        </div>
      </section>

      <section className="infoSection">
        <h2>Tech Stack</h2>
        <div className="stackGrid">
          {stack.map((tech) => (
            <span key={tech} className="stackPill">
              {tech}
            </span>
          ))}
        </div>
      </section>
    </section>
  );
}

export default ProjectInfoPage;
