import { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { api } from '../api/client';

/*
  BUG FIX: Contact form always ended up in error state since the backend
  is offline, with no alternative for the user.
  Fix: on backend failure, show a pre-filled mailto: link so the visitor
  can still reach Anup directly with their message already written.
*/
export default function Contact() {
  const { portfolio } = usePortfolio();
  const [form,    setForm]    = useState({ name: '', email: '', message: '' });
  const [status,  setStatus]  = useState(null); // null | 'sending' | 'sent' | 'error'

  if (!portfolio) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    try {
      await api.submitContact(form);
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  // Pre-fill a mailto: link with the form data so users aren't left stranded
  const mailtoHref = portfolio.email
    ? `mailto:${portfolio.email}?subject=${encodeURIComponent('Portfolio Contact')}&body=${encodeURIComponent(
        `Hi Anup,\n\nName: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
      )}`
    : null;

  return (
    <section className="section" id="contact" aria-labelledby="contact-heading">
      <div className="container">

        <div className="section-eyebrow reveal">
          <div className="section-eyebrow-line" />
          <span className="section-eyebrow-text">06 / Open Comms</span>
        </div>

        <h2 className="section-title reveal" id="contact-heading" style={{ transitionDelay: '80ms' }}>
          Get In <span className="accent">Touch</span>
        </h2>

        <div className="contact-grid">

          {/* Left: info */}
          <div className="reveal-left" style={{ transitionDelay: '120ms' }}>
            <h3 className="contact-info-title">Let's build something together.</h3>
            <p className="contact-info-text">
              Looking for an AI / backend / data role. Open to full-time positions,
              freelance missions, and research collaborations. Send a message and I'll
              respond within 24 hours.
            </p>

            {portfolio.email && (
              <div className="contact-detail">
                <div className="contact-detail-icon">
                  <i className="fas fa-envelope" aria-hidden="true" />
                </div>
                <div>
                  <span className="contact-detail-label">Email</span>
                  <a href={`mailto:${portfolio.email}`} className="contact-detail-value" style={{ textDecoration: 'none' }}>
                    {portfolio.email}
                  </a>
                </div>
              </div>
            )}

            {portfolio.phone && (
              <div className="contact-detail">
                <div className="contact-detail-icon">
                  <i className="fas fa-phone" aria-hidden="true" />
                </div>
                <div>
                  <span className="contact-detail-label">Phone</span>
                  <span className="contact-detail-value">{portfolio.phone}</span>
                </div>
              </div>
            )}

            {portfolio.location && (
              <div className="contact-detail">
                <div className="contact-detail-icon">
                  <i className="fas fa-map-marker-alt" aria-hidden="true" />
                </div>
                <div>
                  <span className="contact-detail-label">Location</span>
                  <span className="contact-detail-value">Kolkata, India</span>
                </div>
              </div>
            )}
          </div>

          {/* Right: form */}
          <div className="reveal-right" style={{ transitionDelay: '160ms' }}>
            <form className="contact-form" onSubmit={handleSubmit} noValidate>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="form-textarea"
                  placeholder="What's the mission?"
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === 'sending'}
                style={{ alignSelf: 'flex-start' }}
              >
                {status === 'sending' ? (
                  <>
                    <i className="fas fa-spinner fa-spin" aria-hidden="true" />
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane" aria-hidden="true" />
                    Send Message
                  </>
                )}
              </button>

              {status === 'sent' && (
                <p style={{ color: '#4ade80', fontSize: 13, marginTop: 12 }}>
                  ✓ Message received. I'll be in touch soon.
                </p>
              )}

              {status === 'error' && (
                <p style={{ color: 'var(--red)', fontSize: 13, marginTop: 12, lineHeight: 1.7 }}>
                  Server offline.{' '}
                  {mailtoHref ? (
                    <a href={mailtoHref} style={{ color: 'var(--red)', fontWeight: 700, textDecoration: 'underline' }}>
                      Click here to email me directly
                    </a>
                  ) : (
                    <>Email me at <strong>{portfolio.email}</strong></>
                  )}{' '}
                  — your message will be pre-filled.
                </p>
              )}

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
