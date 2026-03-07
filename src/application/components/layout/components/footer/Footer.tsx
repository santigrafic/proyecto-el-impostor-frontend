import type React from "react";

import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="arcade-footer">
      <div className="footer-content">
        © {new Date().getFullYear()} · El Impostor ·{" "}
        <a
          href="https://www.linkedin.com/in/santigrafic/"
          className="footer-link"
          target="_blank"
        >
          David Santiago Gavilan<span className="cursor">_</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
