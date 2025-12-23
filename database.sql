-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create tables
create table chat_memos (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users not null,
  title text not null,
  created_at timestamp with time zone not null,
  updated_at timestamp with time zone not null,
  title_modified boolean not null default false,
  is_starred boolean not null default false
);

create table messages (
  id bigint primary key generated always as identity,
  chat_memo_id bigint references chat_memos on delete cascade not null,
  content text not null,
  timestamp timestamp with time zone not null,
  is_deleted boolean not null default false
);

create table message_history (
  id bigint primary key generated always as identity,
  message_id bigint references messages on delete cascade not null,
  content text not null,
  timestamp timestamp with time zone not null
);

create table deleted_chat_memos (
  id bigint primary key generated always as identity,
  original_id bigint not null,
  user_id uuid references auth.users not null,
  title text not null,
  created_at timestamp with time zone not null,
  updated_at timestamp with time zone not null,
  title_modified boolean not null,
  is_starred boolean not null,
  deleted_at timestamp with time zone not null,
  messages jsonb not null
);

-- Create indexes
create index chat_memos_user_id_idx on chat_memos(user_id);
create index messages_chat_memo_id_idx on messages(chat_memo_id);
create index message_history_message_id_idx on message_history(message_id);
create index deleted_chat_memos_user_id_idx on deleted_chat_memos(user_id);
create index deleted_chat_memos_deleted_at_idx on deleted_chat_memos(deleted_at);

-- Enable RLS
alter table chat_memos enable row level security;
alter table messages enable row level security;
alter table message_history enable row level security;
alter table deleted_chat_memos enable row level security;

-- Create RLS policies for chat_memos
create policy "Users can view their own chat memos"
  on chat_memos for select
  using (auth.uid() = user_id);

create policy "Users can insert their own chat memos"
  on chat_memos for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own chat memos"
  on chat_memos for update
  using (auth.uid() = user_id);

create policy "Users can delete their own chat memos"
  on chat_memos for delete
  using (auth.uid() = user_id);

-- Create RLS policies for messages
create policy "Users can view messages in their chat memos"
  on messages for select
  using (
    exists (
      select 1
      from chat_memos
      where chat_memos.id = messages.chat_memo_id
      and chat_memos.user_id = auth.uid()
    )
  );

create policy "Users can insert messages in their chat memos"
  on messages for insert
  with check (
    exists (
      select 1
      from chat_memos
      where chat_memos.id = messages.chat_memo_id
      and chat_memos.user_id = auth.uid()
    )
  );

create policy "Users can update messages in their chat memos"
  on messages for update
  using (
    exists (
      select 1
      from chat_memos
      where chat_memos.id = messages.chat_memo_id
      and chat_memos.user_id = auth.uid()
    )
  );

create policy "Users can delete messages in their chat memos"
  on messages for delete
  using (
    exists (
      select 1
      from chat_memos
      where chat_memos.id = messages.chat_memo_id
      and chat_memos.user_id = auth.uid()
    )
  );

-- Create RLS policies for message_history
create policy "Users can view message history in their chat memos"
  on message_history for select
  using (
    exists (
      select 1
      from messages
      join chat_memos on chat_memos.id = messages.chat_memo_id
      where messages.id = message_history.message_id
      and chat_memos.user_id = auth.uid()
    )
  );

create policy "Users can insert message history in their chat memos"
  on message_history for insert
  with check (
    exists (
      select 1
      from messages
      join chat_memos on chat_memos.id = messages.chat_memo_id
      where messages.id = message_history.message_id
      and chat_memos.user_id = auth.uid()
    )
  );

-- Create RLS policies for deleted_chat_memos
create policy "Users can view their own deleted chat memos"
  on deleted_chat_memos for select
  using (auth.uid() = user_id);

create policy "Users can insert their own deleted chat memos"
  on deleted_chat_memos for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own deleted chat memos"
  on deleted_chat_memos for delete
  using (auth.uid() = user_id);

-- Create function to deactivate user
create or replace function delete_user(user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  -- Deactivate the user by updating their status
  update auth.users
  set raw_user_meta_data = jsonb_set(
    coalesce(raw_user_meta_data, '{}'::jsonb),
    '{is_deactivated}',
    'true'
  )
  where id = user_id;
end;
$$;

-- Grant execute permission to authenticated users
grant execute on function delete_user to authenticated;

-- Create policy to allow authenticated users to execute delete_user function
create policy "Allow users to delete their own account"
  on auth.users
  for update
  using (auth.uid() = id);

-- Create function to check if user is deactivated
create or replace function auth.check_user_active()
returns trigger
language plpgsql
security definer
as $$
begin
  if exists (
    select 1
    from auth.users
    where id = new.user_id
    and raw_user_meta_data->>'is_deactivated' = 'true'
  ) then
    raise exception 'このアカウントは無効化されています';
  end if;
  return new;
end;
$$;

-- Create trigger to check user status on sign in
create trigger check_user_active_on_auth
  after insert on auth.sessions
  for each row
  execute function auth.check_user_active();