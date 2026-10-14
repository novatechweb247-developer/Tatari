import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, LayoutDashboard, PanelsTopLeft, Sofa, Images, Inbox, Settings, LogOut, Save, Upload, RefreshCw } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

type Section = 'Overview' | 'Homepage' | 'Collections' | 'Gallery' | 'Enquiries' | 'Business details';
type HeroSlide = { slide_number: number; title: string; subtitle: string; badge: string; image_url: string; button_text: string; button_url: string; is_published: boolean; draft_data?: Record<string, any> | null };
type SiteSettings = { id: string; business_name: string; tagline: string; address: string; phone: string; phone_international: string; whatsapp_url: string; map_url: string; description: string; editorial_image_url: string; is_published: boolean; draft_data?: Record<string, any> | null };
type ProductRow = { id: string; name: string; category: string; category_label: string; image_url: string; description: string; features: string[]; dimensions: string; materials: string; is_published: boolean; sort_order: number; draft_data?: Record<string, any> | null };
type GalleryRow = { id: string; title: string; category: string; image_url: string; description: string; is_published: boolean; sort_order: number; draft_data?: Record<string, any> | null };
type Enquiry = { id: string; full_name: string; phone: string; category: string; subject: string; message: string; preferred_contact: string; status: string; created_at: string };

