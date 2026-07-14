import { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { api } from '../api/client';

export default function Contact() {
  const { portfolio } = usePortfolio();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.submitContact(form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to send message. Please try again later.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-header reveal">
          <h2 className="section-title">Get In Touch</h2>
          <div className="section-line" />
        </div>
        <div className="contact-content">
          <div className="contact-info reveal">
            <h3 className="contact-subtitle">Let's work together</h3>
            <p className="contact-description">
              I'm always interested in new opportunities and challenging projects.
              Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>
            <div className="contact-details">
              {portfolio?.email && (
                <div className="contact-item">
                  <div className="contact-icon"><i className="fas fa-envelope" /></div>
                  <div className="contact-text">
                    <span className="contact-label">Email</span>
                    <span className="contact-value">{portfolio.email}</span>
                  </div>
                </div>
              )}
              {portfolio?.phone && (
                <div className="contact-item">
                  <div className="contact-icon"><i className="fas fa-phone" /></div>
                  <div className="contact-text">
                    <span className="contact-label">Phone</span>
                    <span className="contact-value">{portfolio.phone}</span>
                  </div>
                </div>
              )}
              {portfolio?.location && (
                <div className="contact-item">
                  <div className="contact-icon"><i className="fas fa-map-marker-alt" /></div>
                  <div className="contact-text">
                    <span className="contact-label">Location</span>
                    <span className="contact-value">{portfolio.location}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="social-links">
              {portfolio?.social?.github && (
                <a href={portfolio.social.github} className="social-link" target="_blank" rel="noreferrer" aria-label="GitHub">
                  <i className="fab fa-github" />
                </a>
              )}
              {portfolio?.social?.linkedin && (
                <a href={portfolio.social.linkedin} className="social-link" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <i className="fab fa-linkedin" />
                </a>
              )}
            </div>
          </div>
          <div className="contact-form reveal">
            {success && (
              <div className="toast success">
                <i className="fas fa-check-circle" style={{ marginRight: '8px' }} />
                Message sent successfully!
              </div>
            )}
            {error && (
              <div className="toast error">
                <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }} />
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <input type="email" name="email" placeholder="Your Email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <input type="text" name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <textarea name="message" placeholder="Your Message" value={form.message} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%' }}>
                {submitting ? (
                  <><i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }} />Sending...</>
                ) : (
                  <><i className="fas fa-paper-plane" style={{ marginRight: '8px' }} />Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
