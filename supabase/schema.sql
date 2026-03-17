-- BusyReminder Database Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =========================================
-- USERS TABLE
-- =========================================
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  company_name text,
  sender_name text,
  plan text default 'basic' check (plan in ('basic', 'pro')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  subscription_status text default 'inactive',
  created_at timestamptz default now()
);

-- =========================================
-- CUSTOMERS TABLE
-- =========================================
create table if not exists public.customers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  email text not null,
  status text default 'pending' check (status in ('pending', 'sent_1', 'sent_2', 'sent_3', 'done', 'unsubscribed')),
  review_sent_count integer default 0,
  last_sent_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, email)
);

-- =========================================
-- CAMPAIGNS TABLE
-- =========================================
create table if not exists public.campaigns (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  review_url text,
  reminder_count integer default 3 check (reminder_count between 1 and 3),
  interval_days integer default 7,
  created_at timestamptz default now()
);

-- =========================================
-- EMAIL LOGS TABLE
-- =========================================
create table if not exists public.email_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  customer_id uuid references public.customers(id) on delete cascade not null,
  sent_at timestamptz default now(),
  reminder_number integer not null,
  status text default 'sent' check (status in ('sent', 'failed', 'bounced'))
);

-- =========================================
-- ROW LEVEL SECURITY
-- =========================================

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.customers enable row level security;
alter table public.campaigns enable row level security;
alter table public.email_logs enable row level security;

-- Users: can only see/edit own row
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- Customers: users can only manage their own customers
create policy "Users can view own customers"
  on public.customers for select
  using (auth.uid() = user_id);

create policy "Users can insert own customers"
  on public.customers for insert
  with check (auth.uid() = user_id);

create policy "Users can update own customers"
  on public.customers for update
  using (auth.uid() = user_id);

create policy "Users can delete own customers"
  on public.customers for delete
  using (auth.uid() = user_id);

-- Campaigns: users can only manage their own campaigns
create policy "Users can view own campaigns"
  on public.campaigns for select
  using (auth.uid() = user_id);

create policy "Users can insert own campaigns"
  on public.campaigns for insert
  with check (auth.uid() = user_id);

create policy "Users can update own campaigns"
  on public.campaigns for update
  using (auth.uid() = user_id);

create policy "Users can delete own campaigns"
  on public.campaigns for delete
  using (auth.uid() = user_id);

-- Email logs: users can only view own logs
create policy "Users can view own email logs"
  on public.email_logs for select
  using (auth.uid() = user_id);

-- =========================================
-- TRIGGERS: Auto-create user profile on signup
-- =========================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, company_name, plan)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'company_name', ''),
    coalesce(new.raw_user_meta_data->>'plan', 'basic')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================
-- INDEXES for performance
-- =========================================
create index if not exists idx_customers_user_id on public.customers(user_id);
create index if not exists idx_customers_status on public.customers(status);
create index if not exists idx_customers_last_sent on public.customers(last_sent_at);
create index if not exists idx_email_logs_user_id on public.email_logs(user_id);
create index if not exists idx_email_logs_sent_at on public.email_logs(sent_at);
create index if not exists idx_campaigns_user_id on public.campaigns(user_id);
