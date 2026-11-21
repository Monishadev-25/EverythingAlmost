import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
} from 'lucide-react';

export function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    orderNumber: '',
    subject: 'General Enquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const contactCards = [
    {
      icon: Mail,
      title: 'Customer Support',
      desc: 'Questions about an order, tracking, or personalisations?',
      contact: 'support@everythingalmost.co.uk',
      sub: 'Response time: usually within 2–4 hours',
      action: 'mailto:support@everythingalmost.co.uk',
      btnText: 'Send Email',
    },
    {
      icon: Phone,
      title: 'Phone & WhatsApp',
      desc: 'Speak directly with our London studio concierge.',
      contact: '+44 (0)20 7946 0912',
      sub: 'Monday to Friday: 9am – 6pm GMT',
      action: 'tel:+442079460912',
      btnText: 'Call Studio',
    },
    {
      icon: MapPin,
      title: 'Studio & Workshop',
      desc: 'Our design and laser-engraving workshop in Kensington.',
      contact: '24 Kensington High Street',
      sub: 'London, W8 4PT, United Kingdom',
      action: '#map',
      btnText: 'View Location',
    },
    {
      icon: Sparkles,
      title: 'Bespoke & Corporate',
      desc: 'Custom corporate gifts, event hampers, and bulk wedding favors.',
      contact: 'corporate@everythingalmost.co.uk',
      sub: 'Dedicated concierge for custom briefs',
      action: 'mailto:corporate@everythingalmost.co.uk',
      btnText: 'Enquire for Bulk',
    },
  ];

  const faqs = [
    {
      q: 'How long does UK delivery take for personalised items?',
      a: 'Standard UK delivery takes 2–4 working days from order placement. Because each personalised item is individually engraved or crafted in our London studio, please allow 1–2 working days for production before dispatch. Express next-day tracked delivery is also available at checkout.',
    },
    {
      q: 'Can I preview my custom engraving or personalization before it is made?',
      a: 'Yes! Simply leave your custom name, initials, or date in the order notes at checkout. If you need a digital proof for complex crystal laser photo engravings, our studio team will email you a proof within 12 hours.',
    },
    {
      q: 'Will prices or invoices be shown inside the gift parcel?',
      a: 'Never. All Everything Almost orders are packed gift-ready. Invoices are emailed directly to the purchaser only, and prices are strictly omitted from all packing slips and gift hampers.',
    },
    {
      q: 'What is your return or exchange policy?',
      a: 'We offer a 30-day happiness guarantee on all non-personalised products. If your order arrives damaged or defective in any way, contact us with a photo and we will immediately dispatch a complimentary replacement.',
    },
    {
      q: 'Can I include a handwritten gift card message?',
      a: 'Absolutely! At checkout, simply enter your personalized gift message in the gift options field and our team will transcribe it onto a luxury textured cardstock envelope free of charge.',
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setForm({
        name: '',
        email: '',
        orderNumber: '',
        subject: 'General Enquiry',
        message: '',
      });
    }, 800);
  };

  return (
    <div className="bg-[#faf7f2] text-[#241c18] min-h-screen">
      {/* 1. Hero Header */}
      <section className="relative overflow-hidden py-16 sm:py-20 border-b border-[#ebdccd] bg-gradient-to-b from-[#f5ede2] to-[#faf7f2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#784d2f] font-semibold tracking-widest uppercase bg-[#eedecf] px-3 py-1 rounded-full border border-[#dfc9b5]">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>We’re Here for You</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#241c18] font-normal tracking-tight">
            Get in Touch with Our Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#6b5647] max-w-xl mx-auto leading-relaxed">
            Have a question about a personalized keepsake, need help with an order, or planning a bespoke gift? Our friendly London team is ready to assist.
          </p>
        </div>
      </section>

      {/* 2. Four Contact Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-[#fdfaf5] border border-[#e5d4c1] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="w-10 h-10 rounded-xl bg-[#ede0d1] text-[#784d2f] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h3 className="font-serif text-base font-semibold text-[#241c18]">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#6e5849] leading-relaxed">
                    {card.desc}
                  </p>
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-[#784d2f] break-all">
                      {card.contact}
                    </p>
                    <p className="text-[11px] text-[#8e7a6b] mt-0.5">{card.sub}</p>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-[#ede1d3]">
                  <a
                    href={card.action}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#784d2f] hover:underline"
                  >
                    <span>{card.btnText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Main Split: Contact Form + Studio Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Contact Form Column */}
          <div className="lg:col-span-7 bg-[#fdfaf5] border border-[#ede1d3] rounded-3xl p-6 sm:p-10 shadow-lg">
            <div className="space-y-2 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#784d2f]">
                Send a Message
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#241c18] font-normal">
                How Can We Help Today?
              </h2>
              <p className="text-xs text-[#735e50]">
                Fill out the form below and our customer care team will reply to your enquiry shortly.
              </p>
            </div>

            {submitted ? (
              <div className="bg-[#f0f8f2] border border-[#c4e5ce] rounded-2xl p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#2d7a46] mx-auto" />
                <h3 className="font-serif text-xl text-[#1e522f]">Message Sent Successfully!</h3>
                <p className="text-xs sm:text-sm text-[#386644] max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. We have received your note and a member of our studio team will get back to you within 2–4 business hours.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="bg-[#2d7a46] hover:bg-[#236137] text-white px-6 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#423328] uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Eleanor Vance"
                      required
                      className="w-full bg-white border border-[#dfcebd] rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-[#241c18] placeholder-[#a69283] focus:outline-none focus:border-[#784d2f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#423328] uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="e.g. eleanor@example.co.uk"
                      required
                      className="w-full bg-white border border-[#dfcebd] rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-[#241c18] placeholder-[#a69283] focus:outline-none focus:border-[#784d2f]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#423328] uppercase tracking-wider mb-1.5">
                      Order Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="orderNumber"
                      value={form.orderNumber}
                      onChange={handleChange}
                      placeholder="e.g. ORD-2026-9812"
                      className="w-full bg-white border border-[#dfcebd] rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-[#241c18] placeholder-[#a69283] focus:outline-none focus:border-[#784d2f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#423328] uppercase tracking-wider mb-1.5">
                      Enquiry Subject
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full bg-white border border-[#dfcebd] rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                    >
                      <option value="General Enquiry">General Enquiry</option>
                      <option value="Order Tracking">Order Status & Tracking</option>
                      <option value="Personalisation">Custom Personalisation Request</option>
                      <option value="Returns">Returns & Replacements</option>
                      <option value="Bespoke Bulk">Bespoke & Corporate Gifting</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#423328] uppercase tracking-wider mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your order or questions..."
                    required
                    className="w-full bg-white border border-[#dfcebd] rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-[#241c18] placeholder-[#a69283] focus:outline-none focus:border-[#784d2f] resize-y"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto bg-[#784d2f] hover:bg-[#623c22] text-white px-8 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wider transition-colors cursor-pointer shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Studio Hours & Workshop Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#f5ede2] border border-[#e5d4c1] rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-[#784d2f]">
                <Clock className="w-5 h-5" />
                <h3 className="font-serif text-lg text-[#241c18] font-semibold">
                  Studio Opening Hours
                </h3>
              </div>
              <p className="text-xs text-[#6e5849] leading-relaxed">
                Our customer concierge team answers phone and email queries during the following hours:
              </p>
              <div className="space-y-2 text-xs border-t border-[#dfcebd] pt-3">
                <div className="flex justify-between py-1 border-b border-[#ebdccd]">
                  <span className="font-medium text-[#423328]">Monday – Friday</span>
                  <span className="text-[#784d2f] font-semibold">9:00 AM – 6:00 PM GMT</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#ebdccd]">
                  <span className="font-medium text-[#423328]">Saturday</span>
                  <span className="text-[#784d2f] font-semibold">10:00 AM – 4:00 PM GMT</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium text-[#423328]">Sunday & Bank Holidays</span>
                  <span className="text-[#998373] italic">Workshop Closed (Web orders open)</span>
                </div>
              </div>
            </div>

            <div id="map" className="bg-[#fdfaf5] border border-[#ede1d3] rounded-3xl p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2 text-[#784d2f]">
                <MapPin className="w-5 h-5" />
                <h3 className="font-serif text-lg text-[#241c18] font-semibold">
                  London Flagship Studio
                </h3>
              </div>
              <p className="text-xs text-[#6e5849] leading-relaxed">
                24 Kensington High Street, London, W8 4PT, United Kingdom
              </p>
              <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-[#dfcebd] relative">
                <img
                  src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=700&auto=format&fit=crop&q=80"
                  alt="London studio location"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#241a15]/40 flex items-center justify-center">
                  <span className="bg-white/95 text-[#241c18] text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                    📍 Kensington Studio
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-[#917d6e] text-center pt-1">
                Studio visits by appointment for bespoke bridal and corporate consultations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions Accordion */}
      <section className="bg-[#f5ede2] py-16 sm:py-20 border-t border-[#ebdccd]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs text-[#784d2f] font-bold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Common Questions</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#241c18] font-normal">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#6d5747]">
              Quick answers about shipping, order personalisations, and returns.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#faf7f2] border border-[#e5d4c1] rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-serif text-sm sm:text-base font-medium text-[#241c18]">
                      {faq.q}
                    </span>
                    <span className="text-[#784d2f] text-lg font-mono">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#5c493c] leading-relaxed border-t border-[#ede1d3] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

