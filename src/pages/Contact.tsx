import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, MessageCircle, Send, CheckCircle2, Navigation } from 'lucide-react';
import { BUSINESS_INFO } from '../data';
import { EnquiryFormData } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<EnquiryFormData>({
    fullName: '',
    phone: '',
    category: 'Living Room',
    subject: '',
    message: '',
    preferredContact: 'WhatsApp',
  });

  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields (Name, Phone, Message).');
      return;
    }
    if (formData.fullName.trim().length < 2 || formData.fullName.trim().length > 120 ||
        formData.phone.trim().length < 5 || formData.phone.trim().length > 40 ||
        formData.message.trim().length < 3 || formData.message.trim().length > 5000) {
      setError('Please check your details. Name, phone, or message is outside the allowed length.');
      return;
    }
    if (!isSupabaseConfigured || !supabase) {
      setError('The enquiry service is temporarily unavailable. Please contact us by phone or WhatsApp.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const { error: insertError } = await supabase.from('enquiries').insert({
        full_name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        category: formData.category,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        preferred_contact: formData.preferredContact,
      });
      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err) {
      console.error('Unable to save enquiry:', err);
      setError('We could not save your enquiry. Please try again or contact us by phone or WhatsApp.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1E8] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#5A3E2B] font-semibold block mb-4">
            Get In Touch
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#1C1511] mb-6">
            FIND THE RIGHT PIECE FOR YOUR SPACE.
          </h1>
          <p className="font-sans text-base sm:text-lg text-[#3A271C] font-light leading-relaxed">
            Visit our showroom in Jos or reach out to our team via phone, WhatsApp, or our enquiry form below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information & Map Directions */}
          <div className="space-y-8">
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-[#D8CEC0]">
              <div className="flex flex-col mb-8">
                <span className="font-serif text-2xl font-light tracking-[0.2em] text-[#1C1511]">
                  TATARI
                </span>
                <span className="text-xs font-sans tracking-[0.3em] text-[#C9A45C] uppercase">
                  Furniture Store
                </span>
              </div>

              <div className="space-y-6 text-[#3A271C]">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full aspect-square bg-[#C9A45C]/20 text-[#5A3E2B] flex items-center justify-center mr-4 shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-[#1C1511] mb-1">
                      Showroom Address
                    </h3>
                    <p className="font-light text-base leading-relaxed">
                      {BUSINESS_INFO.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full aspect-square bg-[#C9A45C]/20 text-[#5A3E2B] flex items-center justify-center mr-4 shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-[#1C1511] mb-1">
                      Phone Number
                    </h3>
                    <p className="font-light text-base">
                      {BUSINESS_INFO.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-[#D8CEC0] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={`tel:${BUSINESS_INFO.phoneInternational}`}
                  className="inline-flex items-center justify-center rounded-full bg-[#1C1511] hover:bg-[#3A271C] text-[#F6F1E8] font-medium text-xs tracking-wider uppercase px-6 py-4 transition-colors shadow-md"
                >
                  <Phone className="w-4 h-4 mr-2 text-[#C9A45C]" />
                  Call Tatari Furniture
                </a>

                <a
                  href={BUSINESS_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-[#25D366] text-white font-medium text-xs tracking-wider uppercase px-6 py-4 hover:opacity-90 transition-opacity shadow-md"
                >
                  <MessageCircle className="w-4 h-4 mr-2 fill-current" />
                  WhatsApp Us
                </a>
              </div>

              <div className="mt-4">
                <a
                  href={BUSINESS_INFO.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full rounded-full bg-[#C9A45C] hover:bg-[#DFC27A] text-[#1C1511] font-medium text-xs tracking-wider uppercase px-6 py-4 transition-colors shadow-md"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions to Showroom
                </a>
              </div>
            </div>

            {/* Map Preview card */}
            <div className="bg-[#1C1511] text-[#F6F1E8] p-8 rounded-3xl shadow-xl flex flex-col justify-between">
              <h3 className="font-serif text-2xl font-normal mb-3">
                Plan Your Visit
              </h3>
              <p className="text-[#D8CEC0] text-sm font-light leading-relaxed mb-6">
                Our showroom at 179 Dogon Karfi, Jos is fully stocked with living room sets, bedroom suites, and custom options. Stop by today.
              </p>
              <a
                href={BUSINESS_INFO.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-[#F6F1E8] border border-white/20 font-medium text-xs tracking-wider uppercase px-6 py-3 transition-colors"
              >
                Open in Google Maps
              </a>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-[#D8CEC0]">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1C1511] mb-2">
              Furniture Enquiry Form
            </h2>
            <p className="text-xs text-[#3A271C] font-light mb-8">
              Send us details about the furniture you are looking for, and our team will respond promptly.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#F6F1E8] border border-[#C9A45C] p-8 rounded-2xl text-center my-12"
              >
                <div className="w-16 h-16 rounded-full aspect-square bg-[#C9A45C] text-[#1C1511] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#1C1511] mb-2">
                  Enquiry Received
                </h3>
                <p className="text-[#3A271C] text-sm font-light mb-6">
                  Thank you, {formData.fullName}. Your enquiry regarding {formData.category} has been recorded. We will contact you via {formData.preferredContact} at {formData.phone}.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      fullName: '',
                      phone: '',
                      category: 'Living Room',
                      subject: '',
                      message: '',
                      preferredContact: 'WhatsApp',
                    });
                  }}
                  className="rounded-full bg-[#1C1511] text-[#F6F1E8] text-xs uppercase tracking-wider px-6 py-3 font-medium hover:bg-[#3A271C] transition-colors"
                >
                  Send Another Enquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#3A271C] font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-[#D8CEC0] focus:outline-none focus:ring-2 focus:ring-[#C9A45C] text-sm bg-[#F6F1E8]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#3A271C] font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 0803 217 4376"
                    className="w-full px-4 py-3 rounded-xl border border-[#D8CEC0] focus:outline-none focus:ring-2 focus:ring-[#C9A45C] text-sm bg-[#F6F1E8]/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#3A271C] font-medium mb-2">
                      Furniture Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-[#D8CEC0] focus:outline-none focus:ring-2 focus:ring-[#C9A45C] text-sm bg-[#F6F1E8]/30"
                    >
                      <option value="Living Room">Living Room</option>
                      <option value="Bedroom">Bedroom</option>
                      <option value="Custom Furniture">Custom Furniture</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#3A271C] font-medium mb-2">
                      Preferred Contact Method
                    </label>
                    <select
                      name="preferredContact"
                      value={formData.preferredContact}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-[#D8CEC0] focus:outline-none focus:ring-2 focus:ring-[#C9A45C] text-sm bg-[#F6F1E8]/30"
                    >
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Phone Call">Phone Call</option>
                      <option value="Either">Either</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#3A271C] font-medium mb-2">
                    What Are You Looking For? (Subject)
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Sectional sofa or custom king bed"
                    className="w-full px-4 py-3 rounded-xl border border-[#D8CEC0] focus:outline-none focus:ring-2 focus:ring-[#C9A45C] text-sm bg-[#F6F1E8]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#3A271C] font-medium mb-2">
                    Message / Details *
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share dimensions, color preferences, or specific questions..."
                    className="w-full px-4 py-3 rounded-xl border border-[#D8CEC0] focus:outline-none focus:ring-2 focus:ring-[#C9A45C] text-sm bg-[#F6F1E8]/30 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full inline-flex items-center justify-center rounded-full bg-[#1C1511] hover:bg-[#3A271C] text-[#F6F1E8] font-medium text-xs tracking-wider uppercase py-4 transition-colors shadow-lg"
                >
                  <Send className="w-4 h-4 mr-2 text-[#C9A45C]" />
                  {saving ? "Sending..." : "Send Enquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
