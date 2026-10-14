import React, { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft, LayoutDashboard, PanelsTopLeft, Sofa, Images, Inbox, Settings,
  LogOut, Save, Upload, RefreshCw, CheckCircle2, AlertCircle, ExternalLink,
  Plus, Trash2, ImagePlus, LoaderCircle, Eye, Clock3
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

type Section = 'Overview' | 'Homepage' | 'Collections' | 'Gallery' | 'Enquiries' | 'Business details';
type HeroSlide = { slide_number: number; title: string; subtitle: string; badge: string; image_url: string; button_text: string; button_url: string; is_published: boolean; draft_data?: Record<string, any> | null };
type SiteSettings = { id: string; business_name: string; tagline: string; address: string; phone: string; phone_international: string; whatsapp_url: string; map_url: string; description: string; editorial_image_url: string; is_published: boolean; draft_data?: Record<string, any> | null };
type ProductRow = { id: string; name: string; category: string; category_label: string; image_url: string; description: string; features: string[]; dimensions: string; materials: string; is_published: boolean; sort_order: number; draft_data?: Record<string, any> | null };
type GalleryRow = { id: string; title: string; category: string; image_url: string; description: string; is_published: boolean; sort_order: number; draft_data?: Record<string, any> | null };
type Enquiry = { id: string; full_name: string; phone: string; category: string; subject: string; message: string; preferred_contact: string; status: string; created_at: string };

const sections: { label: Section; icon: React.ReactNode; description: string }[] = [
  { label: 'Overview', icon: <LayoutDashboard size={18} />, description: 'Your website at a glance, with quick links to the areas you manage most.' },
  { label: 'Homepage', icon: <PanelsTopLeft size={18} />, description: 'Manage the three homepage hero slides and editorial image.' },
  { label: 'Collections', icon: <Sofa size={18} />, description: 'Add and manage the furniture shown in your collections.' },
  { label: 'Gallery', icon: <Images size={18} />, description: 'Manage project and showroom photographs.' },
  { label: 'Enquiries', icon: <Inbox size={18} />, description: 'Review customer messages and track their status.' },
  { label: 'Business details', icon: <Settings size={18} />, description: 'Keep your public contact and showroom information up to date.' },
];
const inputClass = 'w-full rounded-xl border border-[#D8CEC0] bg-white px-4 py-3 text-sm text-[#1C1511] outline-none transition focus:border-[#9B773F] focus:ring-2 focus:ring-[#C9A45C]/25';
const labelClass = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6A4A31]';
const panelClass = 'rounded-2xl border border-[#E4D9C9] bg-white p-5 shadow-[0_8px_30px_rgba(40,25,15,0.04)] sm:p-7';
const buttonPrimary = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#241910] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4A3322] disabled:cursor-not-allowed disabled:opacity-55';
const buttonSecondary = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#D8CEC0] bg-white px-4 py-2.5 text-sm font-semibold text-[#3A271C] transition hover:bg-[#F8F3EB] disabled:cursor-not-allowed disabled:opacity-55';

