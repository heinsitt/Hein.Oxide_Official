import React, { useState, useRef, useEffect } from 'react';
import {
  Video,
  Send,
  CheckCircle,
  FileText,
  UserCheck,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  Film,
  Building,
  Mail,
  RotateCcw,
  Clock
} from 'lucide-react';
import { FILMS } from '../data/films';

interface SubscribeSectionProps {
  reducedMotion: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'system' | 'user';
  text: string;
  timestamp: string;
}

export const SubscribeSection: React.FC<SubscribeSectionProps> = ({ reducedMotion }) => {
  const [requestMode, setRequestMode] = useState<'clip_permission' | 'collaboration'>('clip_permission');

  // Form inputs
  const [selectedFilmId, setSelectedFilmId] = useState<string>(FILMS[0].id);
  const [licenseType, setLicenseType] = useState<string>('Documentary Feature');
  const [projectTitle, setProjectTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<{
    reference: string;
    filmTitle: string;
    type: string;
    email: string;
    date: string;
  } | null>(null);

  // Chat messages state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'system',
      text: 'Welcome to Heino Xide Production Desk. Hein Thu Tun welcomes licensing inquiries for 4K aerial footage of Rakhine State as well as co-production collaborations. Which video clip or project would you like permission for?',
      timestamp: 'Direct Desk'
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: chatInput.trim(),
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    const inputCopy = chatInput;
    setChatInput('');

    // System response
    setTimeout(() => {
      const selectedFilm = FILMS.find((f) => f.id === selectedFilmId);
      const isCollab = requestMode === 'collaboration';

      const replyText = isCollab
        ? `Thank you. Your collaboration proposal for "${projectTitle || 'your project'}" has been noted. Please ensure your contact email is filled below to finalize your direct request to Hein Thu Tun.`
        : `Understood. For the clip "${selectedFilm?.title || 'selected footage'}" under "${licenseType}", our 4K D-Cinelike master archive is available. Fill in your project credentials below to send the official permission request.`;

      const sysReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'system',
        text: replyText,
        timestamp: 'Production Desk'
      };
      setMessages((prev) => [...prev, sysReply]);
    }, 600);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert('Please provide a valid contact email address for Hein Thu Tun to reply.');
      return;
    }

    const selectedFilm = FILMS.find((f) => f.id === selectedFilmId);
    const refCode = `HX-${Math.floor(100000 + Math.random() * 900000)}`;

    setSubmittedTicket({
      reference: refCode,
      filmTitle: requestMode === 'clip_permission' ? (selectedFilm?.title || 'Selected Footage') : (projectTitle || 'Co-Production Project'),
      type: requestMode === 'clip_permission' ? `Clip License: ${licenseType}` : 'Creative Collaboration',
      email,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });

    const confirmationMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'system',
      text: `✓ Official Request Logged (Ref #${refCode}). Hein Thu Tun has received your permission inquiry and will reply directly to ${email} with master clip availability and licensing terms.`,
      timestamp: 'Confirmed'
    };

    setMessages((prev) => [...prev, confirmationMsg]);
  };

  const resetForm = () => {
    setSubmittedTicket(null);
    setProjectTitle('');
    setOrganization('');
    setChatInput('');
  };

  return (
    <section id="subscribe" aria-labelledby="permissions-heading" className="relative py-24 sm:py-32 overflow-hidden bg-[#07090a]">
      {/* Background Subtle Gradient & Coastal Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div
          className="w-full h-full"
          style={{
            background:
              'radial-gradient(ellipse at 80% 20%, rgba(217,128,63,0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(20,34,26,0.3) 0%, transparent 70%)'
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1360px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.25em] uppercase text-[#d9803f] mb-3">
            <span className="w-5 h-px bg-[#d9803f]" aria-hidden="true" />
            Official Inquiries
          </div>
          <h2
            id="permissions-heading"
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.12] text-[#f3ede2] tracking-tight [text-wrap:balance]"
          >
            Video Clip Permissions & <em className="italic text-[#d9803f] font-light">Collaborations.</em>
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#f3ede2]/75">
            This channel is strictly reserved for filmmakers, producers, and curators requesting clip usage rights for Hein Thu Tun's 4K aerial archive, or proposing cultural documentary collaborations in Rakhine State.
          </p>
        </div>

        {/* Main Grid: Request Builder & Live Chat Desk */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Chat Request Box */}
          <div className="lg:col-span-6 bg-[#0d1411] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col h-[520px] shadow-xl">
            {/* Chat Desk Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1c3225] border border-[#d9803f]/50 flex items-center justify-center text-[#d9803f]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-medium text-white flex items-center gap-2">
                    <span>Heino Xide Production Desk</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[10px] text-white/50 font-mono">
                    Direct Channel to Hein Thu Tun
                  </div>
                </div>
              </div>

              <span className="text-[10px] uppercase font-mono px-2 py-1 rounded bg-black/50 text-[#e9be86] border border-white/10">
                Official Inquiries Only
              </span>
            </div>

            {/* Chat Message Scroll Window */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                        isUser
                          ? 'bg-[#d9803f] text-[#07090a] font-medium rounded-tr-sm'
                          : 'bg-black/60 text-[#f3ede2]/90 border border-white/10 rounded-tl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9.5px] font-mono text-white/40 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Interactive Input Form */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={
                    requestMode === 'clip_permission'
                      ? 'Describe timestamp, scene, or intended edit...'
                      : 'Describe your collaboration concept or shoot idea...'
                  }
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-white/40 focus:border-[#d9803f] focus:outline-none focus:ring-1 focus:ring-[#d9803f]"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2.5 rounded-xl bg-[#d9803f] hover:bg-[#c56e2f] disabled:opacity-40 disabled:hover:bg-[#d9803f] text-[#07090a] transition-colors shrink-0"
                  aria-label="Send message to production desk"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[10px] text-white/40 block mt-1.5">
                Type details or select from the permission form on the right.
              </span>
            </form>
          </div>

          {/* Right Column: Formal Permission & Collaboration Form */}
          <div className="lg:col-span-6 bg-[#0d1411] border border-white/10 rounded-2xl p-6 sm:p-8 relative shadow-xl">
            {/* Mode Switcher */}
            <div className="flex items-center gap-2 p-1 bg-black/60 border border-white/10 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setRequestMode('clip_permission');
                  setSubmittedTicket(null);
                }}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  requestMode === 'clip_permission'
                    ? 'bg-[#d9803f] text-[#07090a] font-semibold'
                    : 'text-[#f3ede2]/70 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Clip Usage Permission</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRequestMode('collaboration');
                  setSubmittedTicket(null);
                }}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  requestMode === 'collaboration'
                    ? 'bg-[#d9803f] text-[#07090a] font-semibold'
                    : 'text-[#f3ede2]/70 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Collaboration Request</span>
              </button>
            </div>

            {submittedTicket ? (
              <div className="p-6 rounded-2xl bg-[#14221a] border border-[#d9803f]/30 space-y-4 text-center">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                <div>
                  <h3 className="font-serif text-xl text-white font-normal">
                    Permission Request Logged
                  </h3>
                  <div className="text-xs font-mono text-[#d9803f] mt-1">
                    Reference Code: {submittedTicket.reference}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/50">Subject:</span>
                    <span className="text-white font-medium">{submittedTicket.filmTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Category:</span>
                    <span className="text-white">{submittedTicket.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Contact:</span>
                    <span className="text-white">{submittedTicket.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Date Filed:</span>
                    <span className="text-white">{submittedTicket.date}</span>
                  </div>
                </div>

                <p className="text-xs text-white/70 leading-relaxed max-w-md mx-auto">
                  Hein Thu Tun will review your licensing/collaboration parameters and respond directly with 4K master access or authorization.
                </p>

                <button
                  type="button"
                  onClick={resetForm}
                  className="mt-2 px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Submit Another Request</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleFinalSubmit} className="space-y-4 text-xs">
                {requestMode === 'clip_permission' ? (
                  <>
                    {/* Select Film / Clip */}
                    <div>
                      <label htmlFor="film-select" className="block text-white/70 font-mono text-[11px] uppercase tracking-wider mb-1.5">
                        1. Select Film / Master Footage Clip
                      </label>
                      <select
                        id="film-select"
                        value={selectedFilmId}
                        onChange={(e) => setSelectedFilmId(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:border-[#d9803f] focus:outline-none"
                      >
                        {FILMS.map((film) => (
                          <option key={film.id} value={film.id} className="bg-[#07090a]">
                            {film.title} ({film.location} · {film.year})
                          </option>
                        ))}
                        <option value="custom" className="bg-[#07090a]">
                          Custom Location / Specific Coastal Shot
                        </option>
                      </select>
                    </div>

                    {/* License Scope */}
                    <div>
                      <label htmlFor="license-type" className="block text-white/70 font-mono text-[11px] uppercase tracking-wider mb-1.5">
                        2. Intended License Scope
                      </label>
                      <select
                        id="license-type"
                        value={licenseType}
                        onChange={(e) => setLicenseType(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:border-[#d9803f] focus:outline-none"
                      >
                        <option value="Documentary Feature">Documentary Feature Film</option>
                        <option value="Cultural / Educational Exhibition">Cultural / Educational Exhibition</option>
                        <option value="Broadcast Television / Cable">Broadcast Television / Cable</option>
                        <option value="Film Festival Submission">Film Festival Submission</option>
                        <option value="Non-Profit Heritage Archive">Non-Profit Heritage Archive</option>
                        <option value="Commercial Campaign">Commercial Production</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Collaboration Focus */}
                    <div>
                      <label htmlFor="collab-title" className="block text-white/70 font-mono text-[11px] uppercase tracking-wider mb-1.5">
                        1. Project Title & Vision
                      </label>
                      <input
                        id="collab-title"
                        type="text"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="e.g. Rakhine Coastal Heritage Documentary"
                        required
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-white/30 focus:border-[#d9803f] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="collab-org" className="block text-white/70 font-mono text-[11px] uppercase tracking-wider mb-1.5">
                        2. Production Studio / Institution
                      </label>
                      <input
                        id="collab-org"
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="e.g. Independent Studio, NGO, Film Collective"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-white/30 focus:border-[#d9803f] focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* Requester Contact Email */}
                <div>
                  <label htmlFor="requester-email" className="block text-white/70 font-mono text-[11px] uppercase tracking-wider mb-1.5">
                    {requestMode === 'clip_permission' ? '3.' : '3.'} Contact Email for Permission Rights
                  </label>
                  <input
                    id="requester-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="filmmaker@production.com"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-white/30 focus:border-[#d9803f] focus:outline-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#d9803f] hover:bg-[#c56e2f] text-[#07090a] font-semibold text-xs tracking-wider uppercase transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {requestMode === 'clip_permission'
                        ? 'Submit Clip Permission Request'
                        : 'Submit Collaboration Request'}
                    </span>
                  </button>
                  <p className="text-[10px] text-white/40 text-center mt-2 font-mono">
                    Directly dispatched to Hein Thu Tun · Replies within 24–48 hours
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
