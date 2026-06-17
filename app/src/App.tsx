import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Clapperboard,
  Film,
  Layers,
  Sparkles,
  Share2,
  Camera,
  ChevronDown,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Play,
  ExternalLink
} from 'lucide-react'

/* ─────────────────────── scroll-reveal hook ─────────────────────── */
function useScrollReveal(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}

/* ─────────────────────── video auto-play hook ─────────────────────── */
function useVideoAutoplay() {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !playing) {
          el.play().catch(() => {})
          setPlaying(true)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [playing])

  return ref
}

/* ─────────────────────── typewriter hook ─────────────────────── */
function useTypewriter(text: string, speed = 80, delay = 500) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [started, text, speed])

  return displayed
}

/* ─────────────────────── counter hook ─────────────────────── */
function useCounter(end: number, duration = 1500, startOnView = true) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!startOnView) return
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [startOnView, hasStarted])

  useEffect(() => {
    if (!hasStarted) return
    let startTime: number
    let animationId: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOut * end))
      if (progress < 1) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [hasStarted, end, duration])

  return { ref, count }
}

/* ─────────────────────── Navbar ─────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Shërbimet', href: '#services' },
    { label: 'Portofol', href: '#portfolio' },
    { label: 'Rreth Nesh', href: '#about' },
    { label: 'Ekipi', href: '#team' },
    { label: 'Kontakt', href: '#contact' },
  ]

  const scrollTo = useCallback((href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[rgba(10,10,10,0.9)] backdrop-blur-[20px] border-b border-[rgba(201,169,98,0.1)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="font-display font-bold text-2xl text-gold tracking-tight">
          GOLD
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-sm text-[#A0A0A0] hover:text-[#C9A962] transition-colors duration-200 font-medium"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA button */}
        <button
          onClick={() => scrollTo('#contact')}
          className="hidden md:block bg-[#C9A962] text-[#0A0A0A] px-6 py-2.5 text-sm font-semibold uppercase tracking-wider rounded hover:bg-[#D4B876] hover:shadow-[0_0_20px_rgba(201,169,98,0.3)] transition-all duration-250"
        >
          Na Kontaktoni
        </button>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[#F5F0E8]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[rgba(10,10,10,0.95)] backdrop-blur-[20px] border-t border-[rgba(201,169,98,0.1)]">
          <div className="px-5 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-left text-[#A0A0A0] hover:text-[#C9A962] transition-colors py-2"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('#contact')}
              className="bg-[#C9A962] text-[#0A0A0A] px-6 py-3 text-sm font-semibold uppercase tracking-wider rounded mt-2"
            >
              Na Kontaktoni
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