const StatusPill: React.FC<{ published?: boolean; children?: React.ReactNode }> = ({ published, children }) => (
  <span className={'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ' + (published ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800')}>
    <span className={'h-1.5 w-1.5 rounded-full ' + (published ? 'bg-emerald-500' : 'bg-amber-500')} />
    {children || (published ? 'Published' : 'Draft')}
  </span>
);

export const Admin: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [active, setActive] = useState<Section>('Overview');
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [busyAction, setBusyAction] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [productRows, setProductRows] = useState<ProductRow[]>([]);
  const [galleryRows, setGalleryRows] = useState<GalleryRow[]>([]);
  const [counts, setCounts] = useState({ products: 0, gallery: 0, enquiries: 0 });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const verifyAdmin = useCallback(async (userId: string) => {
    if (!supabase) return false;
    const { data, error: membershipError } = await supabase.from('admin_users').select('user_id').eq('user_id', userId).maybeSingle();
    if (membershipError) throw membershipError;
    return Boolean(data);
  }, []);

  const loadData = useCallback(async () => {
    if (!supabase) throw new Error('Supabase is not configured.');
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
    const heroRows = ((hero.data || []) as HeroSlide[]).map(row => ({ ...row, ...(row.draft_data || {}) }));
    setSlides(heroRows.sort((a, b) => a.slide_number - b.slide_number).slice(0, 3));
    const siteRow = site.data as SiteSettings | null;
    setSettings(siteRow ? ({ ...siteRow, ...(siteRow.draft_data || {}) } as SiteSettings) : null);
    setEnquiries((inbox.data || []) as Enquiry[]);
    setProductRows(((productRowsResult.data || []) as ProductRow[]).map(row => ({ ...row, ...(row.draft_data || {}) } as ProductRow)));
    setGalleryRows(((galleryRowsResult.data || []) as GalleryRow[]).map(row => ({ ...row, ...(row.draft_data || {}) } as GalleryRow)));
    setCounts({ products: products.count || 0, gallery: gallery.count || 0, enquiries: inbox.data?.length || 0 });
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    let activeEffect = true;
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(async ({ data, error: sessionError }) => {
      if (!activeEffect) return;
      if (sessionError) { setError(sessionError.message); setLoading(false); return; }
      if (!data.session) { setLoading(false); return; }
      try {
        if (await verifyAdmin(data.session.user.id)) {
          if (activeEffect) { setSession(data.session); await loadData(); }
        } else {
          await supabase.auth.signOut();
          if (activeEffect) setError('This account is not authorized to manage Tatari.');
        }
      } catch (e) {
        if (activeEffect) setError(e instanceof Error ? e.message : 'Could not verify administrator access.');
      } finally { if (activeEffect) setLoading(false); }
    }).catch((e) => { if (activeEffect) { setError(e instanceof Error ? e.message : 'Could not check your session.'); setLoading(false); } });
    return () => { activeEffect = false; };
  }, [verifyAdmin, loadData]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true); setBusyAction('Signing in'); setError(''); setNotice('');
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (authError) throw authError;
      if (!data.user || !(await verifyAdmin(data.user.id))) {
        await supabase.auth.signOut();
        throw new Error('This account is not authorized. Its user ID must be added to public.admin_users.');
      }
      setSession(data.session); setPassword('');
      await loadData();
      setNotice('You are signed in. Your latest website content has loaded.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Sign-in failed. Please try again.'); }
    finally { setBusy(false); setBusyAction(''); setLoading(false); }
  };

  const runSave = async (task: () => Promise<void | boolean>, message: string, action = 'Saving changes') => {
    setBusy(true); setBusyAction(action); setError(''); setNotice('');
    try {
      const result = await task();
      setNotice(result === false ? 'Cancelled. No changes were made.' : message);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The operation failed. The change was not confirmed as saved.');
    } finally { setBusy(false); setBusyAction(''); }
  };

  const uploadImage = async (file: File | undefined, target: { kind: 'editorial' } | { kind: 'hero'; slideNumber: number } | { kind: 'product'; index: number } | { kind: 'gallery'; index: number }) => {
    if (!file || !supabase) return;
    setError(''); setNotice('');
    if (!file.type.startsWith('image/')) { setError('Please choose an image file.'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('This image is larger than 10 MB. Choose a smaller image.'); return; }
    await runSave(async () => {
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-');
      const path = 'admin/' + Date.now() + '-' + safeName;
      const { error: uploadError } = await supabase!.storage.from('site-media').upload(path, file, { upsert: false, contentType: file.type });
      if (uploadError) throw uploadError;
      const { data } = supabase!.storage.from('site-media').getPublicUrl(path);
      const url = data.publicUrl;
      if (target.kind === 'editorial') setSettings(prev => prev ? { ...prev, editorial_image_url: url } : prev);
      else if (target.kind === 'hero') setSlides(prev => prev.map(s => s.slide_number === target.slideNumber ? { ...s, image_url: url } : s));
      else if (target.kind === 'product') setProductRows(prev => prev.map((row, index) => index === target.index ? { ...row, image_url: url } : row));
      else if (target.kind === 'gallery') setGalleryRows(prev => prev.map((row, index) => index === target.index ? { ...row, image_url: url } : row));
    }, 'Image uploaded to permanent media storage. Preview it, then save or publish the content to use it on the live website.', 'Uploading image');
  };

  const saveSlide = async (slide: HeroSlide, publish: boolean) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const values = { title: slide.title, subtitle: slide.subtitle, badge: slide.badge, image_url: slide.image_url, button_text: slide.button_text, button_url: slide.button_url };
    const { data, error: saveError } = await supabase.from('hero_slides').update({
      draft_data: values, ...(publish ? { ...values, is_published: true } : {}), updated_at: new Date().toISOString(),
    }).eq('slide_number', slide.slide_number).select('slide_number').maybeSingle();
    if (saveError) throw saveError;
    if (!data) throw new Error('No slide record was updated. Check that slide ' + slide.slide_number + ' exists and your admin permissions are active.');
  };

  const saveSettings = async (publish: boolean) => {
    if (!supabase || !settings) throw new Error('Business settings could not be loaded.');
    const values = { business_name: settings.business_name, tagline: settings.tagline, address: settings.address, phone: settings.phone, phone_international: settings.phone_international, whatsapp_url: settings.whatsapp_url, map_url: settings.map_url, description: settings.description, editorial_image_url: settings.editorial_image_url };
    const { data, error: saveError } = await supabase.from('site_settings').update({
      draft_data: values, ...(publish ? { ...values, is_published: true } : {}), updated_at: new Date().toISOString(),
    }).eq('id', 'main').select('id').maybeSingle();
    if (saveError) throw saveError;
    if (!data) throw new Error('No site settings row was updated. Confirm that the main settings row exists and your admin permissions are active.');
  };

  const saveProduct = async (item: ProductRow, publish: boolean) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    if (!item.name.trim()) throw new Error('Enter a product name before saving.');
    const values = { name: item.name.trim(), category: item.category, category_label: item.category_label, image_url: item.image_url, description: item.description, features: item.features || [], dimensions: item.dimensions || '', materials: item.materials || '' };
    const payload = { draft_data: values, ...(publish ? { ...values, is_published: true } : {}), updated_at: new Date().toISOString() };
    if (item.id) {
      const { data, error: saveError } = await supabase.from('products').update(payload).eq('id', item.id).select('id').maybeSingle();
      if (saveError) throw saveError;
      if (!data) throw new Error('The product was not updated. Check administrator permissions and try again.');
    } else {
      const { data, error: saveError } = await supabase.from('products').insert({ ...values, ...payload, is_published: publish, sort_order: productRows.length }).select('id').single();
      if (saveError) throw saveError;
      if (!data) throw new Error('The database did not confirm product creation.');
    }
    await loadData();
  };

  const saveGalleryItem = async (item: GalleryRow, publish: boolean) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    if (!item.title.trim()) throw new Error('Enter a gallery title before saving.');
    const values = { title: item.title.trim(), category: item.category, image_url: item.image_url, description: item.description };
    const payload = { draft_data: values, ...(publish ? { ...values, is_published: true } : {}), updated_at: new Date().toISOString() };
    if (item.id) {
      const { data, error: saveError } = await supabase.from('gallery_items').update(payload).eq('id', item.id).select('id').maybeSingle();
      if (saveError) throw saveError;
      if (!data) throw new Error('The gallery item was not updated. Check administrator permissions and try again.');
    } else {
      const { data, error: saveError } = await supabase.from('gallery_items').insert({ ...values, ...payload, is_published: publish, sort_order: galleryRows.length }).select('id').single();
      if (saveError) throw saveError;
      if (!data) throw new Error('The database did not confirm gallery item creation.');
    }
    await loadData();
  };

  const deleteProduct = async (item: ProductRow) => {
    if (!supabase || !item.id) throw new Error('Save this product before deleting it.');
    if (!window.confirm('Delete “' + item.name + '”? This cannot be undone.')) return false;
    const { data, error: deleteError } = await supabase.from('products').delete().eq('id', item.id).select('id').maybeSingle();
    if (deleteError) throw deleteError;
    if (!data) throw new Error('No product was deleted. Check administrator permissions and try again.');
    await loadData();
  };

  const deleteGalleryItem = async (item: GalleryRow) => {
    if (!supabase || !item.id) throw new Error('Save this gallery item before deleting it.');
    if (!window.confirm('Delete “' + item.title + '”? This cannot be undone.')) return false;
    const { data, error: deleteError } = await supabase.from('gallery_items').delete().eq('id', item.id).select('id').maybeSingle();
    if (deleteError) throw deleteError;
    if (!data) throw new Error('No gallery item was deleted. Check administrator permissions and try again.');
    await loadData();
  };

  const updateEnquiry = async (item: Enquiry, status: string) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { data, error: updateError } = await supabase.from('enquiries').update({ status }).eq('id', item.id).select('id,status').maybeSingle();
    if (updateError) throw updateError;
    if (!data) throw new Error('The enquiry status was not changed.');
    setEnquiries(prev => prev.map(row => row.id === item.id ? { ...row, status: data.status } : row));
  };

  const signOut = async () => {
    if (!supabase) return;
    await runSave(async () => {
      const { error: signOutError } = await supabase!.auth.signOut();
      if (signOutError) throw signOutError;
      setSession(null); setPassword(''); onExit();
    }, 'You have been signed out.', 'Signing out');
  };

  if (!isSupabaseConfigured || !supabase) return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F1E8] px-5 text-[#1C1511]">
      <div className="max-w-lg rounded-3xl border border-[#E4D9C9] bg-white p-7 shadow-xl sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9B773F]">Tatari Furniture</p>
        <h1 className="mt-3 font-serif text-3xl">Admin Center setup needed</h1>
        <p className="mt-3 text-sm leading-6 text-[#6B5546]">The website cannot connect to Supabase yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to the deployment environment, then redeploy.</p>
        <button type="button" onClick={onExit} className={buttonSecondary + ' mt-6'}><ArrowLeft size={16}/> Return to website</button>
      </div>
    </div>
  );

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F1E8] text-[#3A271C]">
      <div className="text-center"><LoaderCircle className="mx-auto animate-spin" size={30}/><p className="mt-4 text-sm">Checking your administrator session…</p></div>
    </div>
  );

  if (!session) return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F6F1E8] px-4 py-10 text-[#1C1511]">
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#D9C39A]/25 blur-3xl"/>
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-[#BFA17A]/20 blur-3xl"/>
      <form onSubmit={signIn} className="relative w-full max-w-md rounded-3xl border border-[#E4D9C9] bg-white p-7 shadow-[0_24px_80px_rgba(40,25,15,0.10)] sm:p-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#241910] font-serif text-xl text-[#E7C98D]">T</div>
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#9B773F]">Tatari Furniture · Secure access</p>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl">Welcome back.</h1>
        <p className="mt-3 text-sm leading-6 text-[#6B5546]">Sign in to manage your homepage, furniture collections, gallery, and customer enquiries.</p>
        {error && <div role="alert" className="mt-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"><AlertCircle className="mt-0.5 shrink-0" size={17}/><span>{error}</span></div>}
        {notice && <div role="status" className="mt-5 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"><CheckCircle2 className="mt-0.5 shrink-0" size={17}/><span>{notice}</span></div>}
        <label className="mt-6 block"><span className={labelClass}>Email address</span><input className={inputClass} type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@example.com"/></label>
        <label className="mt-4 block"><span className={labelClass}>Password</span><input className={inputClass} type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password"/></label>
        <button type="submit" disabled={busy} className={buttonPrimary + ' mt-6 w-full'}>{busy ? <LoaderCircle size={16} className="animate-spin"/> : null}{busy ? 'Signing in…' : 'Sign in securely'}</button>
        <button type="button" onClick={onExit} className={buttonSecondary + ' mt-3 w-full'}><ArrowLeft size={16}/> Return to public website</button>
        <p className="mt-5 text-center text-[11px] leading-5 text-[#887563]">Administrator access is restricted to approved accounts.</p>
      </form>
    </div>
  );

  const field = (label: string, value: string, update: (v: string) => void, type = 'text', placeholder = '') => (
    <label className="block"><span className={labelClass}>{label}</span><input className={inputClass} type={type} value={value || ''} placeholder={placeholder} onChange={e=>{ setNotice(''); update(e.target.value); }}/></label>
  );
  const statCards = [
    { label: 'Furniture products', value: counts.products, icon: <Sofa size={18}/>, target: 'Collections' as Section, note: 'Collection items' },
    { label: 'Gallery images', value: counts.gallery, icon: <Images size={18}/>, target: 'Gallery' as Section, note: 'Project photography' },
    { label: 'Customer enquiries', value: counts.enquiries, icon: <Inbox size={18}/>, target: 'Enquiries' as Section, note: 'Latest 200 messages' },
  ];
  const pageTitle = active === 'Overview' ? 'Good to see you.' : active;
  const slidePublishedCount = slides.filter(slide => slide.is_published).length;
  const newEnquiryCount = enquiries.filter(item => item.status === 'new').length;

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#241910]">
      <header className="sticky top-0 z-30 border-b border-[#E4D9C9] bg-[#FBF8F2]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#241910] font-serif text-lg text-[#E7C98D]">T</div>
            <div className="min-w-0"><p className="truncate font-serif text-lg leading-tight tracking-[0.12em]">TATARI</p><p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9B773F]">Website control room</p></div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a href="/" target="_blank" rel="noreferrer" className={buttonSecondary + ' min-h-10 px-3 text-xs'}><Eye size={15}/><span className="hidden sm:inline">View website</span><ExternalLink className="hidden sm:block" size={13}/></a>
            <button type="button" onClick={()=>runSave(loadData,'Everything is up to date.','Refreshing data')} disabled={busy} className={buttonSecondary + ' min-h-10 px-3 text-xs'} aria-label="Refresh website data"><RefreshCw size={15} className={busyAction === 'Refreshing data' ? 'animate-spin' : ''}/><span className="hidden sm:inline">{busyAction === 'Refreshing data' ? 'Refreshing…' : 'Refresh'}</span></button>
            <button type="button" onClick={signOut} disabled={busy} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#E6D6C8] px-3 text-xs font-semibold text-[#7B3428] transition hover:bg-red-50 disabled:opacity-50" aria-label="Sign out"><LogOut size={15}/><span className="hidden sm:inline">Sign out</span></button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-5 sm:px-6 sm:py-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-8 lg:px-8">
        <aside className="h-fit rounded-2xl border border-[#E4D9C9] bg-white p-3 shadow-sm lg:sticky lg:top-24">
          <div className="px-3 pb-3 pt-2"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9B773F]">Manage your website</p><p className="mt-1 text-xs text-[#887563]">Choose a section to edit</p></div>
          <nav aria-label="Admin sections" className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">
            {sections.map(s=><button key={s.label} type="button" onClick={()=>{setActive(s.label);setError('');setNotice('');}} aria-current={active===s.label?'page':undefined} className={'flex min-h-11 items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ' + (active===s.label?'bg-[#241910] text-white shadow-sm':'text-[#5B4635] hover:bg-[#F7F3EC]')}><span className={active===s.label?'text-[#E7C98D]':'text-[#9B773F]'}>{s.icon}</span><span>{s.label}</span>{s.label==='Enquiries' && newEnquiryCount>0 && <span className="ml-auto rounded-full bg-[#C9A45C] px-2 py-0.5 text-[10px] font-bold text-[#241910]">{newEnquiryCount}</span>}</button>)}
          </nav>
          <div className="mt-4 rounded-xl bg-[#F7F3EC] p-3"><p className="text-xs font-semibold text-[#3A271C]">Quick tip</p><p className="mt-1 text-xs leading-5 text-[#887563]">Save a draft first when making changes. Publish only when you're ready for visitors to see them.</p></div>
        </aside>

        <main className="min-w-0">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#9B773F]">Tatari Furniture · Admin</p><h1 className="font-serif text-3xl leading-tight sm:text-4xl">{pageTitle}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#806B59]">{sections.find(s=>s.label===active)?.description}</p></div>
            {lastUpdated && <div className="flex items-center gap-1.5 text-[11px] text-[#887563]"><Clock3 size={13}/> Updated {lastUpdated.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>}
          </div>

          <div className="mb-5 space-y-3" aria-live="polite" aria-atomic="true">
            {busy && <div role="status" className="flex items-center gap-3 rounded-xl border border-[#E5D5B4] bg-[#FFF9EA] px-4 py-3 text-sm text-[#62451F]"><LoaderCircle size={17} className="animate-spin"/><span>{busyAction || 'Working…'} — please keep this page open.</span></div>}
            {notice && !busy && <div role="status" className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"><CheckCircle2 size={18} className="mt-0.5 shrink-0"/><div><p className="font-semibold">Confirmed</p><p className="mt-0.5 leading-5">{notice}</p></div><button type="button" onClick={()=>setNotice('')} className="ml-auto text-xs font-semibold underline">Dismiss</button></div>}
            {error && <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"><AlertCircle size={18} className="mt-0.5 shrink-0"/><div><p className="font-semibold">Action needs attention</p><p className="mt-0.5 break-words leading-5">{error}</p></div><button type="button" onClick={()=>setError('')} className="ml-auto text-xs font-semibold underline">Dismiss</button></div>}
          </div>

          {active==='Overview' && <div className="space-y-6">
            <section className="rounded-2xl bg-[#241910] p-6 text-white shadow-sm sm:p-8"><div className="flex flex-wrap items-start justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#E7C98D]">Your website, in your hands</p><h2 className="mt-3 max-w-xl font-serif text-3xl leading-tight sm:text-4xl">Make every detail feel like Tatari.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-white/70">Keep your furniture, imagery, and customer conversations polished and up to date.</p></div><div className="rounded-2xl border border-white/15 bg-white/5 p-4"><p className="text-xs text-white/60">Homepage slides published</p><p className="mt-1 font-serif text-3xl">{slidePublishedCount}<span className="text-lg text-white/50"> / 3</span></p><StatusPill published={slidePublishedCount===3}>{slidePublishedCount===3?'All slides live':'Publishing incomplete'}</StatusPill></div></div><div className="mt-6 flex flex-wrap gap-2"><button type="button" onClick={()=>setActive('Homepage')} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#E7C98D] px-4 py-2.5 text-sm font-bold text-[#241910] transition hover:bg-[#F0DDB5]"><PanelsTopLeft size={16}/> Edit homepage</button><button type="button" onClick={()=>setActive('Collections')} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"><Plus size={16}/> Manage furniture</button></div></section>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{statCards.map(card=><button key={card.label} type="button" onClick={()=>setActive(card.target)} className="group rounded-2xl border border-[#E4D9C9] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#C9A45C] hover:shadow-md"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F0E4] text-[#8D6A37]">{card.icon}</span><span className="text-xs text-[#9B773F] group-hover:translate-x-0.5">Manage →</span></div><p className="mt-5 text-sm font-medium text-[#6B5546]">{card.label}</p><p className="mt-1 font-serif text-3xl">{card.value}</p><p className="mt-1 text-xs text-[#9A8878]">{card.note}</p></button>)}</div>
            <section className={panelClass}><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-2xl">Your next steps</h2><p className="mt-1 text-sm text-[#887563]">A quick checklist for a complete, up-to-date website.</p></div><a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#76562D] underline underline-offset-4">Preview live website <ExternalLink size={14}/></a></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{[{title:'Review the homepage',desc:'Check all three hero slides and the editorial image.',target:'Homepage' as Section},{title:'Keep collections current',desc:'Add clear photos and descriptions for each furniture item.',target:'Collections' as Section},{title:'Refresh your gallery',desc:'Show finished projects and showroom details.',target:'Gallery' as Section},{title:'Reply to enquiries',desc:'Review new messages and update their status.',target:'Enquiries' as Section}].map(item=><button type="button" key={item.title} onClick={()=>setActive(item.target)} className="flex items-start gap-3 rounded-xl border border-[#EEE5D9] p-4 text-left transition hover:bg-[#FBF8F2]"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#A68147]"/><span><span className="block text-sm font-semibold">{item.title}</span><span className="mt-1 block text-xs leading-5 text-[#887563]">{item.desc}</span></span></button>)}</div></section>
          </div>}

          {active==='Homepage' && <div className="space-y-6">
            <section className={panelClass}><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-2xl">Homepage hero</h2><p className="mt-1 text-sm text-[#887563]">Exactly three fixed slides. Each slide is edited and saved independently.</p></div><span className="rounded-full bg-[#F7F0E4] px-3 py-1.5 text-xs font-semibold text-[#76562D]">{slides.length} of 3 slots</span></div>
              {slides.length===0 && <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">No hero slide records were returned by the database. The three required records must exist before editing.</p>}
              {slides.map(slide=><article key={slide.slide_number} className="mb-5 overflow-hidden rounded-2xl border border-[#E8DECF] last:mb-0"><div className="flex flex-wrap items-center justify-between gap-3 bg-[#FBF8F2] px-4 py-3 sm:px-5"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#241910] text-sm font-semibold text-[#E7C98D]">{slide.slide_number}</span><div><h3 className="text-sm font-semibold">Hero slide {slide.slide_number}</h3><p className="text-xs text-[#887563]">Edits affect this slide only</p></div></div><StatusPill published={slide.is_published}/></div><div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_220px]"><div className="grid content-start gap-4 sm:grid-cols-2">{field('Headline',slide.title,v=>setSlides(prev=>prev.map(s=>s.slide_number===slide.slide_number?{...s,title:v}:s)))}{field('Badge / label',slide.badge,v=>setSlides(prev=>prev.map(s=>s.slide_number===slide.slide_number?{...s,badge:v}:s)))}<div className="sm:col-span-2">{field('Supporting text',slide.subtitle,v=>setSlides(prev=>prev.map(s=>s.slide_number===slide.slide_number?{...s,subtitle:v}:s)))}</div>{field('Hero image URL',slide.image_url,v=>setSlides(prev=>prev.map(s=>s.slide_number===slide.slide_number?{...s,image_url:v}:s)), 'url', 'https://…')}{field('Button text',slide.button_text,v=>setSlides(prev=>prev.map(s=>s.slide_number===slide.slide_number?{...s,button_text:v}:s)))}{field('Button destination URL',slide.button_url,v=>setSlides(prev=>prev.map(s=>s.slide_number===slide.slide_number?{...s,button_url:v}:s)), 'text', '/collections')}</div><div><div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-[#E8DECF] bg-[#F7F3EC]">{slide.image_url?<img src={slide.image_url} alt={'Preview of hero slide '+slide.slide_number} className="h-full w-full object-cover" onError={e=>{e.currentTarget.style.display='none';}}/>:<div className="px-4 text-center text-xs text-[#887563]"><ImagePlus className="mx-auto mb-2" size={24}/>No image selected</div>}</div><label className="mt-3 flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#C9B79F] px-3 py-2 text-center text-xs font-semibold text-[#76562D] transition hover:bg-[#FBF8F2]"><Upload size={15}/> Choose image from phone<input type="file" accept="image/*" className="sr-only" onChange={e=>{uploadImage(e.target.files?.[0],{kind:'hero',slideNumber:slide.slide_number});e.currentTarget.value='';}}/></label><p className="mt-2 text-[10px] leading-4 text-[#9A8878]">Images up to 10 MB. Uploads are stored in Supabase.</p></div></div><div className="flex flex-wrap gap-2 border-t border-[#EEE5D9] bg-white px-4 py-3 sm:px-5"><button type="button" disabled={busy} onClick={()=>runSave(()=>saveSlide(slide,false),'Hero slide '+slide.slide_number+' draft was confirmed in the database.','Saving slide '+slide.slide_number+' draft')} className={buttonSecondary}><Save size={15}/>{busy && busyAction==='Saving slide '+slide.slide_number+' draft'?'Saving draft…':'Save draft'}</button><button type="button" disabled={busy} onClick={()=>runSave(()=>saveSlide(slide,true),'Hero slide '+slide.slide_number+' was published to the database.','Publishing slide '+slide.slide_number)} className={buttonPrimary}>{busy && busyAction==='Publishing slide '+slide.slide_number?'Publishing…':'Publish slide'}</button></div></article>)}
            </section>
            {settings && <section className={panelClass}><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-serif text-2xl">Editorial image</h2><p className="mt-1 text-sm leading-5 text-[#887563]">This image is independent from all three hero slides.</p></div><StatusPill published={settings.is_published}/></div><div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,1fr)_260px]"><div>{field('Editorial image URL',settings.editorial_image_url,v=>setSettings({...settings,editorial_image_url:v}),'url','https://…')}<label className="mt-4 flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#C9B79F] px-3 py-3 text-sm font-semibold text-[#76562D] hover:bg-[#FBF8F2]"><Upload size={16}/> Upload replacement from phone<input type="file" accept="image/*" className="sr-only" onChange={e=>{uploadImage(e.target.files?.[0],{kind:'editorial'});e.currentTarget.value='';}}/></label></div><div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-[#E8DECF] bg-[#F7F3EC]">{settings.editorial_image_url?<img src={settings.editorial_image_url} alt="Editorial image preview" className="h-full w-full object-cover"/>:<div className="text-center text-xs text-[#887563]"><ImagePlus className="mx-auto mb-2" size={24}/>No editorial image</div>}</div></div><div className="mt-5 flex flex-wrap gap-2"><button type="button" disabled={busy} onClick={()=>runSave(()=>saveSettings(false),'Editorial image draft was confirmed in the database.','Saving editorial image draft')} className={buttonSecondary}><Save size={15}/>{busy && busyAction==='Saving editorial image draft'?'Saving…':'Save draft'}</button><button type="button" disabled={busy} onClick={()=>runSave(()=>saveSettings(true),'Editorial image settings were published.','Publishing editorial image')} className={buttonPrimary}>{busy && busyAction==='Publishing editorial image'?'Publishing…':'Publish editorial image'}</button></div></section>}
          </div>}

          {active==='Business details' && settings && <section className={panelClass}><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-2xl">Business information</h2><p className="mt-1 text-sm text-[#887563]">These details can appear across the public website.</p></div><StatusPill published={settings.is_published}/></div><div className="grid gap-5 sm:grid-cols-2">{field('Business name',settings.business_name,v=>setSettings({...settings,business_name:v}))}{field('Tagline',settings.tagline,v=>setSettings({...settings,tagline:v}))}{field('Showroom address',settings.address,v=>setSettings({...settings,address:v}))}{field('Phone display',settings.phone,v=>setSettings({...settings,phone:v}))}{field('Phone link / international number',settings.phone_international,v=>setSettings({...settings,phone_international:v}))}{field('WhatsApp URL',settings.whatsapp_url,v=>setSettings({...settings,whatsapp_url:v}),'url','https://wa.me/…')}{field('Map URL',settings.map_url,v=>setSettings({...settings,map_url:v}),'url','https://maps.google.com/…')}<div className="sm:col-span-2">{field('Business description',settings.description,v=>setSettings({...settings,description:v}))}</div></div><div className="mt-6 flex flex-wrap gap-2 border-t border-[#EEE5D9] pt-5"><button type="button" disabled={busy} onClick={()=>runSave(()=>saveSettings(false),'Business details draft was confirmed in the database.','Saving business details')} className={buttonSecondary}><Save size={15}/>{busy && busyAction==='Saving business details'?'Saving…':'Save draft'}</button><button type="button" disabled={busy} onClick={()=>runSave(()=>saveSettings(true),'Business details were published to the database.','Publishing business details')} className={buttonPrimary}>{busy && busyAction==='Publishing business details'?'Publishing…':'Publish changes'}</button></div></section>}

          {active==='Enquiries' && <section className={panelClass}><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-2xl">Customer enquiries</h2><p className="mt-1 text-sm text-[#887563]">Status changes are saved to the database immediately.</p></div><span className="rounded-full bg-[#F7F0E4] px-3 py-1.5 text-xs font-semibold text-[#76562D]">{enquiries.length} loaded</span></div>{enquiries.length===0?<div className="rounded-xl border border-dashed border-[#D8CEC0] px-5 py-10 text-center"><Inbox className="mx-auto text-[#B49B7C]" size={30}/><h3 className="mt-3 font-semibold">No enquiries yet</h3><p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-[#887563]">New messages sent through the public contact form will appear here once stored in the database.</p></div>:<div className="space-y-4">{enquiries.map(item=><article key={item.id} className="rounded-xl border border-[#E8DECF] p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><h3 className="break-words font-semibold">{item.full_name}</h3><p className="mt-1 break-words text-sm text-[#6B5546]">{item.phone} · {item.preferred_contact}</p><p className="mt-1 text-xs text-[#9A8878]">{new Date(item.created_at).toLocaleString()} · {item.category}</p></div><label className="block"><span className={labelClass}>Enquiry status</span><select aria-label={'Status for '+item.full_name} className={inputClass+' min-w-36'} value={item.status} disabled={busy} onChange={e=>runSave(()=>updateEnquiry(item,e.target.value),'Enquiry status was confirmed in the database.','Updating enquiry status')}><option value="new">New</option><option value="in_progress">In progress</option><option value="resolved">Resolved</option><option value="archived">Archived</option></select></label></div>{item.subject&&<p className="mt-4 font-semibold">{item.subject}</p>}<p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#4D3B2D]">{item.message}</p></article>)}</div>}</section>}

          {active==='Collections' && <section className={panelClass}><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-2xl">Furniture collections</h2><p className="mt-1 text-sm text-[#887563]">Use a clear photo, useful details, and a short description.</p></div><button type="button" onClick={()=>{setProductRows(prev=>[...prev,{id:'',name:'',category:'living-room',category_label:'Living Room',image_url:'',description:'',features:[],dimensions:'',materials:'',is_published:false,sort_order:prev.length}]);setNotice('A new product form has been added below. It is not saved until you choose Save draft or Publish.');setError('');}} className={buttonPrimary}><Plus size={16}/> Add product</button></div>
            {productRows.length===0?<div className="rounded-xl border border-dashed border-[#D8CEC0] px-5 py-10 text-center"><Sofa className="mx-auto text-[#B49B7C]" size={30}/><h3 className="mt-3 font-semibold">Your collections are ready for products</h3><p className="mt-1 text-sm text-[#887563]">Add your first furniture item to get started.</p></div>:<div className="space-y-5">{productRows.map((item,index)=><article key={item.id || 'new-'+index} className="overflow-hidden rounded-2xl border border-[#E8DECF]"><div className="flex flex-wrap items-center justify-between gap-3 bg-[#FBF8F2] px-4 py-3 sm:px-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white">{item.image_url?<img src={item.image_url} alt="" className="h-full w-full object-cover"/>:<Sofa size={18} className="text-[#B49B7C]"/>}</div><div><h3 className="text-sm font-semibold">{item.name || 'New furniture item'}</h3><p className="text-xs text-[#887563]">{item.category_label || 'Choose a category'}</p></div></div><StatusPill published={item.is_published}/></div><div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">{field('Product name',item.name,v=>setProductRows(prev=>prev.map((r,i)=>i===index?{...r,name:v}:r)), 'text','e.g. Modern 3-seater sofa')}<label><span className={labelClass}>Category</span><select className={inputClass} value={item.category} onChange={e=>setProductRows(prev=>prev.map((r,i)=>i===index?{...r,category:e.target.value,category_label:({'living-room':'Living Room',bedroom:'Bedroom',custom:'Custom Furniture',other:'Other Furniture'} as Record<string,string>)[e.target.value]}:r))}><option value="living-room">Living Room</option><option value="bedroom">Bedroom</option><option value="custom">Custom Furniture</option><option value="other">Other Furniture</option></select></label>{field('Category label',item.category_label,v=>setProductRows(prev=>prev.map((r,i)=>i===index?{...r,category_label:v}:r)))}<div><label className={labelClass}>Image URL</label><input className={inputClass} value={item.image_url || ''} placeholder="Upload or paste an image URL" onChange={e=>setProductRows(prev=>prev.map((r,i)=>i===index?{...r,image_url:e.target.value}:r))}/><label className="mt-2 flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#C9B79F] px-3 py-2 text-xs font-semibold text-[#76562D] hover:bg-[#FBF8F2]"><Upload size={14}/> Choose product image<input type="file" accept="image/*" className="sr-only" onChange={e=>{uploadImage(e.target.files?.[0],{kind:'product',index});e.currentTarget.value='';}}/></label></div><div className="sm:col-span-2">{field('Description',item.description,v=>setProductRows(prev=>prev.map((r,i)=>i===index?{...r,description:v}:r)), 'text','Describe the style, comfort, or use')}</div>{field('Materials',item.materials,v=>setProductRows(prev=>prev.map((r,i)=>i===index?{...r,materials:v}:r)))}{field('Dimensions',item.dimensions,v=>setProductRows(prev=>prev.map((r,i)=>i===index?{...r,dimensions:v}:r)))}<div className="sm:col-span-2">{field('Features (separate with commas)',(item.features||[]).join(', '),v=>setProductRows(prev=>prev.map((r,i)=>i===index?{...r,features:v.split(',').map(s=>s.trim()).filter(Boolean)}:r)))}</div></div><div className="flex flex-wrap gap-2 border-t border-[#EEE5D9] px-4 py-3 sm:px-5"><button type="button" disabled={busy} onClick={()=>runSave(()=>saveProduct(item,false),'Product draft was confirmed in the database.','Saving product draft')} className={buttonSecondary}><Save size={15}/>{busy && busyAction==='Saving product draft'?'Saving…':'Save draft'}</button><button type="button" disabled={busy} onClick={()=>runSave(()=>saveProduct(item,true),'Product was published to the database.','Publishing product')} className={buttonPrimary}>{busy && busyAction==='Publishing product'?'Publishing…':'Publish product'}</button>{item.id&&<button type="button" disabled={busy} onClick={()=>runSave(()=>deleteProduct(item),'Product deletion was confirmed by the database.','Deleting product')} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"><Trash2 size={15}/> Delete</button>}</div></article>)}</div>}
          </section>}

          {active==='Gallery' && <section className={panelClass}><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-2xl">Gallery</h2><p className="mt-1 text-sm text-[#887563]">Show the quality of your work with strong photography.</p></div><button type="button" onClick={()=>{setGalleryRows(prev=>[...prev,{id:'',title:'',category:'Furniture',image_url:'',description:'',is_published:false,sort_order:prev.length}]);setNotice('A new gallery form has been added below. It is not saved until you choose Save draft or Publish.');setError('');}} className={buttonPrimary}><Plus size={16}/> Add gallery image</button></div>
            {galleryRows.length===0?<div className="rounded-xl border border-dashed border-[#D8CEC0] px-5 py-10 text-center"><Images className="mx-auto text-[#B49B7C]" size={30}/><h3 className="mt-3 font-semibold">Your gallery is ready</h3><p className="mt-1 text-sm text-[#887563]">Add a photo of a finished project or showroom display.</p></div>:<div className="grid gap-5 xl:grid-cols-2">{galleryRows.map((item,index)=><article key={item.id || 'new-'+index} className="overflow-hidden rounded-2xl border border-[#E8DECF]"><div className="flex aspect-[16/9] items-center justify-center overflow-hidden bg-[#F7F3EC]">{item.image_url?<img src={item.image_url} alt={item.title || 'Gallery preview'} className="h-full w-full object-cover"/>:<div className="text-center text-xs text-[#887563]"><ImagePlus className="mx-auto mb-2" size={25}/>Image preview will appear here</div>}</div><div className="p-4 sm:p-5"><div className="mb-4 flex items-start justify-between gap-3"><div><h3 className="font-semibold">{item.title || 'New gallery image'}</h3><p className="mt-1 text-xs text-[#887563]">{item.category || 'Uncategorized'}</p></div><StatusPill published={item.is_published}/></div><div className="grid gap-4 sm:grid-cols-2">{field('Image title',item.title,v=>setGalleryRows(prev=>prev.map((r,i)=>i===index?{...r,title:v}:r)))}{field('Category',item.category,v=>setGalleryRows(prev=>prev.map((r,i)=>i===index?{...r,category:v}:r)))}<div className="sm:col-span-2"><label className={labelClass}>Image URL</label><input className={inputClass} value={item.image_url || ''} placeholder="Upload or paste an image URL" onChange={e=>setGalleryRows(prev=>prev.map((r,i)=>i===index?{...r,image_url:e.target.value}:r))}/><label className="mt-2 flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#C9B79F] px-3 py-2 text-xs font-semibold text-[#76562D] hover:bg-[#FBF8F2]"><Upload size={14}/> Choose image from phone<input type="file" accept="image/*" className="sr-only" onChange={e=>{uploadImage(e.target.files?.[0],{kind:'gallery',index});e.currentTarget.value='';}}/></label></div><div className="sm:col-span-2">{field('Description',item.description,v=>setGalleryRows(prev=>prev.map((r,i)=>i===index?{...r,description:v}:r)))}</div></div><div className="mt-4 flex flex-wrap gap-2 border-t border-[#EEE5D9] pt-4"><button type="button" disabled={busy} onClick={()=>runSave(()=>saveGalleryItem(item,false),'Gallery draft was confirmed in the database.','Saving gallery draft')} className={buttonSecondary}><Save size={15}/>{busy && busyAction==='Saving gallery draft'?'Saving…':'Save draft'}</button><button type="button" disabled={busy} onClick={()=>runSave(()=>saveGalleryItem(item,true),'Gallery item was published to the database.','Publishing gallery item')} className={buttonPrimary}>{busy && busyAction==='Publishing gallery item'?'Publishing…':'Publish'}</button>{item.id&&<button type="button" disabled={busy} onClick={()=>runSave(()=>deleteGalleryItem(item),'Gallery item deletion was confirmed by the database.','Deleting gallery item')} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"><Trash2 size={15}/> Delete</button>}</div></div></article>)}</div>}
          </section>}

          {!settings && (active==='Business details' || active==='Homepage') && <section className={panelClass}><div className="flex items-start gap-3"><AlertCircle className="mt-0.5 text-amber-700" size={20}/><div><h2 className="font-semibold">Site settings were not found</h2><p className="mt-1 text-sm leading-6 text-[#887563]">The Admin Center could not find the main site settings row. No changes can be saved here until that database record is restored.</p></div></div></section>}
          <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#E4D9C9] py-5 text-[11px] text-[#9A8878]"><span>Tatari Furniture · Admin Center</span><span>Changes are only confirmed after the database responds successfully.</span></footer>
        </main>
      </div>
    </div>
  );
};
