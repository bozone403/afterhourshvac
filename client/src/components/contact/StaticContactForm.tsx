import React, { useState } from 'react';
import { sendContactEmail } from '@/lib/static-api';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export const StaticContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // For static deployment, send to PHP handler
      const response = await fetch('/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      } else {
        // Fallback to local storage
        await sendContactEmail(formData);
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      }
    } catch (error) {
      // Fallback to local storage
      await sendContactEmail(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="hvac-heading-lg text-gray-900 mb-4">Message Sent Successfully!</h2>
          <p className="hvac-text-base text-gray-600 mb-6">
            Thank you for contacting After Hours HVAC. We'll get back to you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:4031234567"
              className="hvac-button-primary inline-flex items-center justify-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Now: (403) 123-4567
            </a>
            <button
              onClick={() => setSubmitted(false)}
              className="hvac-button-secondary"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="hvac-heading-xl text-gray-900 mb-4">
          Contact After Hours HVAC
        </h1>
        <p className="hvac-text-lg text-gray-600 max-w-2xl mx-auto">
          Need HVAC service in Calgary? Get in touch for emergency repairs, installations, or maintenance.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="service-card p-8">
          <h2 className="hvac-heading-lg text-gray-900 mb-6">Send Us a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="hvac-input"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="hvac-input"
                  placeholder="(403) 123-4567"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="hvac-input"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                Service Needed
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="hvac-input"
              >
                <option value="">Select a service</option>
                <option value="emergency">Emergency Repair</option>
                <option value="furnace-repair">Furnace Repair</option>
                <option value="ac-installation">AC Installation</option>
                <option value="maintenance">Maintenance</option>
                <option value="duct-cleaning">Duct Cleaning</option>
                <option value="quote">Free Quote</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="hvac-input resize-none"
                placeholder="Describe your HVAC needs or issue..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="hvac-button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          {/* Emergency Contact */}
          <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">24/7 Emergency Service</h3>
            <p className="text-lg mb-6 opacity-90">
              HVAC emergency? Don't wait - call us now!
            </p>
            <a
              href="tel:4031234567"
              className="inline-flex items-center justify-center w-full px-6 py-4 bg-white text-red-600 font-bold text-xl rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Phone className="w-6 h-6 mr-3" />
              (403) 123-4567
            </a>
          </div>

          {/* Contact Details */}
          <div className="service-card p-8">
            <h3 className="hvac-heading-lg text-gray-900 mb-6">Get In Touch</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Phone</h4>
                  <p className="text-gray-600">(403) 123-4567</p>
                  <p className="text-sm text-gray-500">Available 24/7 for emergencies</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <p className="text-gray-600">Jordan@Afterhourshvac.ca</p>
                  <p className="text-sm text-gray-500">We respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Service Area</h4>
                  <p className="text-gray-600">Calgary & Surrounding Areas</p>
                  <p className="text-sm text-gray-500">Including Airdrie, Cochrane, Okotoks</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Business Hours</h4>
                  <p className="text-gray-600">Mon-Fri: 8:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Sat-Sun: Emergency Service Only</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Areas */}
          <div className="service-card p-8">
            <h3 className="hvac-heading-lg text-gray-900 mb-6">Service Areas</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Calgary NW', 'Calgary NE', 'Calgary SW', 'Calgary SE',
                'Airdrie', 'Cochrane', 'Okotoks', 'Chestermere'
              ].map((area) => (
                <div key={area} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
