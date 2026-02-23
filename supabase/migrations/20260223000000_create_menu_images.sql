-- Create a table for cached menu images
create table public.tool3_menu_images (
  id uuid default gen_random_uuid() primary key,
  refined_name text not null,
  original_name text not null,
  image_url text not null,
  source text not null check (source in ('tier1_preset', 'tier2_cache', 'tier3_pixabay', 'tier4_openai', 'user_upload')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add index for faster lookups by refined_name
create index tool3_menu_images_refined_name_idx on public.tool3_menu_images (refined_name);

-- Set up Row Level Security (RLS)
alter table public.tool3_menu_images enable row level security;

-- Create policies
-- 1. Everyone can read (select) images
create policy "Images are viewable by everyone" 
  on public.tool3_menu_images for select 
  using ( true );

-- 2. Everyone can insert new images (since we don't have user auth yet)
create policy "Anyone can insert images" 
  on public.tool3_menu_images for insert 
  with check ( true );

-- 3. Only service role can update/delete (to prevent malicious modifications)
create policy "Only service role can update" 
  on public.tool3_menu_images for update 
  using ( false );

create policy "Only service role can delete" 
  on public.tool3_menu_images for delete 
  using ( false );
