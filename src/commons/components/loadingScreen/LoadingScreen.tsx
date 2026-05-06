import "./LoadingScreen.css";

export default function LoadingScreen() {
  return (
    <div className="loading-container">
      <div className="terminal">
        <div className="scanline"></div>

        <p>&gt; Connecting to server...</p>
        <p>&gt; Initializing system...</p>

        <div className="progress-bar">
          <div className="progress"></div>
        </div>
      </div>
    </div>
  );
}