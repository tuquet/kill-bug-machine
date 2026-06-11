-- Migration to fix security invoker to security definer for auth triggers

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'preferred_username',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data ->> 'avatar_url',
    case
      when new.is_anonymous then 'GUEST'
      else 'USER'
    end
  );
  return new;
end;
$$;

create or replace function public.handle_install_core_apps()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_installed_apps (user_id, app_id)
  select new.id, ma.id
  from public.marketplace_apps ma
  where ma.is_core = true
  on conflict do nothing;
  return new;
end;
$$;
