-- ============================================
-- COSMED ANNUAIRE - TABLES ONBOARDING
-- Exécuter dans l'ordre dans Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. TABLE COUNTRIES (tous les pays ISO 3166-1)
-- ============================================

CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(2) NOT NULL UNIQUE,
  name_key VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Countries are viewable by everyone" ON countries FOR SELECT USING (true);

-- Données: tous les pays ISO 3166-1 alpha-2
INSERT INTO countries (code, name_key) VALUES
  ('AF', 'countries.AF'),
  ('AX', 'countries.AX'),
  ('AL', 'countries.AL'),
  ('DZ', 'countries.DZ'),
  ('AS', 'countries.AS'),
  ('AD', 'countries.AD'),
  ('AO', 'countries.AO'),
  ('AI', 'countries.AI'),
  ('AQ', 'countries.AQ'),
  ('AG', 'countries.AG'),
  ('AR', 'countries.AR'),
  ('AM', 'countries.AM'),
  ('AW', 'countries.AW'),
  ('AU', 'countries.AU'),
  ('AT', 'countries.AT'),
  ('AZ', 'countries.AZ'),
  ('BS', 'countries.BS'),
  ('BH', 'countries.BH'),
  ('BD', 'countries.BD'),
  ('BB', 'countries.BB'),
  ('BY', 'countries.BY'),
  ('BE', 'countries.BE'),
  ('BZ', 'countries.BZ'),
  ('BJ', 'countries.BJ'),
  ('BM', 'countries.BM'),
  ('BT', 'countries.BT'),
  ('BO', 'countries.BO'),
  ('BQ', 'countries.BQ'),
  ('BA', 'countries.BA'),
  ('BW', 'countries.BW'),
  ('BV', 'countries.BV'),
  ('BR', 'countries.BR'),
  ('IO', 'countries.IO'),
  ('BN', 'countries.BN'),
  ('BG', 'countries.BG'),
  ('BF', 'countries.BF'),
  ('BI', 'countries.BI'),
  ('CV', 'countries.CV'),
  ('KH', 'countries.KH'),
  ('CM', 'countries.CM'),
  ('CA', 'countries.CA'),
  ('KY', 'countries.KY'),
  ('CF', 'countries.CF'),
  ('TD', 'countries.TD'),
  ('CL', 'countries.CL'),
  ('CN', 'countries.CN'),
  ('CX', 'countries.CX'),
  ('CC', 'countries.CC'),
  ('CO', 'countries.CO'),
  ('KM', 'countries.KM'),
  ('CG', 'countries.CG'),
  ('CD', 'countries.CD'),
  ('CK', 'countries.CK'),
  ('CR', 'countries.CR'),
  ('CI', 'countries.CI'),
  ('HR', 'countries.HR'),
  ('CU', 'countries.CU'),
  ('CW', 'countries.CW'),
  ('CY', 'countries.CY'),
  ('CZ', 'countries.CZ'),
  ('DK', 'countries.DK'),
  ('DJ', 'countries.DJ'),
  ('DM', 'countries.DM'),
  ('DO', 'countries.DO'),
  ('EC', 'countries.EC'),
  ('EG', 'countries.EG'),
  ('SV', 'countries.SV'),
  ('GQ', 'countries.GQ'),
  ('ER', 'countries.ER'),
  ('EE', 'countries.EE'),
  ('SZ', 'countries.SZ'),
  ('ET', 'countries.ET'),
  ('FK', 'countries.FK'),
  ('FO', 'countries.FO'),
  ('FJ', 'countries.FJ'),
  ('FI', 'countries.FI'),
  ('FR', 'countries.FR'),
  ('GF', 'countries.GF'),
  ('PF', 'countries.PF'),
  ('TF', 'countries.TF'),
  ('GA', 'countries.GA'),
  ('GM', 'countries.GM'),
  ('GE', 'countries.GE'),
  ('DE', 'countries.DE'),
  ('GH', 'countries.GH'),
  ('GI', 'countries.GI'),
  ('GR', 'countries.GR'),
  ('GL', 'countries.GL'),
  ('GD', 'countries.GD'),
  ('GP', 'countries.GP'),
  ('GU', 'countries.GU'),
  ('GT', 'countries.GT'),
  ('GG', 'countries.GG'),
  ('GN', 'countries.GN'),
  ('GW', 'countries.GW'),
  ('GY', 'countries.GY'),
  ('HT', 'countries.HT'),
  ('HM', 'countries.HM'),
  ('VA', 'countries.VA'),
  ('HN', 'countries.HN'),
  ('HK', 'countries.HK'),
  ('HU', 'countries.HU'),
  ('IS', 'countries.IS'),
  ('IN', 'countries.IN'),
  ('ID', 'countries.ID'),
  ('IR', 'countries.IR'),
  ('IQ', 'countries.IQ'),
  ('IE', 'countries.IE'),
  ('IM', 'countries.IM'),
  ('IL', 'countries.IL'),
  ('IT', 'countries.IT'),
  ('JM', 'countries.JM'),
  ('JP', 'countries.JP'),
  ('JE', 'countries.JE'),
  ('JO', 'countries.JO'),
  ('KZ', 'countries.KZ'),
  ('KE', 'countries.KE'),
  ('KI', 'countries.KI'),
  ('KP', 'countries.KP'),
  ('KR', 'countries.KR'),
  ('KW', 'countries.KW'),
  ('KG', 'countries.KG'),
  ('LA', 'countries.LA'),
  ('LV', 'countries.LV'),
  ('LB', 'countries.LB'),
  ('LS', 'countries.LS'),
  ('LR', 'countries.LR'),
  ('LY', 'countries.LY'),
  ('LI', 'countries.LI'),
  ('LT', 'countries.LT'),
  ('LU', 'countries.LU'),
  ('MO', 'countries.MO'),
  ('MG', 'countries.MG'),
  ('MW', 'countries.MW'),
  ('MY', 'countries.MY'),
  ('MV', 'countries.MV'),
  ('ML', 'countries.ML'),
  ('MT', 'countries.MT'),
  ('MH', 'countries.MH'),
  ('MQ', 'countries.MQ'),
  ('MR', 'countries.MR'),
  ('MU', 'countries.MU'),
  ('YT', 'countries.YT'),
  ('MX', 'countries.MX'),
  ('FM', 'countries.FM'),
  ('MD', 'countries.MD'),
  ('MC', 'countries.MC'),
  ('MN', 'countries.MN'),
  ('ME', 'countries.ME'),
  ('MS', 'countries.MS'),
  ('MA', 'countries.MA'),
  ('MZ', 'countries.MZ'),
  ('MM', 'countries.MM'),
  ('NA', 'countries.NA'),
  ('NR', 'countries.NR'),
  ('NP', 'countries.NP'),
  ('NL', 'countries.NL'),
  ('NC', 'countries.NC'),
  ('NZ', 'countries.NZ'),
  ('NI', 'countries.NI'),
  ('NE', 'countries.NE'),
  ('NG', 'countries.NG'),
  ('NU', 'countries.NU'),
  ('NF', 'countries.NF'),
  ('MK', 'countries.MK'),
  ('MP', 'countries.MP'),
  ('NO', 'countries.NO'),
  ('OM', 'countries.OM'),
  ('PK', 'countries.PK'),
  ('PW', 'countries.PW'),
  ('PS', 'countries.PS'),
  ('PA', 'countries.PA'),
  ('PG', 'countries.PG'),
  ('PY', 'countries.PY'),
  ('PE', 'countries.PE'),
  ('PH', 'countries.PH'),
  ('PN', 'countries.PN'),
  ('PL', 'countries.PL'),
  ('PT', 'countries.PT'),
  ('PR', 'countries.PR'),
  ('QA', 'countries.QA'),
  ('RE', 'countries.RE'),
  ('RO', 'countries.RO'),
  ('RU', 'countries.RU'),
  ('RW', 'countries.RW'),
  ('BL', 'countries.BL'),
  ('SH', 'countries.SH'),
  ('KN', 'countries.KN'),
  ('LC', 'countries.LC'),
  ('MF', 'countries.MF'),
  ('PM', 'countries.PM'),
  ('VC', 'countries.VC'),
  ('WS', 'countries.WS'),
  ('SM', 'countries.SM'),
  ('ST', 'countries.ST'),
  ('SA', 'countries.SA'),
  ('SN', 'countries.SN'),
  ('RS', 'countries.RS'),
  ('SC', 'countries.SC'),
  ('SL', 'countries.SL'),
  ('SG', 'countries.SG'),
  ('SX', 'countries.SX'),
  ('SK', 'countries.SK'),
  ('SI', 'countries.SI'),
  ('SB', 'countries.SB'),
  ('SO', 'countries.SO'),
  ('ZA', 'countries.ZA'),
  ('GS', 'countries.GS'),
  ('SS', 'countries.SS'),
  ('ES', 'countries.ES'),
  ('LK', 'countries.LK'),
  ('SD', 'countries.SD'),
  ('SR', 'countries.SR'),
  ('SJ', 'countries.SJ'),
  ('SE', 'countries.SE'),
  ('CH', 'countries.CH'),
  ('SY', 'countries.SY'),
  ('TW', 'countries.TW'),
  ('TJ', 'countries.TJ'),
  ('TZ', 'countries.TZ'),
  ('TH', 'countries.TH'),
  ('TL', 'countries.TL'),
  ('TG', 'countries.TG'),
  ('TK', 'countries.TK'),
  ('TO', 'countries.TO'),
  ('TT', 'countries.TT'),
  ('TN', 'countries.TN'),
  ('TR', 'countries.TR'),
  ('TM', 'countries.TM'),
  ('TC', 'countries.TC'),
  ('TV', 'countries.TV'),
  ('UG', 'countries.UG'),
  ('UA', 'countries.UA'),
  ('AE', 'countries.AE'),
  ('GB', 'countries.GB'),
  ('US', 'countries.US'),
  ('UM', 'countries.UM'),
  ('UY', 'countries.UY'),
  ('UZ', 'countries.UZ'),
  ('VU', 'countries.VU'),
  ('VE', 'countries.VE'),
  ('VN', 'countries.VN'),
  ('VG', 'countries.VG'),
  ('VI', 'countries.VI'),
  ('WF', 'countries.WF'),
  ('EH', 'countries.EH'),
  ('YE', 'countries.YE'),
  ('ZM', 'countries.ZM'),
  ('ZW', 'countries.ZW');

