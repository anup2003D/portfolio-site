export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Anup Dutta. All rights reserved.</p>
          <div className="footer-links">
            <a href="/Goldman Sachs Application.png" download className="footer-link">
              <i className="fas fa-download" style={{ marginRight: '6px' }} />
              Download CV
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
