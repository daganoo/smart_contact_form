import ReCAPTCHA from "react-google-recaptcha";
import useContactForm from "../hooks/useContactForm";

const ContactForm = () => {
  const { formData, errors, status, handleChange, handleSubmit, recaptchaRef } =
    useContactForm();

  return (
    <div className="form-container">
      <h2>Contact Us</h2>
      <p>Fill out the form below and we'll get back to you within 24 hours.</p>

      {status === "success" && (
        <div className="alert alert-success">
          ✅ Message sent! We'll be in touch soon.
        </div>
      )}

      {status === "error" && (
        <div className="alert alert-error">
          ❌ Something went wrong. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={errors.name ? "input-error" : ""}
          />
          {errors.name && <span className="error-msg">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <span className="error-msg">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject *</label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            placeholder="How can we help?"
            className={errors.subject ? "input-error" : ""}
          />
          {errors.subject && <span className="error-msg">{errors.subject}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us more..."
            className={errors.message ? "input-error" : ""}
          />
          {errors.message && <span className="error-msg">{errors.message}</span>}
        </div>

        <div className="form-group">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "your-site-key-here"}
          />
          {errors.recaptcha && <span className="error-msg">{errors.recaptcha}</span>}
        </div>

        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;