const sections: { label: Section; icon: React.ReactNode; description: string }[] = [
  { label: 'Overview', icon: <LayoutDashboard size={18} />, description: 'A quick view of your website content.' },
  { label: 'Homepage', icon: <PanelsTopLeft size={18} />, description: 'Edit the three hero slides and homepage editorial image.' },
  { label: 'Collections', icon: <Sofa size={18} />, description: 'Furniture products and categories.' },
  { label: 'Gallery', icon: <Images size={18} />, description: 'Showroom and project photographs.' },
  { label: 'Enquiries', icon: <Inbox size={18} />, description: 'Customer messages saved from the public contact form.' },
  { label: 'Business details', icon: <Settings size={18} />, description: 'Contact details and showroom information.' },
];
const inputClass = 'w-full rounded-xl border border-[#D8CEC0] bg-[#F6F1E8]/40 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#C9A45C]';
const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-[#5A3E2B]';

export const Admin: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [active, setActive] = useState<Section>('Overview');
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [productRows, setProductRows] = useState<ProductRow[]>([]);
  const [galleryRows, setGalleryRows] = useState<GalleryRow[]>([]);
  const [counts, setCounts] = useState({ products: 0, gallery: 0, enquiries: 0 });

  const verifyAdmin = useCallback(async (userId: string) => {
    if (!supabase) return false;
    const { data, error: membershipError } = await supabase.from('admin_users').select('user_id').eq('user_id', userId).maybeSingle();
    if (membershipError) throw membershipError;
    return Boolean(data);
  }, []);

  const loadData = useCallback(async () => {
    if (!supabase) return;
    setError('');
    const [hero, site, inbox, products, gallery, productRowsResult, galleryRowsResult] = await Promise.all([
      supabase.from('hero_slides').select('*').order('slide_number'),
      supabase.from('site_settings').select('*').eq('id', 'main').maybeSingle(),
      supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('gallery_items').select('id', { count: 'exact', head: true }),
      supabase.from('products').select('*').order('sort_order'),
      supabase.from('gallery_items').select('*').order('sort_order'),
    ]);
    const firstError = hero.error || site.error || inbox.error || products.error || gallery.error || productRowsResult.error || galleryRowsResult.error;
    if (firstError) throw firstError;
    setSlides(((hero.data || []) as HeroSlide[]).map(row => ({ ...row, ...(row.draft_data || {}) })));
    const siteRow = site.data as SiteSettings | null;
    setSettings(siteRow ? ({ ...siteRow, ...(siteRow.draft_data || {}) } as SiteSettings) : null);
    setEnquiries((inbox.data || []) as Enquiry[]);
    setProductRows(((productRowsResult.data || []) as ProductRow[]).map(row => ({ ...row, ...(row.draft_data || {}) })));
    setGalleryRows(((galleryRowsResult.data || []) as GalleryRow[]).map(row => ({ ...row, ...(row.draft_data || {}) })));
    setCounts({ products: products.count || 0, gallery: gallery.count || 0, enquiries: inbox.data?.length || 0 });
  }, []);

  useEffect(() => {
    let active = true;
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active || !data.session) { setLoading(false); return; }
      try {
        if (await verifyAdmin(data.session.user.id)) {
          if (active) { setSession(data.session); await loadData(); }
        } else {
          await supabase.auth.signOut();
          if (active) setError('This account is not authorized to manage Tatari.');
        }
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : 'Could not verify administrator access.');
      } finally { if (active) setLoading(false); }
    });
    return () => { active = false; };
  }, [verifyAdmin, loadData]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (authError) throw authError;
      if (!data.user || !(await verifyAdmin(data.user.id))) {
        await supabase.auth.signOut();
        throw new Error('This account is not authorized. Add its user ID to public.admin_users first.');
      }
      setSession(data.session); setPassword(''); await loadData();
      setNotice('Signed in.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Sign-in failed.'); }
    finally { setBusy(false); setLoading(false); }
  };

  const runSave = async (task: () => Promise<void>, message: string) => {
    setBusy(true); setError(''); setNotice('');
    try { await task(); setNotice(message); }
    catch (e) { setError(e instanceof Error ? e.message : 'The operation failed. Your changes were not confirmed as saved.'); }
    finally { setBusy(false); }
  };

  const uploadImage = async (file: File | undefined, target: { kind: 'editorial' } | { kind: 'hero'; slideNumber: number } | { kind: 'product'; index: number } | { kind: 'gallery'; index: number }) => {
    if (!file || !supabase) return;
    if (!file.type.startsWith('image/')) { setError('Choose an image file.'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('Image must be 10 MB or smaller.'); return; }
    await runSave(async () => {
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-');
      const path = 'admin/' + Date.now() + '-' + safeName;
      const { error: uploadError } = await supabase!.storage.from('site-media').upload(path, file, { upsert: false, contentType: file.type });
      if (uploadError) throw uploadError;
      const { data } = supabase!.storage.from('site-media').getPublicUrl(path);
      const url = data.publicUrl;
      if (target.kind === 'editorial' && settings) setSettings(prev => prev ? { ...prev, editorial_image_url: url } : prev);
      else if (target.kind === 'hero') setSlides(prev => prev.map(s => s.slide_number === target.slideNumber ? { ...s, image_url: url } : s));
      else if (target.kind === 'product') setProductRows(prev => prev.map((row, index) => index === target.index ? { ...row, image_url: url } : row));
      else if (target.kind === 'gallery') setGalleryRows(prev => prev.map((row, index) => index === target.index ? { ...row, image_url: url } : row));
    }, 'Image uploaded to persistent media storage. Save your content changes next.');
  };

  const saveSlide = async (slide: HeroSlide, publish: boolean) => {
    if (!supabase) return;
    const { error: saveError } = await supabase.from('hero_slides').update({
      draft_data: { title: slide.title, subtitle: slide.subtitle, badge: slide.badge, image_url: slide.image_url, button_text: slide.button_text, button_url: slide.button_url },
      ...(publish ? { title: slide.title, subtitle: slide.subtitle, badge: slide.badge, image_url: slide.image_url, button_text: slide.button_text, button_url: slide.button_url, is_published: true } : {}),
      updated_at: new Date().toISOString(),
    }).eq('slide_number', slide.slide_number);
    if (saveError) throw saveError;
  };

  const saveSettings = async (publish: boolean) => {
    if (!supabase || !settings) return;
    const { error: saveError } = await supabase.from('site_settings').update({
      draft_data: { business_name: settings.business_name, tagline: settings.tagline, address: settings.address, phone: settings.phone, phone_international: settings.phone_international, whatsapp_url: settings.whatsapp_url, map_url: settings.map_url, description: settings.description, editorial_image_url: settings.editorial_image_url },
      ...(publish ? { business_name: settings.business_name, tagline: settings.tagline, address: settings.address, phone: settings.phone, phone_international: settings.phone_international, whatsapp_url: settings.whatsapp_url, map_url: settings.map_url, description: settings.description, editorial_image_url: settings.editorial_image_url, is_published: true } : {}),
      updated_at: new Date().toISOString(),
    }).eq('id', 'main');
    if (saveError) throw saveError;
  };

  const saveProduct = async (item: ProductRow, publish: boolean) => {
    if (!supabase) return;
    const values = { name: item.name, category: item.category, category_label: item.category_label, image_url: item.image_url, description: item.description, features: item.features || [], dimensions: item.dimensions || '', materials: item.materials || '' };
    const payload = { draft_data: values, ...(publish ? { ...values, is_published: true } : {}), updated_at: new Date().toISOString() };
    const query = item.id ? supabase.from('products').update(payload).eq('id', item.id) : supabase.from('products').insert({ ...values, ...payload, is_published: publish, sort_order: productRows.length });
    const { error: saveError } = await query;
    if (saveError) throw saveError;
    await loadData();
  };

  const saveGalleryItem = async (item: GalleryRow, publish: boolean) => {
    if (!supabase) return;
    const values = { title: item.title, category: item.category, image_url: item.image_url, description: item.description };
    const payload = { draft_data: values, ...(publish ? { ...values, is_published: true } : {}), updated_at: new Date().toISOString() };
    const query = item.id ? supabase.from('gallery_items').update(payload).eq('id', item.id) : supabase.from('gallery_items').insert({ ...values, ...payload, is_published: publish, sort_order: galleryRows.length });
    const { error: saveError } = await query;
    if (saveError) throw saveError;
    await loadData();
  };

  const deleteProduct = async (item: ProductRow) => {
    if (!supabase || !item.id) return;
    const { error: deleteError } = await supabase.from('products').delete().eq('id', item.id);
    if (deleteError) throw deleteError;
    await loadData();
  };

  const deleteGalleryItem = async (item: GalleryRow) => {
    if (!supabase || !item.id) return;
    const { error: deleteError } = await supabase.from('gallery_items').delete().eq('id', item.id);
    if (deleteError) throw deleteError;
    await loadData();
  };

  const updateEnquiry = async (item: Enquiry, status: string) => {
    if (!supabase) return;
    const { error: updateError } = await supabase.from('enquiries').update({ status }).eq('id', item.id);
    if (updateError) throw updateError;
    setEnquiries(prev => prev.map(row => row.id === item.id ? { ...row, status } : row));
  };

  if (!isSupabaseConfigured || !supabase) return <div className="min-h-screen bg-[#F6F1E8] p-8 text-[#1C1511]"><h1 className="font-serif text-3xl">Tatari Admin</h1><p className="mt-4">Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in the deployment environment.</p></div>;

  if (loading) return <div className="min-h-screen bg-[#F6F1E8] p-8 text-[#1C1511]">Loading Admin Center…</div>;

  if (!session) return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F1E8] px-4 text-[#1C1511]">
      <form onSubmit={signIn} className="w-full max-w-md rounded-3xl border border-[#D8CEC0] bg-white p-8 shadow-xl">
        <p className="font-serif text-2xl tracking-[0.18em]">TATARI</p><p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-[#8B6A37]">Website Admin</p>
        <h1 className="mt-8 font-serif text-3xl">Administrator sign in</h1>
        <p className="mt-3 text-sm leading-6 text-[#6B5546]">Sign in to manage the website.</p>
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <label className={labelClass + ' mt-6'}>Email address</label><input className={inputClass} type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} />
        <label className={labelClass + ' mt-4'}>Password</label><input className={inputClass} type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} />
        <button disabled={busy} className="mt-6 w-full rounded-full bg-[#1C1511] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-60">{busy ? 'Signing in…' : 'Sign in'}</button>
        <button type="button" onClick={onExit} className="mt-3 w-full rounded-full border border-[#D8CEC0] px-6 py-3 text-xs font-semibold uppercase tracking-wider">Return to website</button>
      </form>
    </div>
  );

  const field = (label: string, value: string, update: (v: string) => void, type = 'text') => <label className="block"><span className={labelClass}>{label}</span><input className={inputClass} type={type} value={value || ''} onChange={e=>update(e.target.value)} /></label>;
  const panel = 'rounded-2xl border border-[#D8CEC0] bg-white p-5 shadow-sm sm:p-7';
  return (
    <div className="min-h-screen bg-[#F6F1E8] text-[#1C1511]">
      <header className="sticky top-0 z-20 border-b border-[#D8CEC0] bg-[#F6F1E8]/95 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"><div><p className="font-serif text-xl tracking-[0.18em]">TATARI</p><p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-[#8B6A37]">Website Admin Center</p></div><div className="flex gap-2"><button onClick={()=>runSave(loadData,'Data refreshed.')} className="inline-flex items-center gap-2 rounded-full border border-[#D8CEC0] px-3 py-2 text-xs"><RefreshCw size={14}/> Refresh</button><button onClick={async()=>{await supabase!.auth.signOut();setSession(null);onExit();}} className="inline-flex items-center gap-2 rounded-full border border-[#D8CEC0] px-3 py-2 text-xs"><LogOut size={14}/> Sign out</button></div></div></header>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8 lg:py-12">
        <aside className="h-fit rounded-2xl border border-[#D8CEC0] bg-white p-3 shadow-sm"><p className="px-3 pb-3 pt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8B6A37]">Manage website</p><nav className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">{sections.map(s=><button key={s.label} onClick={()=>setActive(s.label)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-colors ${active===s.label?'bg-[#1C1511] text-[#F6F1E8]':'text-[#3A271C] hover:bg-[#F6F1E8]'}`}>{s.icon}<span>{s.label}</span></button>)}</nav></aside>
        <main className="min-w-0"><div className="mb-8"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#8B6A37]">Tatari Furniture</p><h1 className="font-serif text-3xl sm:text-4xl">{active==='Overview'?'Welcome to your Admin Center.':active}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#6B5546]">{sections.find(s=>s.label===active)?.description}</p></div>
          {notice && <p role="status" className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">{notice}</p>}
          {error && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
          {active==='Overview' && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[{label:'Hero slides',value:slides.length},{label:'Products',value:counts.products},{label:'Gallery images',value:counts.gallery},{label:'Recent enquiries',value:counts.enquiries}].map(x=><div key={x.label} className={panel}><p className="text-sm text-[#6B5546]">{x.label}</p><p className="mt-2 font-serif text-3xl">{x.value}</p></div>)}</div>}
          {active==='Homepage' && <div className="space-y-6"><section className={panel}><div className="mb-5 flex items-center justify-between"><h2 className="font-serif text-2xl">Hero slides (exactly 3)</h2><span className="text-xs text-[#6B5546]">{slides.length}/3 fixed slots</span></div>{slides.slice(0,3).map(slide=><div key={slide.slide_number} className="mb-6 rounded-xl border border-[#D8CEC0] p-4"><h3 className="mb-4 font-semibold">Slide {slide.slide_number} {slide.is_published?'· Published':'· Draft'}</h3><div className="grid gap-4 sm:grid-cols-2">{field('Title',slide.title,v=>setSlides(prev=>prev.map(s=>s.slide_number===slide.slide_number?{...s,title:v}:s)))}{field('Badge',slide.badge,v=>setSlides(prev=>prev.map(s=>s.slide_number===slide.slide_number?{...s,badge:v}:s)))}<div className="sm:col-span-2">{field('Subtitle',slide.subtitle,v=>setSlides(prev=>prev.map(s=>s.slide_number===slide.slide_number?{...s,subtitle:v}:s)))}</div>{field('Image URL',slide.image_url,v=>setSlides(prev=>prev.map(s=>s.slide_number===slide.slide_number?{...s,image_url:v}:s)))}{field('Button text',slide.button_text,v=>setSlides(prev=>prev.map(s=>s.slide_number===slide.slide_number?{...s,button_text:v}:s)))}{field('Button link',slide.button_url,v=>setSlides(prev=>prev.map(s=>s.slide_number===slide.slide_number?{...s,button_url:v}:s)))}<label className="text-xs text-[#6B5546]">Upload image<input className="mt-2 block w-full text-sm" type="file" accept="image/*" onChange={e=>uploadImage(e.target.files?.[0],{kind:'hero',slideNumber:slide.slide_number})}/></label></div><div className="mt-4 flex flex-wrap gap-2"><button disabled={busy} onClick={()=>runSave(()=>saveSlide(slide,false),'Slide saved as draft.')} className="inline-flex items-center gap-2 rounded-full border border-[#D8CEC0] px-4 py-2 text-xs"><Save size={14}/> Save draft</button><button disabled={busy} onClick={()=>runSave(()=>saveSlide(slide,true),'Slide published.')} className="rounded-full bg-[#1C1511] px-4 py-2 text-xs text-white">Publish slide</button></div></div>)}</section>
          {settings && <section className={panel}><h2 className="mb-5 font-serif text-2xl">Homepage Editorial Image</h2>{settings.editorial_image_url && <img src={settings.editorial_image_url} alt="Current editorial" className="mb-4 max-h-64 rounded-xl object-contain"/>}<label className={labelClass}>Editorial image URL</label><input className={inputClass} value={settings.editorial_image_url} onChange={e=>setSettings({...settings,editorial_image_url:e.target.value})}/><label className="mt-4 block text-sm">Upload replacement<input type="file" accept="image/*" className="mt-2 block w-full text-sm" onChange={e=>uploadImage(e.target.files?.[0],{kind:'editorial'})}/></label><div className="mt-5 flex gap-2"><button disabled={busy} onClick={()=>runSave(()=>saveSettings(false),'Editorial image saved as draft.')} className="rounded-full border border-[#D8CEC0] px-4 py-2 text-xs">Save draft</button><button disabled={busy} onClick={()=>runSave(()=>saveSettings(true),'Editorial image published.')} className="rounded-full bg-[#1C1511] px-4 py-2 text-xs text-white">Publish image</button></div></section>}</div>}
          {active==='Business details' && settings && <section className={panel}><div className="grid gap-4 sm:grid-cols-2">{field('Business name',settings.business_name,v=>setSettings({...settings,business_name:v}))}{field('Tagline',settings.tagline,v=>setSettings({...settings,tagline:v}))}{field('Showroom address',settings.address,v=>setSettings({...settings,address:v}))}{field('Phone display',settings.phone,v=>setSettings({...settings,phone:v}))}{field('Phone link',settings.phone_international,v=>setSettings({...settings,phone_international:v}))}{field('WhatsApp URL',settings.whatsapp_url,v=>setSettings({...settings,whatsapp_url:v}))}{field('Map URL',settings.map_url,v=>setSettings({...settings,map_url:v}))}<div className="sm:col-span-2">{field('Description',settings.description,v=>setSettings({...settings,description:v}))}</div></div><div className="mt-5 flex gap-2"><button disabled={busy} onClick={()=>runSave(()=>saveSettings(false),'Business details saved as draft.')} className="rounded-full border border-[#D8CEC0] px-4 py-2 text-xs">Save draft</button><button disabled={busy} onClick={()=>runSave(()=>saveSettings(true),'Business details published.')} className="rounded-full bg-[#1C1511] px-4 py-2 text-xs text-white">Publish changes</button></div></section>}
          {active==='Enquiries' && <section className={panel}><h2 className="mb-5 font-serif text-2xl">Customer enquiries</h2>{enquiries.length===0?<p className="text-sm text-[#6B5546]">No enquiries have been saved yet.</p>:<div className="space-y-4">{enquiries.map(item=><article key={item.id} className="rounded-xl border border-[#D8CEC0] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold">{item.full_name}</h3><p className="mt-1 text-sm">{item.phone} · {item.preferred_contact}</p><p className="mt-1 text-xs text-[#6B5546]">{new Date(item.created_at).toLocaleString()} · {item.category}</p></div><select aria-label={'Status for '+item.full_name} className="rounded-lg border border-[#D8CEC0] p-2 text-xs" value={item.status} onChange={e=>runSave(()=>updateEnquiry(item,e.target.value),'Enquiry status updated.')}><option value="new">New</option><option value="in_progress">In progress</option><option value="resolved">Resolved</option><option value="archived">Archived</option></select></div>{item.subject&&<p className="mt-3 font-medium">{item.subject}</p>}<p className="mt-2 whitespace-pre-wrap text-sm leading-6">{item.message}</p></article>)}</div>}</section>}
          {active==='Collections' && <section className={panel}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="font-serif text-2xl">Furniture collections</h2><button onClick={()=>setProductRows(prev=>[...prev,{id:'',name:'',category:'living-room',category_label:'Living Room',image_url:'',description:'',features:[],dimensions:'',materials:'',is_published:false,sort_order:prev.length}])} className="rounded-full bg-[#1C1511] px-4 py-2 text-xs text-white">Add product</button></div>
            <div className="space-y-5">{productRows.map((item,index)=><article key={item.id || 'new-'+index} className="rounded-xl border border-[#D8CEC0] p-4"><div className="grid gap-4 sm:grid-cols-2">
              {field('Product name',item.name,v=>setProductRows(prev=>prev.map((r,i)=>i===index?{...r,name:v}:r)))}
              <label><span className={labelClass}>Category</span><select className={inputClass} value={item.category} onChange={e=>setProductRows(prev=>prev.map((r,i)=>i===index?{...r,category:e.target.value,category_label:({'living-room':'Living Room',bedroom:'Bedroom',custom:'Custom Furniture',other:'Other Furniture'} as Record<string,string>)[e.target.value]}:r))}><option value="living-room">Living Room</option><option value="bedroom">Bedroom</option><option value="custom">Custom Furniture</option><option value="other">Other Furniture</option></select></label>
              {field('Category label',item.category_label,v=>setProductRows(prev=>prev.map((r,i)=>i===index?{...r,category_label:v}:r)))}
              <div>{field('Image URL',item.image_url,v=>setProductRows(prev=>prev.map((r,i)=>i===index?{...r,image_url:v}:r)))}<label className="mt-2 block text-xs text-[#6B5546]">Upload product image<input type="file" accept="image/*" className="mt-2 block w-full text-sm" onChange={e=>uploadImage(e.target.files?.[0],{kind:'product',index})}/></label></div>
              <div className="sm:col-span-2">{field('Description',item.description,v=>setProductRows(prev=>prev.map((r,i)=>i===index?{...r,description:v}:r)))}</div>
              {field('Materials',item.materials,v=>setProductRows(prev=>prev.map((r,i)=>i===index?{...r,materials:v}:r)))}
              {field('Dimensions',item.dimensions,v=>setProductRows(prev=>prev.map((r,i)=>i===index?{...r,dimensions:v}:r)))}
              {field('Features (comma separated)',(item.features||[]).join(', '),v=>setProductRows(prev=>prev.map((r,i)=>i===index?{...r,features:v.split(',').map(s=>s.trim()).filter(Boolean)}:r)))}
            </div><div className="mt-4 flex flex-wrap gap-2"><button disabled={busy} onClick={()=>runSave(()=>saveProduct(item,false),'Product draft saved.')} className="rounded-full border border-[#D8CEC0] px-4 py-2 text-xs">Save draft</button><button disabled={busy} onClick={()=>runSave(()=>saveProduct(item,true),'Product published.')} className="rounded-full bg-[#1C1511] px-4 py-2 text-xs text-white">Publish</button>{item.id&&<button disabled={busy} onClick={()=>runSave(()=>deleteProduct(item),'Product deleted.')} className="rounded-full border border-red-200 px-4 py-2 text-xs text-red-700">Delete</button>}</div></article>)}</div>
          </section>}
          {active==='Gallery' && <section className={panel}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="font-serif text-2xl">Gallery images</h2><button onClick={()=>setGalleryRows(prev=>[...prev,{id:'',title:'',category:'Furniture',image_url:'',description:'',is_published:false,sort_order:prev.length}])} className="rounded-full bg-[#1C1511] px-4 py-2 text-xs text-white">Add gallery item</button></div>
            <div className="space-y-5">{galleryRows.map((item,index)=><article key={item.id || 'new-'+index} className="rounded-xl border border-[#D8CEC0] p-4"><div className="grid gap-4 sm:grid-cols-2">
              {field('Title',item.title,v=>setGalleryRows(prev=>prev.map((r,i)=>i===index?{...r,title:v}:r)))}
              {field('Category',item.category,v=>setGalleryRows(prev=>prev.map((r,i)=>i===index?{...r,category:v}:r)))}
              <div>{field('Image URL',item.image_url,v=>setGalleryRows(prev=>prev.map((r,i)=>i===index?{...r,image_url:v}:r)))}<label className="mt-2 block text-xs text-[#6B5546]">Upload gallery image<input type="file" accept="image/*" className="mt-2 block w-full text-sm" onChange={e=>uploadImage(e.target.files?.[0],{kind:'gallery',index})}/></label></div>
              <div className="sm:col-span-2">{field('Description',item.description,v=>setGalleryRows(prev=>prev.map((r,i)=>i===index?{...r,description:v}:r)))}</div>
            </div><div className="mt-4 flex flex-wrap gap-2"><button disabled={busy} onClick={()=>runSave(()=>saveGalleryItem(item,false),'Gallery draft saved.')} className="rounded-full border border-[#D8CEC0] px-4 py-2 text-xs">Save draft</button><button disabled={busy} onClick={()=>runSave(()=>saveGalleryItem(item,true),'Gallery item published.')} className="rounded-full bg-[#1C1511] px-4 py-2 text-xs text-white">Publish</button>{item.id&&<button disabled={busy} onClick={()=>runSave(()=>deleteGalleryItem(item),'Gallery item deleted.')} className="rounded-full border border-red-200 px-4 py-2 text-xs text-red-700">Delete</button>}</div></article>)}</div>
          </section>}
        </main>
      </div>
    </div>
  );
};
