import React, { useState } from 'react';
import { ArrowLeft, LayoutDashboard, PanelsTopLeft, Sofa, Images, Inbox, Settings, ShieldCheck, Construction } from 'lucide-react';

type Section = 'Overview' | 'Homepage' | 'Collections' | 'Gallery' | 'Enquiries' | 'Business details';

const sections: { label: Section; icon: React.ReactNode; description: string }[] = [
  { label: 'Overview', icon: <LayoutDashboard size={18} />, description: 'A quick view of your website content.' },
  { label: 'Homepage', icon: <PanelsTopLeft size={18} />, description: 'Hero slides and homepage sections.' },
  { label: 'Collections', icon: <Sofa size={18} />, description: 'Furniture products and categories.' },
  { label: 'Gallery', icon: <Images size={18} />, description: 'Showroom and project photographs.' },
  { label: 'Enquiries', icon: <Inbox size={18} />, description: 'Customer messages from the contact form.' },
  { label: 'Business details', icon: <Settings size={18} />, description: 'Contact details and showroom information.' },
];

export const Admin: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [active, setActive] = useState<Section>('Overview');

  return (
    <div className="min-h-screen bg-[#F6F1E8] text-[#1C1511]">
      <header className="sticky top-0 z-20 border-b border-[#D8CEC0] bg-[#F6F1E8]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="font-serif text-xl tracking-[0.18em]">TATARI</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-[#8B6A37]">Website Admin Center</p>
          </div>
          <button onClick={onExit} className="inline-flex items-center gap-2 rounded-full border border-[#D8CEC0] px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-white">
            <ArrowLeft size={15} /> View website
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8 lg:py-12">
        <aside className="h-fit rounded-2xl border border-[#D8CEC0] bg-white p-3 shadow-sm">
          <p className="px-3 pb-3 pt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8B6A37]">Manage website</p>
          <nav className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">
            {sections.map((section) => (
              <button key={section.label} onClick={() => setActive(section.label)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-colors ${active === section.label ? 'bg-[#1C1511] text-[#F6F1E8]' : 'text-[#3A271C] hover:bg-[#F6F1E8]'}`}>
                {section.icon}<span>{section.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          <div className="mb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#8B6A37]">Tatari Furniture</p>
            <h1 className="font-serif text-3xl sm:text-4xl">{active === 'Overview' ? 'Welcome to your Admin Center.' : active}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6B5546]">{sections.find((item) => item.label === active)?.description}</p>
          </div>

          {active === 'Overview' ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {sections.slice(1).map((section) => (
                  <button key={section.label} onClick={() => setActive(section.label)} className="rounded-2xl border border-[#D8CEC0] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A45C]/20 text-[#5A3E2B]">{section.icon}</span>
                    <h2 className="font-serif text-xl">{section.label}</h2>
                    <p className="mt-2 text-sm leading-5 text-[#6B5546]">{section.description}</p>
                  </button>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-[#C9A45C]/50 bg-[#C9A45C]/10 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 shrink-0 text-[#8B6A37]" size={22} />
                  <div>
                    <h2 className="font-semibold">Persistence and access protection come next</h2>
                    <p className="mt-2 text-sm leading-6 text-[#6B5546]">This first step establishes the Admin Center entry point and layout. Editing, secure administrator sign-in, permanent media uploads, customer enquiry storage, and draft/publish actions must be connected to a real backend before this panel is used to manage live content.</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#C9A45C] bg-white p-8 sm:p-12">
              <div className="mx-auto max-w-lg text-center">
                <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C9A45C]/20 text-[#5A3E2B]"><Construction size={26} /></span>
                <h2 className="font-serif text-2xl">This section is being connected</h2>
                <p className="mt-3 text-sm leading-6 text-[#6B5546]">The interface is ready to be built out, but this section is not wired to persistent storage yet. No edits are being saved from this screen.</p>
                <button onClick={() => setActive('Overview')} className="mt-6 rounded-full bg-[#1C1511] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#3A271C]">Back to overview</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
