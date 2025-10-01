-- users/handles
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  handle text unique not null check (char_length(handle) between 1 and 15),
  created_at timestamptz not null default now()
);

-- fast counters per handle
create table if not exists pop_counts (
  handle text primary key references profiles(handle) on delete cascade,
  total bigint not null default 0,
  updated_at timestamptz not null default now()
);

-- optional: sparse event audit (not for every click in prod)
create table if not exists pop_events (
  id bigserial primary key,
  handle text not null references profiles(handle) on delete cascade,
  popped_at timestamptz not null default now(),
  ip_hash text, -- store a hash, not the raw IP
  ua_hash text
);

create index if not exists idx_pop_counts_total_desc on pop_counts (total desc);

create or replace function increment_pop(p_handle text)
returns bigint
language plpgsql
as $$
declare new_total bigint;
begin
  update pop_counts
  set total = total + 1, updated_at = now()
  where handle = p_handle
  returning total into new_total;

  if not found then
    insert into pop_counts(handle, total) values (p_handle, 1)
    on conflict (handle) do update set total = pop_counts.total + 1
    returning total into new_total;
  end if;

  return new_total;
end;
$$;