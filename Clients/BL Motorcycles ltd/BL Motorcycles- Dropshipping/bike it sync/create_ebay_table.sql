create or replace function public.create_ebay_listings_table()
returns void
language sql
as $$
begin
    -- Create table if it doesn't exist
    create table if not exists public.ebay_listings (
        ItemNumber text primary key,
        Title text not null,
        CustomLabel text,
        AvailableQuantity integer,
        Format text,
        Currency text,
        CurrentPrice numeric,
        Condition text,
        created_at timestamp with time zone default now()
    );
    
    -- Create index for faster lookups
    create index if not exists idx_ebay_listings_custom_label 
        on public.ebay_listings(CustomLabel);
end;
$$;