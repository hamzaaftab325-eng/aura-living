'use client';

import { useState, useEffect, useRef } from 'react';
import { useGsapFadeIn, useGsapStagger, gsap } from '@/hooks/useGsap';
import { GoldDivider } from '@/components/SVGDecorations';
import { MapPin, Phone, Mail, Clock, MessageCircle, ChevronRight, Send } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';


/* ═══════════════════════════════════════════════════════════
   AnimatedSection — uses useGsapStagger for children reveal
   ═══════════════════════════════════════════════════════════ */
function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useGsapStagger<HTMLDivElement>({
    y: 40,
    duration: 0.7,
    stagger: 0.12,
    delay: 0.15,
    ease: 'power3.out',
    start: 'top 80%' });

  return <div ref={ref} className={className}>{children}</div>;
}

const contactInfo = [
  { icon: MapPin, label: 'Address', value: '123 Artisan Lane, Gulberg III, Lahore, Pakistan', href: undefined },
  { icon: Phone, label: 'Phone', value: '+92 300 1234567', href: 'tel:+923001234567' },
  { icon: Mail, label: 'Email', value: 'hello@auraliving.pk', href: 'mailto:hello@auraliving.pk' },
  { icon: Clock, label: 'Hours', value: 'Mon-Sat: 10AM - 8PM PKT', href: undefined },
];

const subjectOptions = ['General Inquiry', 'Order Support', 'Returns', 'Wholesale', 'Custom Orders'];