-- ============================================
-- 2. TABLE DEPARTMENTS
-- ============================================

CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name_key VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Departments are viewable by everyone" ON departments FOR SELECT USING (true);

-- Données initiales
INSERT INTO departments (code, name_key) VALUES
  ('RD', 'departments.rd'),
  ('QUALITY', 'departments.quality'),
  ('PRODUCTION', 'departments.production'),
  ('MARKETING', 'departments.marketing'),
  ('SALES', 'departments.sales'),
  ('PURCHASING', 'departments.purchasing'),
  ('LOGISTICS', 'departments.logistics'),
  ('REGULATORY', 'departments.regulatory'),
  ('HR', 'departments.hr'),
  ('FINANCE', 'departments.finance'),
  ('IT', 'departments.it'),
  ('MANAGEMENT', 'departments.management'),
  ('OTHER', 'departments.other');

-- ============================================
-- 3. TABLE POSITIONS
-- ============================================

CREATE TABLE positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name_key VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Positions are viewable by everyone" ON positions FOR SELECT USING (true);

-- Données initiales
INSERT INTO positions (code, name_key) VALUES
  ('CEO', 'positions.ceo'),
  ('DIRECTOR', 'positions.director'),
  ('MANAGER', 'positions.manager'),
  ('TEAM_LEAD', 'positions.teamLead'),
  ('ENGINEER', 'positions.engineer'),
  ('TECHNICIAN', 'positions.technician'),
  ('SCIENTIST', 'positions.scientist'),
  ('ANALYST', 'positions.analyst'),
  ('COORDINATOR', 'positions.coordinator'),
  ('ASSISTANT', 'positions.assistant'),
  ('INTERN', 'positions.intern'),
  ('CONSULTANT', 'positions.consultant'),
  ('OTHER', 'positions.other');

