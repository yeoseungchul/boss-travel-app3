-- =============================================================================
-- Product catalog: UPSERT from `data/products.json` (+ KO copy from messages)
-- =============================================================================
-- Run in Supabase → SQL Editor.
--
-- 1) First-time: run `supabase/sql/products.sql` (table, RLS, triggers).
-- 2) Run this file (idempotent). Re-run after editing JSON/messages to refresh DB.
--
-- If you already have an older `products` table, the ALTERs below add any
-- missing columns before the INSERT.
-- =============================================================================

alter table public.products add column if not exists product_name text;
alter table public.products add column if not exists title text;
alter table public.products add column if not exists subtitle text;
alter table public.products add column if not exists description text;
alter table public.products add column if not exists price_krw bigint;
alter table public.products add column if not exists duration_days integer;
alter table public.products add column if not exists youtube_url text;
alter table public.products add column if not exists gallery_images text[] not null default '{}'::text[];
alter table public.products add column if not exists itinerary jsonb;
alter table public.products add column if not exists inclusions text[] not null default '{}'::text[];
alter table public.products add column if not exists exclusions text[] not null default '{}'::text[];

insert into public.products (
  id,
  product_name,
  title,
  subtitle,
  description,
  price_krw,
  duration_days,
  youtube_url,
  gallery_images,
  itinerary,
  inclusions,
  exclusions
)
values
  (
    'macau-4d',
    '마카오 프리미엄 4일',
    '마카오 프리미엄 4일',
    '느긋한 리조트와 야경',
    $$프리미엄 마카오 4일 일정입니다. 리조트·야경·세나도 광장 라인을 품격 있게 구성했습니다. 취향에 맞춘 옵션(쇼·스파 등)은 상담에서 조정합니다.$$,
    1890000,
    4,
    null,
    array[
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80&auto=format&fit=crop'
    ]::text[],
    jsonb_build_array(
      '인천 → 마카오 · 호텔 체크인 · 야경 산책',
      '세나도 광장 · 유네스코 루트 · 카지노쇼(선택)',
      '타이파 마을 · 쇼핑 · 스파',
      '체크아웃 · 마카오 → 인천'
    ),
    array[
      '전담 여행 컨시어지 코디네이션',
      '일정 기준 프리미엄급 호텔 숙박',
      '현지 이동 및 핵심 가이드(일정 기준)'
    ]::text[],
    array[
      '국제항공권 및 공항세',
      '개인 경비·선택 옵션(쇼·미식 업그레이드 등)',
      '여행자보험(별도 가입 권장)'
    ]::text[]
  ),
  (
    'shanghai-5d',
    '상하이 시티 5일',
    '상하이 시티 5일',
    '예술·미식·스카이라인',
    $$상하이 5일 도시 시그니처 일정입니다. 번드 야경·예술·미식을 균형 있게 배치했습니다. 디즈니/자유일은 상담 시 조정 가능합니다.$$,
    2150000,
    5,
    null,
    array[
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80&auto=format&fit=crop'
    ]::text[],
    jsonb_build_array(
      '인천 → 상하이 · 더 번드 야경',
      '예원 · 톈즈팡 · 미슐랭 디너',
      '현대미술관 · 앤트워프 거리',
      '디즈니/자유(선택) · 쇼핑',
      '체크아웃 · 상하이 → 인천'
    ),
    array[
      '전담 여행 컨시어지 코디네이션',
      '일정 기준 프리미엄급 호텔 숙박',
      '주요 랜드마크·미술관 방문(일정 기준)'
    ]::text[],
    array[
      '국제항공권 및 공항세',
      '개인 경비·선택 옵션',
      '여행자보험(별도 가입 권장)'
    ]::text[]
  ),
  (
    'combo-7d',
    '마카오+상하이 7일',
    '마카오+상하이 7일',
    '두 도시, 한 번에',
    $$마카오와 상하이를 한 번에 경험하는 7일 패키지입니다. 이동·체크인 리듬을 여유 있게 잡았으며, 미식·예술 옵션은 상담에서 맞춤 조정합니다.$$,
    3490000,
    7,
    null,
    array[
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80&auto=format&fit=crop'
    ]::text[],
    jsonb_build_array(
      '인천 → 마카오',
      '마카오 시티 투어',
      '마카오 자유 · 스파',
      '마카오 → 상하이',
      '상하이 핵심 랜드마크',
      '예술·미식 일정',
      '상하이 → 인천'
    ),
    array[
      '전담 여행 컨시어지 코디네이션',
      '양 도시 프리미엄급 호텔 숙박(일정 기준)',
      '도시 간 이동 및 핵심 가이드(일정 기준)'
    ]::text[],
    array[
      '국제항공권 및 공항세',
      '개인 경비·선택 옵션',
      '여행자보험(별도 가입 권장)'
    ]::text[]
  ),
  (
    'zhuhai-3d',
    '주해 프리미엄 3일',
    '주해 프리미엄 3일',
    '해안·교량과 마카오 연계',
    $$주해 3일 코스입니다. 해안·랜드마크·홍쿄-주하이 대교를 중심으로 구성했으며, 마카오 당일 연계는 선택 사항입니다.$$,
    1650000,
    3,
    null,
    array[
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80&auto=format&fit=crop'
    ]::text[],
    jsonb_build_array(
      '인천 → 주해 · 해변·산책',
      '주해 랜드마크 · 홍쿄-주하이 대교 · 마카오 당일(선택)',
      '체크아웃 · 주해 → 인천'
    ),
    array[
      '전담 여행 컨시어지 코디네이션',
      '일정 기준 프리미엄급 호텔 숙박',
      '현지 이동 및 핵심 가이드(일정 기준)'
    ]::text[],
    array[
      '국제항공권 및 공항세',
      '개인 경비·선택 옵션(마카오 당일 등)',
      '여행자보험(별도 가입 권장)'
    ]::text[]
  )
on conflict (id) do update
set
  product_name = excluded.product_name,
  title = excluded.title,
  subtitle = excluded.subtitle,
  description = excluded.description,
  price_krw = excluded.price_krw,
  duration_days = excluded.duration_days,
  youtube_url = coalesce(products.youtube_url, excluded.youtube_url),
  gallery_images = excluded.gallery_images,
  itinerary = excluded.itinerary,
  inclusions = excluded.inclusions,
  exclusions = excluded.exclusions,
  updated_at = now();