export default function ContactView() {
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // GSAP fade-in for hero content
  const headerRef = useGsapFadeIn<HTMLDivElement>({ y: 30, duration: 0.7 });

  // Parallax for hero background image
  useEffect(() => {
    if (!heroBgRef.current || !heroSectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(heroBgRef.current, {
        backgroundPositionY: '40%',
        ease: 'none',
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true } });
    }, heroSectionRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="w-full" >
      {/* Hero Banner */}
      <section
        ref={heroSectionRef}
        className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden flex items-center justify-center"
      >
        {/* Background image */}
        <div
          ref={heroBgRef}
          className="absolute inset-0"
          style={{ backgroundImage: 'url(/images/pages/contact-hero.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat' }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(44,44,44,0.75) 0%, rgba(44,44,44,0.5) 50%, rgba(212,175,55,0.15) 100%)' }}
        />

        {/* Decorative floating orbs */}
        <div
          className="absolute top-10 left-10 w-32 h-32 rounded-full"
          style={{ 
            background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-10 right-10 w-40 h-40 rounded-full"
          style={{ 
            background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)' }}
        />

        <div ref={headerRef} className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">

          <h1 className="aura-hero-title text-white" >Get in Touch</h1>

          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
          </div>

          <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto mt-4 leading-relaxed" >
            We would love to hear from you. Whether you have a question, feedback, or just want to say hello — drop us a line.
          </p>
        </div>
      </section>
      {/* Breadcrumb strip (below hero) */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Contact' },
        ]}
      />

      {/* Contact Content */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              {/* Contact Form */}
              <div>
                <div className="rounded-xl p-5 sm:p-6 lg:p-8" >
                  <h2 className="aura-text-primary aura-h2 mb-3" >Send Us a Message</h2>
                  <div className="mb-6">
                    <GoldDivider />
                  </div>

                  {isSubmitted && (
                    <div
                      role="status"
                      aria-live="polite"
                      className="mb-6 p-4 rounded-sm text-sm transition-all duration-300"
                      style={{ backgroundColor: 'rgba(168, 181, 160, 0.2)', border: '1px solid var(--color-sage)' }}
                    >
                      Thank you! Your message has been sent successfully. We will get back to you soon.
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Name — CSS focus transitions */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-sm font-medium" >Name</label>
                      <input
                        id="name" name="name" type="text" required aria-required="true" value={formData.name} onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                        
                        onFocus={(e) => { e.target.style.borderColor = 'var(--color-gold)'; e.target.style.boxShadow = '0 0 0 2px rgba(212, 175, 55, 0.15)'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'var(--color-gold-soft)'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>

                    {/* Email — CSS focus transitions */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-sm font-medium" >Email</label>
                      <input
                        id="email" name="email" type="email" required aria-required="true" value={formData.email} onChange={handleChange}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                        
                        onFocus={(e) => { e.target.style.borderColor = 'var(--color-gold)'; e.target.style.boxShadow = '0 0 0 2px rgba(212, 175, 55, 0.15)'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'var(--color-gold-soft)'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>

                    {/* Subject — CSS focus transitions */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="subject" className="text-sm font-medium" >Subject</label>
                      <select
                        id="subject" name="subject" required aria-required="true" value={formData.subject} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 appearance-none cursor-pointer"
                        style={{ color: formData.subject ? 'var(--surface-dark)' : 'var(--color-muted-gray)',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238A8A8A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 12px center' }}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--color-gold)'; e.target.style.boxShadow = '0 0 0 2px rgba(212, 175, 55, 0.15)'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'var(--color-gold-soft)'; e.target.style.boxShadow = 'none'; }}
                      >
                        <option value="" disabled>Select a subject</option>
                        {subjectOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>

                    {/* Message — CSS focus transitions */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="message" className="text-sm font-medium" >Message</label>
                      <textarea
                        id="message" name="message" required aria-required="true" rows={5} value={formData.message} onChange={handleChange}
                        placeholder="How can we help you?"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 resize-none"
                        
                        onFocus={(e) => { e.target.style.borderColor = 'var(--color-gold)'; e.target.style.boxShadow = '0 0 0 2px rgba(212, 175, 55, 0.15)'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'var(--color-gold-soft)'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>

                    {/* Submit Button — CSS hover/active transitions */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm sm:text-base font-semibold tracking-wider uppercase rounded-sm cursor-pointer transition-all duration-300 hover:bg-[var(--color-gold-hover)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.35)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-6">
                <div className="rounded-xl p-5 sm:p-6 lg:p-8" >
                  <h2 className="aura-text-primary aura-h2 mb-3" >Contact Information</h2>
                  <div className="mb-6">
                    <GoldDivider />
                  </div>

                  <div className="flex flex-col gap-5">
                    {contactInfo.map((info) => (
                      <div key={info.label} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                          <info.icon className="w-4.5 h-4.5"  />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs tracking-wider uppercase mb-0.5" >{info.label}</span>
                          {info.href ? (
                            <a href={info.href} className="text-sm sm:text-base transition-colors duration-200 hover:aura-text-gold" >{info.value}</a>
                          ) : (
                            <span className="text-sm sm:text-base" >{info.value}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* WhatsApp Button — CSS hover transitions */}
                  <div className="mt-8 pt-6" >
                    <a
                      href="https://wa.me/923001234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-sm text-sm sm:text-base font-semibold tracking-wider uppercase cursor-pointer transition-all duration-300 hover:shadow-[0_8px_25px_rgba(37,211,102,0.3)] hover:brightness-110 active:scale-[0.98]"
                      style={{ backgroundColor: '#25D366' }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>

                {/* Map Placeholder — CSS only */}
                <div className="rounded-sm overflow-hidden" >
                  <div
                    className="relative w-full aspect-video flex items-center justify-center"
                    style={{ 
                      backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(212,175,55,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(168,181,160,0.15) 0%, transparent 50%), linear-gradient(135deg, var(--color-gold-pale) 25%, var(--color-gold-soft) 50%, var(--color-gold-pale) 75%)' }}
                  >
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-1/4 left-0 right-0 h-px aura-bg-gold-tint" />
                      <div className="absolute top-2/4 left-0 right-0 h-px aura-bg-gold-tint" />
                      <div className="absolute top-3/4 left-0 right-0 h-px aura-bg-gold-tint" />
                      <div className="absolute left-1/4 top-0 bottom-0 w-px aura-bg-gold-tint" />
                      <div className="absolute left-2/4 top-0 bottom-0 w-px aura-bg-gold-tint" />
                      <div className="absolute left-3/4 top-0 bottom-0 w-px aura-bg-gold-tint" />
                    </div>
                    <div className="flex flex-col items-center gap-3 relative z-10">
                      <MapPin className="w-8 h-8"  />
                      <a
                        href="https://maps.google.com/?q=123+Artisan+Lane+Gulberg+III+Lahore+Pakistan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-sm text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 hover:bg-[var(--color-gold-hover)]"
                      >
                        View on Google Maps
                        <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
