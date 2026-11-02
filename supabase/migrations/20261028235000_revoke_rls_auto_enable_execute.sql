-- rls_auto_enable() backs the ensure_rls event trigger, which runs as the
-- function owner; API roles never need to call it directly
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