/* ─────────────────────── Hero Section ─────────────────────── */
function HeroSection() {
  const title = useTypewriter('GOLD STUDIO', 80, 500)
  const videoRef = useVideoAutoplay()

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/videos/video1.mp4"
        muted
        loop
        playsInline
        preload="metadata"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-[1] gradient-overlay" />

      {/* Content */}
      <div className="relative z-[2] text-center px-5 flex flex-col items-center" style={{ paddingBottom: '15vh' }}>
        <p
          className="text-[#C9A962] text-xs md:text-sm font-medium uppercase tracking-[0.2em] mb-6 opacity-0 animate-[fadeInUp_0.8s_0.3s_forwards]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Production & Creative Studio
        </p>

        <h1
          className="font-display font-bold text-gold uppercase tracking-[-0.02em] leading-none mb-6"
          style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
        >
          {title}
          {!title.includes('STUDIO') && <span className="typewriter-cursor" />}
        </h1>

        <p
          className="text-[#A0A0A0] text-base md:text-lg max-w-[560px] leading-relaxed mb-10 opacity-0 animate-[fadeInUp_0.8s_0.9s_forwards]"
        >
          Krijojmë reklama që lënë gjurmë. Video, animacion, dhe strategji marketingu për markën tuaj.
        </p>

        <button
          onClick={() => document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-[#C9A962] text-[#0A0A0A] px-10 py-4 text-sm font-semibold uppercase tracking-[0.05em] rounded hover:bg-[#D4B876] hover:shadow-[0_0_20px_rgba(201,169,98,0.3)] transition-all duration-250 opacity-0 animate-[fadeInUp_0.8s_1.1s_forwards]"
        >
          Shiko Punën Tonë
        </button>
      </div>

      {/* Scroll down arrow */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[2] animate-bounce-gentle opacity-0 animate-[fadeIn_1s_1.5s_forwards]">
        <ChevronDown size={32} className="text-[#C9A962] opacity-60" />
      </div>

      {/* CSS keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  )
}

/* ─────────────────────── Services Section ─────────────────────── */
function ServicesSection() {
  const { ref, visible } = useScrollReveal(0.15)

  const services = [
    {
      icon: Clapperboard,
      title: 'TVC & SPOT',
      desc: 'Reklama televizive dhe spot publicitare me prodhim profesional nga ideja deri në transmetim.',
    },
    {
      icon: Film,
      title: 'Video Editing',
      desc: 'Montazh video i nivelit të lartë, color grading, dhe post-produksion për çdo platformë.',
    },
    {
      icon: Layers,
      title: 'Motion Graphics',
      desc: 'Grafika lëvizëse, titra animuar, dhe efekte vizuale që sjellin jetë në videon tuaj.',
    },
    {
      icon: Sparkles,
      title: 'Animation',
      desc: 'Animacion 2D dhe 3D për reklama, explainer videos, dhe përmbajtje sociale.',
    },
    {
      icon: Share2,
      title: 'Social Media Marketing',
      desc: 'Strategji dhe përmbajtje për Instagram, TikTok, Facebook, dhe YouTube që rritin ndjekjen.',
    },
    {
      icon: Camera,
      title: 'Product Photography',
      desc: 'Fotografi profesionale produktesh për e-commerce, katalogë, dhe reklama print.',
    },
  ]

  return (
    <section id="services" className="w-full py-24 md:py-32 bg-[#0D0D0D]">
      <div
        ref={ref}
        className={`max-w-[1200px] mx-auto px-5 md:px-10 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <p className="text-center text-[#8B7355] text-xs font-medium uppercase tracking-[0.1em] mb-4">
          ÇFARË OFROJMË
        </p>
        <h2
          className="font-display font-semibold text-cream uppercase text-center mb-16"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
        >
          Shërbimet Tona
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px] mx-auto">
          {services.map((s, i) => (
            <div
              key={s.title}
              className={`bg-[#141414] border border-[rgba(201,169,98,0.15)] rounded-xl p-8 md:p-10 transition-all duration-300 hover:border-[rgba(201,169,98,0.4)] hover:-translate-y-1 group ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-full bg-[rgba(201,169,98,0.1)] flex items-center justify-center mb-5">
                <s.icon size={24} className="text-[#C9A962]" />
              </div>
              <h3 className="font-display font-semibold text-lg text-[#F5F0E8] mb-3">{s.title}</h3>
              <p className="text-[#A0A0A0] text-[0.9375rem] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── Portfolio Section ─────────────────────── */
function PortfolioSection() {
  const { ref, visible } = useScrollReveal(0.15)
  const videoRef = useVideoAutoplay()

  return (
    <section id="portfolio" className="w-full py-20 md:py-24 bg-[#0A0A0A]">
      <div
        ref={ref}
        className={`max-w-[1200px] mx-auto px-5 md:px-10 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <p className="text-center text-[#8B7355] text-xs font-medium uppercase tracking-[0.1em] mb-4">
          PUNËT TONA
        </p>
        <h2
          className="font-display font-semibold text-cream uppercase text-center mb-4"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
        >
          Portofol
        </h2>
        <p className="text-center text-[#A0A0A0] text-base mb-16">
          Një përzgjedhje e punimeve tona më të fundit
        </p>

        {/* Main Portfolio Video */}
        <div className="max-w-[1000px] mx-auto mb-12">
          <div
            className={`relative w-full aspect-video rounded-xl overflow-hidden border border-[rgba(201,169,98,0.2)] transition-all duration-800 ${
              visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src="/videos/video2.mp4"
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.7)] to-transparent" />
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-[2]">
              <h3
                className="font-display font-semibold text-cream"
                style={{
                  fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                  textShadow: '0 2px 20px rgba(0,0,0,0.8)',
                }}
              >
                Ne krijojmë histori që shiten
              </h3>
            </div>
            <button className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-[2] border border-[rgba(201,169,98,0.3)] text-[#C9A962] px-6 py-3 text-sm font-semibold uppercase tracking-wider rounded hover:border-[#C9A962] hover:bg-[rgba(201,169,98,0.05)] transition-all duration-250">
              Shiko të Gjitha
            </button>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
          {[
            { src: '/videos/video3.mp4', title: 'Tech Commercial', label: 'REKLAMË' },
            { src: '/videos/video4.mp4', title: 'Product Promo', label: 'PROMO' },
            { src: '/videos/video5.mp4', title: 'Brand Story', label: 'BRAND' },
          ].map((v, i) => (
            <PortfolioCard key={i} {...v} delay={i * 150} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PortfolioCard({
  src,
  title,
  label,
  delay = 0,
}: {
  src: string
  title: string
  label: string
  delay?: number
}) {
  const ref = useVideoAutoplay()
  const { ref: revealRef, visible } = useScrollReveal(0.2)

  return (
    <div
      ref={revealRef}
      className={`relative aspect-[4/3] rounded-xl overflow-hidden border border-[rgba(201,169,98,0.15)] group cursor-pointer transition-all duration-600 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <video
        ref={ref}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.8)] via-transparent to-transparent" />
      <div className="absolute top-4 left-4">
        <span className="text-[0.625rem] font-medium text-[#C9A962] bg-[rgba(201,169,98,0.15)] px-2 py-1 rounded uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
        <h4 className="font-display font-semibold text-[#F5F0E8] text-sm">{title}</h4>
        <Play size={16} className="text-[#C9A962] opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  )
}

/* ─────────────────────── About Section ─────────────────────── */
function AboutSection() {
  const { ref, visible } = useScrollReveal(0.15)
  const videoRef = useVideoAutoplay()
  const counter1 = useCounter(150, 1500)
  const counter2 = useCounter(10, 1500)
  const counter3 = useCounter(50, 1500)

  return (
    <section id="about" className="w-full py-24 md:py-32 bg-[#0D0D0D]">
      <div
        ref={ref}
        className="max-w-[1200px] mx-auto px-5 md:px-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Video */}
          <div
            className={`relative aspect-[9/16] max-h-[600px] rounded-2xl overflow-hidden border border-[rgba(201,169,98,0.15)] transition-all duration-800 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
            }`}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src="/videos/video4.mp4"
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>

          {/* Content */}
          <div
            className={`transition-all duration-800 delay-200 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'
            }`}
          >
            <p className="text-[#8B7355] text-xs font-medium uppercase tracking-[0.1em] mb-4">
              RRETH NESH
            </p>
            <h2
              className="font-display font-semibold text-cream mb-6"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Gold Studio
            </h2>
            <p className="text-[#A0A0A0] text-base leading-[1.7] mb-10">
              Jemi një studio e pasionuar pas vizualitetit dhe historive. Me më shumë se 10 vjet
              përvojë në prodhimin e reklamave televizive, kemi ndihmuar markat të rriten përmes
              përmbajtjes cilësore. Ekipi ynë i talentuar kombinon kreativitetin me teknologjinë më
              të fundit për të dhënë rezultate që tejkalojnë pritshmëritë.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div ref={counter1.ref}>
                <div className="text-2xl md:text-3xl font-bold text-[#C9A962] mb-1">
                  {counter1.count}+
                </div>
                <div className="text-[#A0A0A0] text-xs md:text-sm">Projekte të realizuara</div>
              </div>
              <div ref={counter2.ref}>
                <div className="text-2xl md:text-3xl font-bold text-[#C9A962] mb-1">
                  {counter2.count}+
                </div>
                <div className="text-[#A0A0A0] text-xs md:text-sm">Vite përvojë</div>
              </div>
              <div ref={counter3.ref}>
                <div className="text-2xl md:text-3xl font-bold text-[#C9A962] mb-1">
                  {counter3.count}+
                </div>
                <div className="text-[#A0A0A0] text-xs md:text-sm">Klientë të kënaqur</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── Team Section ─────────────────────── */
function TeamSection() {
  const { ref, visible } = useScrollReveal(0.15)

  const team = [
    { name: 'Ardit Hoxha', role: 'Drejtor Kreativ', img: '/team-1.jpg' },
    { name: 'Elena Kola', role: 'Prodhuese Ekzekutive', img: '/team-2.jpg' },
    { name: 'Mikel Prifti', role: 'Montazhier Kryesor', img: '/team-3.jpg' },
    { name: 'Sara Gjini', role: 'Motion Designer', img: '/team-4.jpg' },
  ]

  return (
    <section id="team" className="w-full py-24 md:py-32 bg-[#0A0A0A]">
      <div
        ref={ref}
        className={`max-w-[1200px] mx-auto px-5 md:px-10 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <p className="text-center text-[#8B7355] text-xs font-medium uppercase tracking-[0.1em] mb-4">
          EKIPPI YNË
        </p>
        <h2
          className="font-display font-semibold text-cream uppercase text-center mb-16"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
        >
          Njihuni me Ekipin
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <div
              key={member.name}
              className={`bg-[#141414] rounded-xl overflow-hidden group transition-all duration-500 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h4 className="font-semibold text-[#F5F0E8] mb-1">{member.name}</h4>
                <p className="text-[#8B7355] text-sm">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── Contact Section ─────────────────────── */
function ContactSection() {
  const { ref, visible } = useScrollReveal(0.15)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', message: '' })
    }, 3000)
  }

  return (
    <section id="contact" className="w-full py-24 md:py-32 bg-[#0D0D0D]">
      <div ref={ref} className="max-w-[1200px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Form + Info */}
          <div
            className={`transition-all duration-800 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <p className="text-[#8B7355] text-xs font-medium uppercase tracking-[0.1em] mb-4">
              NA KONTAKTONI
            </p>
            <h2
              className="font-display font-semibold text-cream mb-6"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Filloni Projektin Tuaj
            </h2>
            <p className="text-[#A0A0A0] text-base leading-relaxed mb-10">
              Jemi gati të ndihmojmë markën tuaj të shkëlqejë. Na kontaktoni për një konsultim
              falas.
            </p>

            {/* Contact Info */}
            <div className="space-y-5 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[rgba(201,169,98,0.1)] flex items-center justify-center">
                  <Phone size={18} className="text-[#C9A962]" />
                </div>
                <div>
                  <p className="text-xs text-[#A0A0A0] uppercase tracking-wider">Telefon</p>
                  <p className="text-[#C9A962] font-medium">+355 69 34 88 888</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[rgba(201,169,98,0.1)] flex items-center justify-center">
                  <Mail size={18} className="text-[#C9A962]" />
                </div>
                <div>
                  <p className="text-xs text-[#A0A0A0] uppercase tracking-wider">Email</p>
                  <p className="text-[#C9A962] font-medium">info@goldstudio.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[rgba(201,169,98,0.1)] flex items-center justify-center">
                  <MapPin size={18} className="text-[#C9A962]" />
                </div>
                <div>
                  <p className="text-xs text-[#A0A0A0] uppercase tracking-wider">Adresa</p>
                  <p className="text-[#A0A0A0] font-medium">Tiranë, Albania</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Emri juaj"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[rgba(201,169,98,0.15)] rounded-lg px-5 py-3.5 text-[#F5F0E8] placeholder:text-[#666] focus:outline-none focus:border-[rgba(201,169,98,0.4)] transition-colors"
                required
              />
              <input
                type="email"
                placeholder="Emaili juaj"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[rgba(201,169,98,0.15)] rounded-lg px-5 py-3.5 text-[#F5F0E8] placeholder:text-[#666] focus:outline-none focus:border-[rgba(201,169,98,0.4)] transition-colors"
                required
              />
              <textarea
                placeholder="Përshkrimi i projektit..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full bg-[#1A1A1A] border border-[rgba(201,169,98,0.15)] rounded-lg px-5 py-3.5 text-[#F5F0E8] placeholder:text-[#666] focus:outline-none focus:border-[rgba(201,169,98,0.4)] transition-colors resize-none"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#C9A962] text-[#0A0A0A] py-4 text-sm font-semibold uppercase tracking-[0.05em] rounded hover:bg-[#D4B876] hover:shadow-[0_0_20px_rgba(201,169,98,0.3)] transition-all duration-250"
              >
                {submitted ? 'MESAZHI U DËRGUA!' : 'DËRGO'}
              </button>
            </form>
          </div>

          {/* Image */}
          <div
            className={`transition-all duration-800 delay-200 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="rounded-2xl overflow-hidden border border-[rgba(201,169,98,0.15)] aspect-[4/3]">
              <img
                src="/contact-studio.jpg"
                alt="Gold Studio Production Set"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── Footer ─────────────────────── */
function Footer() {
  const scrollTo = useCallback((href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <footer className="w-full bg-[#0A0A0A] border-t border-[rgba(201,169,98,0.1)]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 pt-20 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Col 1 - Logo */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#" className="font-display font-bold text-2xl text-[#C9A962] mb-4 inline-block">
              GOLD
            </a>
            <p className="text-[#A0A0A0] text-sm leading-relaxed mb-6">
              Studio prodhimi kreativ në Tiranë. Reklama, video, animacion.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Youtube, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#8B7355] hover:text-[#C9A962] hover:bg-[rgba(201,169,98,0.1)] transition-all duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 - Quick Links */}
          <div>
            <h4 className="text-[#F5F0E8] font-semibold text-sm mb-5 uppercase tracking-wider">Lidhje të Shpejta</h4>
            <ul className="space-y-3">
              {[
                { label: 'Kreu', href: '#' },
                { label: 'Shërbimet', href: '#services' },
                { label: 'Portofol', href: '#portfolio' },
                { label: 'Rreth Nesh', href: '#about' },
                { label: 'Kontakt', href: '#contact' },
              ].map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-[#A0A0A0] text-sm hover:text-[#C9A962] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 - Services */}
          <div>
            <h4 className="text-[#F5F0E8] font-semibold text-sm mb-5 uppercase tracking-wider">Shërbimet</h4>
            <ul className="space-y-3">
              {['TVC & SPOT', 'Video Editing', 'Motion Graphics', 'Animation'].map((s) => (
                <li key={s}>
                  <span className="text-[#A0A0A0] text-sm">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 - Contact */}
          <div>
            <h4 className="text-[#F5F0E8] font-semibold text-sm mb-5 uppercase tracking-wider">Kontakt</h4>
            <ul className="space-y-3 text-sm">
              <li className="text-[#A0A0A0]">+355 69 34 88 888</li>
              <li className="text-[#A0A0A0]">info@goldstudio.com</li>
              <li className="text-[#A0A0A0]">Tiranë, Albania</li>
              <li>
                <a
                  href="https://instagram.com/goldstudio.al"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C9A962] hover:underline inline-flex items-center gap-1"
                >
                  @goldstudio.al <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[rgba(255,255,255,0.05)] pt-6 text-center">
          <p className="text-[#A0A0A0] text-xs">
            © 2024 Gold Studio. Të gjitha të drejtat e rezervuara.
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ─────────────────────── Gold Line Dividers ─────────────────────── */
function GoldDivider() {
  return <div className="gold-line w-full" />
}

/* ─────────────────────── App ─────────────────────── */
function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      <Navbar />
      <HeroSection />
      <GoldDivider />
      <ServicesSection />
      <GoldDivider />
      <PortfolioSection />
      <GoldDivider />
      <AboutSection />
      <GoldDivider />
      <TeamSection />
      <GoldDivider />
      <ContactSection />
      <Footer />
    </div>
  )
}

export default App