-- ============================================
-- 4. TABLE COMPANIES
-- ============================================

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  rcs VARCHAR(100),
  country_id UUID REFERENCES countries(id),
  address TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Companies are viewable by everyone" ON companies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create companies" ON companies FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Company creator can update" ON companies FOR UPDATE USING (created_by = auth.uid());

-- ============================================
-- 5. TABLE PROFILES
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  department_id UUID REFERENCES departments(id),
  position_id UUID REFERENCES positions(id),
  company_id UUID REFERENCES companies(id),
  company_role VARCHAR(20) DEFAULT 'user' CHECK (company_role IN ('admin', 'profile_manager', 'payment_manager', 'user')),
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_purpose VARCHAR(20) CHECK (onboarding_purpose IN ('SEARCH', 'REGISTER', 'BOTH')),
  preferred_language VARCHAR(10) DEFAULT 'fr',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Ajouter FK sur companies.created_by (après création de profiles)
ALTER TABLE companies ADD CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES profiles(id);

-- ============================================
-- 6. TABLE ONBOARDING (temporaire)
-- ============================================

CREATE TABLE onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  current_step INT DEFAULT 1,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '14 days')
);

-- RLS
ALTER TABLE onboarding ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own onboarding" ON onboarding FOR ALL USING (profile_id = auth.uid());

-- ============================================
-- 7. TRIGGER: Création auto du profile
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- DONE! Tables créées avec succès
-- ============================================
