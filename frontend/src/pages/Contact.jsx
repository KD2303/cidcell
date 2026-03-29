import { useState } from 'react';
import { Mail, MapPin, Send, Github, Linkedin, Instagram, Globe, Clock, ExternalLink } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-highlight-cream border-b-3 border-black relative overflow-hidden">
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block px-4 py-1 bg-black text-white text-sm font-bold uppercase mb-4 shadow-neo transform -rotate-2">
            Reach Out
          </span>
          <h1 className="font-heading text-5xl md:text-7xl font-black text-black mb-6 uppercase leading-none">
            Get in <span className="p-1 md:p-2 bg-highlight-orange text-black inline-block transform rotate-1 border-3 border-black shadow-small">Touch</span>
          </h1>
          <p className="text-black text-xl font-medium max-w-2xl mx-auto border-l-4 border-black pl-4">
            Contact Madhav Institute of Technology & Science for academic, administrative, or research inquiries.
          </p>
        </div>
      </section>

      {/* Main Info Section */}
      <section className="section-padding bg-white border-b-3 border-black">
        <div className="container-max mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info Sidebar */}
            <ScrollReveal className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="font-heading font-black text-3xl text-black mb-4 uppercase">
                  Main Campus
                </h3>
                <p className="text-black font-medium leading-relaxed mb-6 border-l-4 border-highlight-blue pl-4">
                  Our flagship campus is conveniently located in the heart of Gwalior, offering state-of-the-art facilities in a modern academic environment.
                </p>
              </div>

              {/* Primary Contacts */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 bg-highlight-blue/10 p-4 border-3 border-black shadow-small">
                  <div className="w-10 h-10 bg-white border-3 border-black flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-black" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-black uppercase text-xs mb-1">Address</h4>
                    <p className="text-black text-sm font-medium leading-tight">
                      CSE Dept, MITS Gwalior - Gola ka Mandir, Gwalior - 474005,<br />
                      Madhya Pradesh, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-highlight-green/10 p-4 border-3 border-black shadow-small">
                  <div className="w-10 h-10 bg-white border-3 border-black flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-black" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-black uppercase text-xs mb-1">Email</h4>
                    <a href="mailto:director@mitsgwalior.in" className="text-black font-medium text-sm hover:text-highlight-purple transition-colors underline decoration-2 underline-offset-2">
                      director@mitsgwalior.in
                    </a>
                  </div>
                </div>

                
              </div>

              {/* Department Contacts */}
              <div className="bg-highlight-pink/5 border-3 border-black p-6 shadow-small">
                <h4 className="font-heading font-black text-xl text-black mb-4 uppercase inline-block border-b-2 border-black pb-1">Department Contacts</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-500">Admissions & Student Services</p>
                    <p className="font-bold text-black">+91 9343250503</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-500">Registrar Office</p>
                    <p className="font-bold text-black">+91 6267473144</p>
                  </div>

                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-black text-white p-6 shadow-small transform -rotate-1">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="text-highlight-yellow" size={18} />
                  <h4 className="font-heading font-black text-lg uppercase">Office Hours</h4>
                </div>
                <ul className="text-xs space-y-2 font-bold uppercase tracking-wider">
                  <li className="flex justify-between">
                    <span>Mon - Fri</span>
                    <span className="text-highlight-yellow">8:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday</span>
                    <span className="text-highlight-yellow">9:00 AM - 1:00 PM</span>
                  </li>
                  <li className="flex justify-between text-gray-400">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            {/* Contact Form & Social */}
            <ScrollReveal className="lg:col-span-3 space-y-12" delay={200}>
              <div className="bg-highlight-cream border-3 border-black p-8 lg:p-10 shadow-neo transform rotate-1">
                <h3 className="font-heading font-black text-3xl text-black mb-2 uppercase">Send a Message</h3>
                <p className="text-black font-medium mb-8 border-b-2 border-black pb-4">Fill in the form below for any specific requests or feedback.</p>

                {submitted && (
                  <div className="mb-8 p-4 bg-highlight-green border-3 border-black text-black font-bold shadow-small flex items-center gap-3">
                    <span className="text-xl">👍</span> Message sent successfully. We will get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-black uppercase mb-1.5 tracking-widest">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white border-3 border-black focus:shadow-neo outline-none transition-all font-bold placeholder:text-gray-400 text-sm"
                        placeholder=" YOUR NAME"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-black uppercase mb-1.5 tracking-widest">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white border-3 border-black focus:shadow-neo outline-none transition-all font-bold placeholder:text-gray-400 text-sm"
                        placeholder=" YOU@EMAIL.COM"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-black uppercase mb-1.5 tracking-widest">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-white border-3 border-black focus:shadow-neo outline-none transition-all font-bold placeholder:text-gray-400 resize-none text-sm"
                      placeholder=" HOW CAN WE HELP YOU?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-black text-white font-black uppercase tracking-wider text-lg border-3 border-transparent hover:bg-white hover:text-black hover:border-black hover:shadow-neo transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={18} strokeWidth={3} />
                    Send Message
                  </button>
                </form>
              </div>

              {/* Online Resources Card */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border-3 border-black p-6 shadow-small">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe size={18} className="text-highlight-teal" />
                    <h4 className="font-heading font-black text-lg uppercase">Online Resources</h4>
                  </div>
                  <ul className="space-y-3">
                    {[
                      { name: 'Main Website', url: 'https://web.mitsgwalior.in' },
                      { name: 'IMS Portal (MITS)', url: 'https://ims.mitsgwalior.in' },
                      { name: 'IUMS Portal (MITS-DU)', url: 'https://iums.mitsgwalior.in' },
                    ].map((link) => (
                      <li key={link.name}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group hover:bg-highlight-teal transition-all p-2 -m-2 border-2 border-transparent hover:border-black">
                          <span className="text-xs font-bold uppercase text-black">{link.name}</span>
                          <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border-3 border-black p-6 shadow-small">
                  <div className="flex items-center gap-2 mb-4">
                    <Instagram size={18} className="text-highlight-pink" />
                    <h4 className="font-heading font-black text-lg uppercase">Social Connect</h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { icon: Github, href: 'https://github.com/CID-CELL', label: 'GitHub', color: 'bg-black text-white' },
                      { icon: Linkedin, href: 'https://www.linkedin.com/company/cidcellmits/', label: 'LinkedIn', color: 'bg-highlight-blue' },
                      { icon: Instagram, href: 'https://www.instagram.com/cidc_mitsgwalior', label: 'Instagram', color: 'bg-highlight-pink' },
                      { icon: Mail, href: 'mailto:director@mitsgwalior.in', label: 'Email', color: 'bg-highlight-orange' },
                    ].map(({ icon: Icon, href, label, color }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 border-2 border-black flex items-center justify-center transform hover:-translate-y-1 transition-all shadow-neo-sm ${color}`}
                        title={label}
                      >
                        <Icon size={18} strokeWidth={2.5} />
                      </a>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase mt-4 tracking-widest">Official CID-Cell Handles</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative border-b-3 border-black">
        <div className="border-b-3 border-black px-6 py-4 bg-highlight-yellow flex items-center gap-3">
          <MapPin size={22} strokeWidth={2.5} />
          <span className="font-heading font-black text-lg uppercase">Madhav Institute of Technology and Science, Gwalior</span>
        </div>
        <div className="w-full h-[480px]">
          <iframe
            title="MITS Gwalior Location"
            src="https://maps.google.com/maps?q=Madhav+Institute+of+Technology+%26+Science,+Gwalior&hl=en&z=16&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
