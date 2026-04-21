-- ============================================================
--  بنك الدروس (Lesson Bank) — Complete Supabase SQL Schema
--  Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- for fuzzy Arabic search

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE resource_type    AS ENUM ('pdf', 'ppt', 'video');
CREATE TYPE education_level  AS ENUM ('primary', 'middle', 'high', 'university');
CREATE TYPE user_role        AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE report_reason    AS ENUM ('spam', 'inappropriate', 'copyright', 'other');

-- ============================================================
-- TABLE: profiles
--   Auto-created when a user signs up via Auth trigger
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id             UUID           PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username       TEXT           UNIQUE,
  full_name      TEXT,
  avatar_url     TEXT,
  bio            TEXT,
  role           user_role      NOT NULL DEFAULT 'student',
  education_level education_level,
  points         INT            NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: subjects
-- ============================================================
CREATE TABLE IF NOT EXISTS subjects (
  id              UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT          NOT NULL,
  name_ar         TEXT          NOT NULL,
  slug            TEXT          NOT NULL UNIQUE,
  icon            TEXT          NOT NULL DEFAULT '📚',
  color           TEXT          NOT NULL DEFAULT '#4f8ef7',
  education_level education_level NOT NULL,
  sort_order      INT           NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: resources
-- ============================================================
CREATE TABLE IF NOT EXISTS resources (
  id            UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT          NOT NULL,
  title_ar      TEXT,
  description   TEXT,
  type          resource_type NOT NULL,
  file_url      TEXT,           -- Supabase Storage URL for PDF/PPT
  youtube_url   TEXT,           -- YouTube embed URL for videos
  thumbnail_url TEXT,
  subject_id    UUID          NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  uploaded_by   UUID          NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  views         INT           NOT NULL DEFAULT 0,
  downloads     INT           NOT NULL DEFAULT 0,
  likes         INT           NOT NULL DEFAULT 0,
  is_approved   BOOLEAN       NOT NULL DEFAULT FALSE,
  is_featured   BOOLEAN       NOT NULL DEFAULT FALSE,
  tags          TEXT[]        DEFAULT '{}',
  search_vector TSVECTOR,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_file_or_youtube CHECK (
    (type IN ('pdf','ppt') AND file_url IS NOT NULL) OR
    (type = 'video' AND youtube_url IS NOT NULL)
  )
);

-- GIN index for full-text Arabic search
CREATE INDEX IF NOT EXISTS resources_search_idx ON resources USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS resources_subject_idx ON resources(subject_id);
CREATE INDEX IF NOT EXISTS resources_uploader_idx ON resources(uploaded_by);
CREATE INDEX IF NOT EXISTS resources_type_idx ON resources(type);
CREATE INDEX IF NOT EXISTS resources_created_idx ON resources(created_at DESC);

-- ============================================================
-- TABLE: collections (user saved playlists)
-- ============================================================
CREATE TABLE IF NOT EXISTS collections (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT        NOT NULL,
  description TEXT,
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_public   BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Junction table: collection ↔ resources
CREATE TABLE IF NOT EXISTS collection_resources (
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  resource_id   UUID NOT NULL REFERENCES resources(id)   ON DELETE CASCADE,
  added_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (collection_id, resource_id)
);

-- ============================================================
-- TABLE: likes (prevents duplicate likes)
-- ============================================================
CREATE TABLE IF NOT EXISTS likes (
  user_id     UUID NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, resource_id)
);

-- ============================================================
-- TABLE: tags
-- ============================================================
CREATE TABLE IF NOT EXISTS tags (
  id         UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT  NOT NULL UNIQUE,
  slug       TEXT  NOT NULL UNIQUE,
  usage_count INT  NOT NULL DEFAULT 0
);

-- ============================================================
-- TABLE: resource_tags
-- ============================================================
CREATE TABLE IF NOT EXISTS resource_tags (
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  tag_id      UUID NOT NULL REFERENCES tags(id)      ON DELETE CASCADE,
  PRIMARY KEY (resource_id, tag_id)
);

-- ============================================================
-- TABLE: comments
-- ============================================================
CREATE TABLE IF NOT EXISTS comments (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id UUID        NOT NULL REFERENCES resources(id)  ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES profiles(id)   ON DELETE CASCADE,
  content     TEXT        NOT NULL CHECK (char_length(content) <= 1000),
  parent_id   UUID        REFERENCES comments(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: reports
-- ============================================================
CREATE TABLE IF NOT EXISTS reports (
  id          UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id UUID          NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  reporter_id UUID          NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  reason      report_reason NOT NULL,
  details     TEXT,
  resolved    BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('resources', 'resources', TRUE,  52428800, -- 50 MB
   ARRAY['application/pdf',
         'application/vnd.ms-powerpoint',
         'application/vnd.openxmlformats-officedocument.presentationml.presentation']),
  ('avatars',  'avatars',   TRUE,  5242880,  -- 5 MB
   ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- 1. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Update updated_at automatically
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Keep likes count in sync
CREATE OR REPLACE FUNCTION public.update_resource_likes()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE resources SET likes = likes + 1 WHERE id = NEW.resource_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE resources SET likes = GREATEST(likes - 1, 0) WHERE id = OLD.resource_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE TRIGGER trg_likes_count
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION public.update_resource_likes();

-- 4. Increment views (called from client)
CREATE OR REPLACE FUNCTION public.increment_views(resource_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE resources SET views = views + 1 WHERE id = resource_id;
END;
$$;

-- 5. Increment downloads (called from client)
CREATE OR REPLACE FUNCTION public.increment_downloads(resource_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE resources SET downloads = downloads + 1 WHERE id = resource_id;
END;
$$;

-- 6. Full-text search vector update
CREATE OR REPLACE FUNCTION public.update_search_vector()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('arabic', COALESCE(NEW.title_ar, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.title, '')),    'B') ||
    setweight(to_tsvector('simple', COALESCE(NEW.description, '')), 'C');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_search_vector
  BEFORE INSERT OR UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION public.update_search_vector();

-- 7. Fuzzy search function (expo from client)
CREATE OR REPLACE FUNCTION public.search_resources(query TEXT)
RETURNS SETOF resources
LANGUAGE sql
STABLE
AS $$
  SELECT *
  FROM resources
  WHERE is_approved = TRUE
    AND (
      search_vector @@ plainto_tsquery('simple', query)
      OR title ILIKE '%' || query || '%'
      OR title_ar ILIKE '%' || query || '%'
    )
  ORDER BY
    ts_rank(search_vector, plainto_tsquery('simple', query)) DESC,
    likes DESC
  LIMIT 50;
$$;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources          ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections        ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes              ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments           ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports            ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Resources
CREATE POLICY "Approved resources viewable by all" ON resources FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Uploader sees own resources"         ON resources FOR SELECT USING (auth.uid() = uploaded_by);
CREATE POLICY "Authenticated users can upload"      ON resources FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Uploader can update own resource"    ON resources FOR UPDATE USING (auth.uid() = uploaded_by);
CREATE POLICY "Uploader can delete own resource"    ON resources FOR DELETE USING (auth.uid() = uploaded_by);

-- Collections
CREATE POLICY "Public collections viewable by all"  ON collections FOR SELECT USING (is_public = TRUE OR auth.uid() = user_id);
CREATE POLICY "Users manage own collections"        ON collections FOR ALL    USING (auth.uid() = user_id);

-- Collection resources
CREATE POLICY "Users manage own collection items"   ON collection_resources FOR ALL
  USING (EXISTS (SELECT 1 FROM collections c WHERE c.id = collection_id AND c.user_id = auth.uid()));

-- Likes
CREATE POLICY "Anyone can see likes"   ON likes FOR SELECT USING (TRUE);
CREATE POLICY "Users manage own likes" ON likes FOR ALL    USING (auth.uid() = user_id);

-- Comments
CREATE POLICY "Anyone can read comments"    ON comments FOR SELECT USING (TRUE);
CREATE POLICY "Auth users can comment"      ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own comments"   ON comments FOR DELETE USING (auth.uid() = user_id);

-- Reports (users can only see own reports)
CREATE POLICY "Users can create reports"    ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users see own reports"       ON reports FOR SELECT USING (auth.uid() = reporter_id);

-- Storage: resources bucket
CREATE POLICY "Authenticated upload to resources" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'resources' AND auth.role() = 'authenticated');
CREATE POLICY "Public read resources"             ON storage.objects FOR SELECT
  USING (bucket_id = 'resources');

-- Storage: avatars bucket
CREATE POLICY "Users upload own avatar" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Public read avatars"     ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- ============================================================
-- SEED DATA — Sample subjects
-- ============================================================
INSERT INTO subjects (name, name_ar, slug, icon, color, education_level, sort_order) VALUES
  ('Mathematics',      'الرياضيات',     'mathematics',    '📐', '#4f8ef7', 'high',       1),
  ('Physics',          'الفيزياء',      'physics',        '⚡', '#7c5cfc', 'high',       2),
  ('Chemistry',        'الكيمياء',      'chemistry',      '🧪', '#00d4aa', 'high',       3),
  ('Biology',          'الأحياء',       'biology',        '🧬', '#4caf50', 'high',       4),
  ('Arabic Language',  'اللغة العربية', 'arabic',         '📖', '#f5c842', 'high',       5),
  ('English Language', 'اللغة الإنجليزية','english',      '🌐', '#ff7043', 'high',       6),
  ('History',          'التاريخ',       'history',        '🏛',  '#8d6e63', 'high',       7),
  ('Geography',        'الجغرافيا',     'geography',      '🌍', '#26a69a', 'high',       8),
  ('Computer Science', 'الحاسوب',       'cs',             '💻', '#42a5f5', 'high',       9),
  ('Islamic Studies',  'التربية الإسلامية','islamic',     '🌙', '#ab47bc', 'high',      10)
ON CONFLICT (slug) DO NOTHING;
