-- Reduce duplicate permissive SELECT policy evaluation without changing access semantics.
drop policy if exists "Admins manage hero slides" on public.hero_slides;
drop policy if exists "Admins manage products" on public.products;
drop policy if exists "Admins manage gallery" on public.gallery_items;
drop policy if exists "Admins manage site settings" on public.site_settings;
drop policy if exists "Admins manage site content" on public.site_content;

drop policy if exists "Public can read published hero slides" on public.hero_slides;
create policy "Read published hero slides or admin drafts" on public.hero_slides
for select to anon, authenticated using (is_published or (select private.is_tatari_admin()));
create policy "Admins insert hero slides" on public.hero_slides for insert to authenticated with check ((select private.is_tatari_admin()));
create policy "Admins update hero slides" on public.hero_slides for update to authenticated using ((select private.is_tatari_admin())) with check ((select private.is_tatari_admin()));
create policy "Admins delete hero slides" on public.hero_slides for delete to authenticated using ((select private.is_tatari_admin()));

drop policy if exists "Public can read published products" on public.products;
create policy "Read published products or admin drafts" on public.products
for select to anon, authenticated using (is_published or (select private.is_tatari_admin()));
create policy "Admins insert products" on public.products for insert to authenticated with check ((select private.is_tatari_admin()));
create policy "Admins update products" on public.products for update to authenticated using ((select private.is_tatari_admin())) with check ((select private.is_tatari_admin()));
create policy "Admins delete products" on public.products for delete to authenticated using ((select private.is_tatari_admin()));

drop policy if exists "Public can read published gallery" on public.gallery_items;
create policy "Read published gallery or admin drafts" on public.gallery_items
for select to anon, authenticated using (is_published or (select private.is_tatari_admin()));
create policy "Admins insert gallery" on public.gallery_items for insert to authenticated with check ((select private.is_tatari_admin()));
create policy "Admins update gallery" on public.gallery_items for update to authenticated using ((select private.is_tatari_admin())) with check ((select private.is_tatari_admin()));
create policy "Admins delete gallery" on public.gallery_items for delete to authenticated using ((select private.is_tatari_admin()));

drop policy if exists "Public can read published site settings" on public.site_settings;
create policy "Read published site settings or admin drafts" on public.site_settings
for select to anon, authenticated using (is_published or (select private.is_tatari_admin()));
create policy "Admins insert site settings" on public.site_settings for insert to authenticated with check ((select private.is_tatari_admin()));
create policy "Admins update site settings" on public.site_settings for update to authenticated using ((select private.is_tatari_admin())) with check ((select private.is_tatari_admin()));
create policy "Admins delete site settings" on public.site_settings for delete to authenticated using ((select private.is_tatari_admin()));

drop policy if exists "Public can read published site content" on public.site_content;
create policy "Read published site content or admin drafts" on public.site_content
for select to anon, authenticated using (id = 'published' or (select private.is_tatari_admin()));
create policy "Admins insert site content" on public.site_content for insert to authenticated with check ((select private.is_tatari_admin()));
create policy "Admins update site content" on public.site_content for update to authenticated using ((select private.is_tatari_admin())) with check ((select private.is_tatari_admin()));
create policy "Admins delete site content" on public.site_content for delete to authenticated using ((select private.is_tatari_admin()));
