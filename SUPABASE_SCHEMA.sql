-- Create a table for storing transcripts
create table transcripts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table transcripts enable row level security;

-- Create policies so users can only see their own transcripts
create policy "Users can insert their own transcripts"
  on transcripts for insert
  with check ( auth.uid() = user_id );

create policy "Users can view their own transcripts"
  on transcripts for select
  using ( auth.uid() = user_id );

create policy "Users can delete their own transcripts"
  on transcripts for delete
  using ( auth.uid() = user_id );
