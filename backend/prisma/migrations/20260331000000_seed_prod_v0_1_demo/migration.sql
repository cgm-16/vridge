-- 시드 데이터: prod_v0_1_demo (사용자/자격증명 제외)
-- 직무 계열, 직무, 스킬, 샘플 조직, 채용 공고, 공지사항 삽입

-- 직무 계열 (job families)
INSERT INTO "job_family" (id, display_name_en, display_name_ko, display_name_vi, sort_order, created_at, updated_at) VALUES
  ('engineering', 'Engineering', '엔지니어링', 'Kỹ thuật', 1, NOW(), NOW()),
  ('design',      'Design',      '디자인',     'Thiết kế',  2, NOW(), NOW()),
  ('product',     'Product',     '프로덕트',   'Sản phẩm',  3, NOW(), NOW()),
  ('marketing',   'Marketing',   '마케팅',     'Tiếp thị',  4, NOW(), NOW()),
  ('operations',  'Operations',  '운영',       'Vận hành',  5, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 직무 (jobs)
INSERT INTO "job" (id, job_family_id, display_name_en, display_name_ko, display_name_vi, sort_order, created_at, updated_at) VALUES
  ('frontend-engineer',  'engineering', 'Frontend Engineer',  '프론트엔드 엔지니어', 'Kỹ sư Frontend',              1, NOW(), NOW()),
  ('backend-engineer',   'engineering', 'Backend Engineer',   '백엔드 엔지니어',     'Kỹ sư Backend',               2, NOW(), NOW()),
  ('fullstack-engineer', 'engineering', 'Fullstack Engineer', '풀스택 엔지니어',     'Kỹ sư Fullstack',             3, NOW(), NOW()),
  ('devops-engineer',    'engineering', 'DevOps Engineer',    '데브옵스 엔지니어',   'Kỹ sư DevOps',                4, NOW(), NOW()),
  ('ui-designer',        'design',      'UI Designer',        'UI 디자이너',         'Nhà thiết kế UI',             1, NOW(), NOW()),
  ('ux-designer',        'design',      'UX Designer',        'UX 디자이너',         'Nhà thiết kế UX',             2, NOW(), NOW()),
  ('product-designer',   'design',      'Product Designer',   '프로덕트 디자이너',   'Nhà thiết kế sản phẩm',       3, NOW(), NOW()),
  ('graphic-designer',   'design',      'Graphic Designer',   '그래픽 디자이너',     'Nhà thiết kế đồ họa',         4, NOW(), NOW()),
  ('product-manager',    'product',     'Product Manager',    '프로덕트 매니저',     'Quản lý sản phẩm',            1, NOW(), NOW()),
  ('product-analyst',    'product',     'Product Analyst',    '프로덕트 분석가',     'Phân tích sản phẩm',          2, NOW(), NOW()),
  ('scrum-master',       'product',     'Scrum Master',       '스크럼 마스터',       'Scrum Master',                3, NOW(), NOW()),
  ('business-analyst',   'product',     'Business Analyst',   '비즈니스 분석가',     'Phân tích kinh doanh',        4, NOW(), NOW()),
  ('digital-marketer',   'marketing',   'Digital Marketer',   '디지털 마케터',       'Tiếp thị số',                 1, NOW(), NOW()),
  ('content-marketer',   'marketing',   'Content Marketer',   '콘텐츠 마케터',       'Tiếp thị nội dung',           2, NOW(), NOW()),
  ('growth-marketer',    'marketing',   'Growth Marketer',    '그로스 마케터',       'Tiếp thị tăng trưởng',        3, NOW(), NOW()),
  ('seo-specialist',     'marketing',   'SEO Specialist',     'SEO 전문가',          'Chuyên gia SEO',              4, NOW(), NOW()),
  ('hr-manager',         'operations',  'HR Manager',         'HR 매니저',           'Quản lý nhân sự',             1, NOW(), NOW()),
  ('finance-manager',    'operations',  'Finance Manager',    '재무 매니저',         'Quản lý tài chính',           2, NOW(), NOW()),
  ('office-manager',     'operations',  'Office Manager',     '오피스 매니저',       'Quản lý văn phòng',           3, NOW(), NOW()),
  ('customer-support',   'operations',  'Customer Support',   '고객 지원',           'Hỗ trợ khách hàng',           4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 스킬 (skills)
INSERT INTO "skill" (id, display_name_en, display_name_ko, display_name_vi, created_at, updated_at) VALUES
  ('javascript',                      'JavaScript',                    '자바스크립트',       'JavaScript',                         NOW(), NOW()),
  ('typescript',                      'TypeScript',                    '타입스크립트',       'TypeScript',                         NOW(), NOW()),
  ('react',                           'React',                         '리액트',             'React',                              NOW(), NOW()),
  ('nextjs',                          'Next.js',                       'Next.js',            'Next.js',                            NOW(), NOW()),
  ('nodejs',                          'Node.js',                       'Node.js',            'Node.js',                            NOW(), NOW()),
  ('python',                          'Python',                        '파이썬',             'Python',                             NOW(), NOW()),
  ('java',                            'Java',                          '자바',               'Java',                               NOW(), NOW()),
  ('postgresql',                      'PostgreSQL',                    'PostgreSQL',         'PostgreSQL',                         NOW(), NOW()),
  ('docker',                          'Docker',                        '도커',               'Docker',                             NOW(), NOW()),
  ('aws',                             'AWS',                           'AWS',                'AWS',                                NOW(), NOW()),
  ('figma',                           'Figma',                         '피그마',             'Figma',                              NOW(), NOW()),
  ('css',                             'CSS',                           'CSS',                'CSS',                                NOW(), NOW()),
  ('tailwindcss',                     'Tailwind CSS',                  '테일윈드 CSS',       'Tailwind CSS',                       NOW(), NOW()),
  ('graphql',                         'GraphQL',                       'GraphQL',            'GraphQL',                            NOW(), NOW()),
  ('rest-api',                        'REST API',                      'REST API',           'REST API',                           NOW(), NOW()),
  ('git',                             'Git',                           'Git',                'Git',                                NOW(), NOW()),
  ('agile',                           'Agile',                         '애자일',             'Agile',                              NOW(), NOW()),
  ('scrum',                           'Scrum',                         '스크럼',             'Scrum',                              NOW(), NOW()),
  ('jira',                            'Jira',                          'Jira',               'Jira',                               NOW(), NOW()),
  ('data-analysis',                   'Data Analysis',                 '데이터 분석',        'Phân tích dữ liệu',                  NOW(), NOW()),
  ('sql',                             'SQL',                           'SQL',                'SQL',                                NOW(), NOW()),
  ('excel',                           'Excel',                         '엑셀',               'Excel',                              NOW(), NOW()),
  ('google-analytics',                'Google Analytics',              '구글 애널리틱스',    'Google Analytics',                   NOW(), NOW()),
  ('seo',                             'SEO',                           'SEO',                'SEO',                                NOW(), NOW()),
  ('copywriting',                     'Copywriting',                   '카피라이팅',         'Viết nội dung',                      NOW(), NOW()),
  ('project-management',              'Project Management',            '프로젝트 관리',      'Quản lý dự án',                      NOW(), NOW()),
  ('communication',                   'Communication',                 '커뮤니케이션',       'Giao tiếp',                          NOW(), NOW()),
  ('leadership',                      'Leadership',                    '리더십',             'Lãnh đạo',                           NOW(), NOW()),
  ('problem-solving',                 'Problem Solving',               '문제 해결',          'Giải quyết vấn đề',                  NOW(), NOW()),
  ('kubernetes',                      'Kubernetes',                    '쿠버네티스',         'Kubernetes',                         NOW(), NOW()),
  ('html',                            'HTML',                          'HTML',               'HTML',                               NOW(), NOW()),
  ('csharp',                          'C#',                            'C#',                 'C#',                                 NOW(), NOW()),
  ('cplusplus',                       'C++',                           'C++',                'C++',                                NOW(), NOW()),
  ('linux',                           'Linux',                         'Linux',              'Linux',                              NOW(), NOW()),
  ('software-development',            'Software Development',          '소프트웨어 개발',    'Phát triển phần mềm',                NOW(), NOW()),
  ('software-troubleshooting',        'Software Troubleshooting',      '소프트웨어 문제 해결', 'Khắc phục sự cố phần mềm',         NOW(), NOW()),
  ('ux-research',                     'UX Research',                   'UX 리서치',          'Nghiên cứu UX',                      NOW(), NOW()),
  ('wireframing',                     'Wireframing',                   '와이어프레이밍',     'Thiết kế khung wireframe',            NOW(), NOW()),
  ('prototyping',                     'Prototyping',                   '프로토타이핑',       'Tạo mẫu thử',                        NOW(), NOW()),
  ('design-systems',                  'Design Systems',                '디자인 시스템',      'Hệ thống thiết kế',                  NOW(), NOW()),
  ('adobe-photoshop',                 'Adobe Photoshop',               '어도비 포토샵',      'Adobe Photoshop',                    NOW(), NOW()),
  ('adobe-illustrator',               'Adobe Illustrator',             '어도비 일러스트레이터', 'Adobe Illustrator',               NOW(), NOW()),
  ('adobe-indesign',                  'Adobe InDesign',                '어도비 인디자인',    'Adobe InDesign',                     NOW(), NOW()),
  ('stakeholder-management',          'Stakeholder Management',        '이해관계자 관리',    'Quản lý các bên liên quan',           NOW(), NOW()),
  ('requirements-gathering',          'Requirements Gathering',        '요구사항 수집',      'Thu thập yêu cầu',                   NOW(), NOW()),
  ('product-strategy',                'Product Strategy',              '제품 전략',          'Chiến lược sản phẩm',                NOW(), NOW()),
  ('roadmap-planning',                'Roadmap Planning',              '로드맵 기획',        'Lập kế hoạch lộ trình',              NOW(), NOW()),
  ('tableau',                         'Tableau',                       '태블로',             'Tableau',                            NOW(), NOW()),
  ('power-bi',                        'Power BI',                      '파워 BI',            'Power BI',                           NOW(), NOW()),
  ('social-media-marketing',          'Social Media Marketing',        '소셜 미디어 마케팅', 'Tiếp thị mạng xã hội',               NOW(), NOW()),
  ('marketing-automation',            'Marketing Automation',          '마케팅 자동화',      'Tự động hóa tiếp thị',               NOW(), NOW()),
  ('customer-relationship-management','Customer Relationship Management','고객 관계 관리',   'Quản lý quan hệ khách hàng',         NOW(), NOW()),
  ('salesforce',                      'Salesforce',                    '세일즈포스',         'Salesforce',                         NOW(), NOW()),
  ('search-engine-marketing',         'Search Engine Marketing',       '검색 엔진 마케팅',   'Tiếp thị công cụ tìm kiếm',          NOW(), NOW()),
  ('campaign-management',             'Campaign Management',           '캠페인 관리',        'Quản lý chiến dịch',                 NOW(), NOW()),
  ('applicant-tracking-system',       'Applicant Tracking System',     '지원자 추적 시스템', 'Hệ thống theo dõi ứng viên',          NOW(), NOW()),
  ('hris',                            'HRIS',                          '인사정보시스템',     'Hệ thống thông tin nhân sự',          NOW(), NOW()),
  ('workday',                         'Workday',                       '워크데이',           'Workday',                            NOW(), NOW()),
  ('payroll-management',              'Payroll Management',            '급여 관리',          'Quản lý tiền lương',                  NOW(), NOW()),
  ('financial-reporting',             'Financial Reporting',           '재무 보고',          'Báo cáo tài chính',                  NOW(), NOW()),
  ('ai-literacy',                     'AI Literacy',                   'AI 리터러시',        'Năng lực AI',                        NOW(), NOW()),
  ('cybersecurity',                   'Cybersecurity',                 '사이버보안',         'An ninh mạng',                       NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 스킬 별칭 (skill aliases) — 중복 방지를 위해 NOT EXISTS 사용
INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'javascript', 'js', 'js', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'javascript' AND alias_normalized = 'js');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'typescript', 'ts', 'ts', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'typescript' AND alias_normalized = 'ts');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'react', 'reactjs', 'reactjs', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'react' AND alias_normalized = 'reactjs');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'react', 'react.js', 'react.js', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'react' AND alias_normalized = 'react.js');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'nextjs', 'next', 'next', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'nextjs' AND alias_normalized = 'next');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'nodejs', 'node', 'node', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'nodejs' AND alias_normalized = 'node');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'python', 'py', 'py', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'python' AND alias_normalized = 'py');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'postgresql', 'postgres', 'postgres', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'postgresql' AND alias_normalized = 'postgres');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'postgresql', 'psql', 'psql', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'postgresql' AND alias_normalized = 'psql');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'aws', 'amazon-web-services', 'amazon-web-services', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'aws' AND alias_normalized = 'amazon-web-services');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'css', 'css3', 'css3', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'css' AND alias_normalized = 'css3');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'tailwindcss', 'tailwind', 'tailwind', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'tailwindcss' AND alias_normalized = 'tailwind');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'graphql', 'gql', 'gql', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'graphql' AND alias_normalized = 'gql');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'rest-api', 'restful', 'restful', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'rest-api' AND alias_normalized = 'restful');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'excel', 'ms-excel', 'ms-excel', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'excel' AND alias_normalized = 'ms-excel');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'google-analytics', 'ga', 'ga', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'google-analytics' AND alias_normalized = 'ga');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'seo', 'search-engine-optimization', 'search-engine-optimization', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'seo' AND alias_normalized = 'search-engine-optimization');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'project-management', 'pm', 'pm', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'project-management' AND alias_normalized = 'pm');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'kubernetes', 'k8s', 'k8s', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'kubernetes' AND alias_normalized = 'k8s');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'html', 'html5', 'html5', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'html' AND alias_normalized = 'html5');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'csharp', 'c#', 'c#', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'csharp' AND alias_normalized = 'c#');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'csharp', '.net', '.net', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'csharp' AND alias_normalized = '.net');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'cplusplus', 'c++', 'c++', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'cplusplus' AND alias_normalized = 'c++');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'software-development', 'software-engineering', 'software-engineering', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'software-development' AND alias_normalized = 'software-engineering');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'software-troubleshooting', 'troubleshooting', 'troubleshooting', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'software-troubleshooting' AND alias_normalized = 'troubleshooting');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'ux-research', 'user-research', 'user-research', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'ux-research' AND alias_normalized = 'user-research');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'wireframing', 'wireframe', 'wireframe', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'wireframing' AND alias_normalized = 'wireframe');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'prototyping', 'prototype', 'prototype', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'prototyping' AND alias_normalized = 'prototype');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'design-systems', 'design-system', 'design-system', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'design-systems' AND alias_normalized = 'design-system');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'adobe-photoshop', 'photoshop', 'photoshop', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'adobe-photoshop' AND alias_normalized = 'photoshop');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'adobe-illustrator', 'illustrator', 'illustrator', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'adobe-illustrator' AND alias_normalized = 'illustrator');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'adobe-indesign', 'indesign', 'indesign', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'adobe-indesign' AND alias_normalized = 'indesign');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'stakeholder-management', 'stakeholder-engagement', 'stakeholder-engagement', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'stakeholder-management' AND alias_normalized = 'stakeholder-engagement');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'requirements-gathering', 'requirements-analysis', 'requirements-analysis', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'requirements-gathering' AND alias_normalized = 'requirements-analysis');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'roadmap-planning', 'product-roadmap', 'product-roadmap', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'roadmap-planning' AND alias_normalized = 'product-roadmap');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'power-bi', 'powerbi', 'powerbi', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'power-bi' AND alias_normalized = 'powerbi');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'social-media-marketing', 'smm', 'smm', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'social-media-marketing' AND alias_normalized = 'smm');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'customer-relationship-management', 'crm', 'crm', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'customer-relationship-management' AND alias_normalized = 'crm');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'search-engine-marketing', 'sem', 'sem', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'search-engine-marketing' AND alias_normalized = 'sem');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'applicant-tracking-system', 'ats', 'ats', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'applicant-tracking-system' AND alias_normalized = 'ats');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'hris', 'human-resources-information-system', 'human-resources-information-system', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'hris' AND alias_normalized = 'human-resources-information-system');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'payroll-management', 'payroll', 'payroll', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'payroll-management' AND alias_normalized = 'payroll');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'financial-reporting', 'finance-reporting', 'finance-reporting', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'financial-reporting' AND alias_normalized = 'finance-reporting');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'ai-literacy', 'ai-fluency', 'ai-fluency', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'ai-literacy' AND alias_normalized = 'ai-fluency');

INSERT INTO "skill_alias" (id, skill_id, alias, alias_normalized, created_at, updated_at)
  SELECT gen_random_uuid(), 'cybersecurity', 'cyber-security', 'cyber-security', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "skill_alias" WHERE skill_id = 'cybersecurity' AND alias_normalized = 'cyber-security');

-- 샘플 조직 (sample org)
INSERT INTO "org" (id, name, created_at, updated_at) VALUES
  ('00000000-0000-0000-0000-000000000101', 'Vridge Demo Org', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 채용 공고 (job descriptions)
INSERT INTO "job_description" (
  id, org_id, job_id, title, status, employment_type, work_arrangement,
  min_years_experience, min_education, salary_min, salary_max,
  salary_currency, salary_period, salary_is_negotiable, description_markdown,
  created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000401',
  '00000000-0000-0000-0000-000000000101',
  'frontend-engineer',
  'Frontend Engineer (Next.js)',
  'recruiting'::"job_posting_status",
  'full_time'::"employment_type",
  'remote'::"work_arrangement",
  2,
  'higher_bachelor'::"education_type_vn",
  30000000, 45000000, 'VND', 'month'::"salary_period", false,
  $$## About Us

Vridge Demo Org is building practical ATS workflows for hiring teams. This role (Frontend Engineer (Next.js)) joins a cross-functional group focused on product quality and delivery consistency.

## Responsibilities

- Build and deliver scoped roadmap items with clear ownership.

- Collaborate with design, product, and QA to maintain release quality.

- Document implementation decisions and handoff context to teammates.

## Required Qualifications

- Demonstrated experience shipping production features.

- Strong communication skills with stakeholders across functions.

- Ability to debug issues and drive them to root cause resolution.

## Preferred Qualifications

- Experience in recruiting, HR, or ATS-related domain workflows.

- Familiarity with analytics instrumentation and experiment design.

- Interest in mentoring peers and improving team standards (seed #1).$$,
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "job_description" (
  id, org_id, job_id, title, status, employment_type, work_arrangement,
  min_years_experience, min_education, salary_min, salary_max,
  salary_currency, salary_period, salary_is_negotiable, description_markdown,
  created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000402',
  '00000000-0000-0000-0000-000000000101',
  'backend-engineer',
  'Backend Engineer (Node.js)',
  'recruiting'::"job_posting_status",
  'full_time'::"employment_type",
  'hybrid'::"work_arrangement",
  3,
  'higher_bachelor'::"education_type_vn",
  35000000, 55000000, 'VND', 'month'::"salary_period", true,
  $$## About Us

Vridge Demo Org is building practical ATS workflows for hiring teams. This role (Backend Engineer (Node.js)) joins a cross-functional group focused on product quality and delivery consistency.

## Responsibilities

- Build and deliver scoped roadmap items with clear ownership.

- Collaborate with design, product, and QA to maintain release quality.

- Document implementation decisions and handoff context to teammates.

## Required Qualifications

- Demonstrated experience shipping production features.

- Strong communication skills with stakeholders across functions.

- Ability to debug issues and drive them to root cause resolution.

## Preferred Qualifications

- Experience in recruiting, HR, or ATS-related domain workflows.

- Familiarity with analytics instrumentation and experiment design.

- Interest in mentoring peers and improving team standards (seed #2).$$,
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "job_description" (
  id, org_id, job_id, title, status, employment_type, work_arrangement,
  min_years_experience, min_education, salary_min, salary_max,
  salary_currency, salary_period, salary_is_negotiable, description_markdown,
  created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000403',
  '00000000-0000-0000-0000-000000000101',
  'product-manager',
  'Product Manager (ATS)',
  'recruiting'::"job_posting_status",
  'full_time'::"employment_type",
  'onsite'::"work_arrangement",
  4,
  'higher_bachelor'::"education_type_vn",
  40000000, 65000000, 'VND', 'month'::"salary_period", true,
  $$## About Us

Vridge Demo Org is building practical ATS workflows for hiring teams. This role (Product Manager (ATS)) joins a cross-functional group focused on product quality and delivery consistency.

## Responsibilities

- Build and deliver scoped roadmap items with clear ownership.

- Collaborate with design, product, and QA to maintain release quality.

- Document implementation decisions and handoff context to teammates.

## Required Qualifications

- Demonstrated experience shipping production features.

- Strong communication skills with stakeholders across functions.

- Ability to debug issues and drive them to root cause resolution.

## Preferred Qualifications

- Experience in recruiting, HR, or ATS-related domain workflows.

- Familiarity with analytics instrumentation and experiment design.

- Interest in mentoring peers and improving team standards (seed #3).$$,
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "job_description" (
  id, org_id, job_id, title, status, employment_type, work_arrangement,
  min_years_experience, min_education, salary_min, salary_max,
  salary_currency, salary_period, salary_is_negotiable, description_markdown,
  created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000404',
  '00000000-0000-0000-0000-000000000101',
  'content-marketer',
  'Content Marketer',
  'done'::"job_posting_status",
  'intern'::"employment_type",
  'onsite'::"work_arrangement",
  NULL,
  'higher_bachelor'::"education_type_vn",
  NULL, NULL, 'VND', 'month'::"salary_period", true,
  $$## About Us

Vridge Demo Org is building practical ATS workflows for hiring teams. This role (Content Marketer) joins a cross-functional group focused on product quality and delivery consistency.

## Responsibilities

- Build and deliver scoped roadmap items with clear ownership.

- Collaborate with design, product, and QA to maintain release quality.

- Document implementation decisions and handoff context to teammates.

## Required Qualifications

- Demonstrated experience shipping production features.

- Strong communication skills with stakeholders across functions.

- Ability to debug issues and drive them to root cause resolution.

## Preferred Qualifications

- Experience in recruiting, HR, or ATS-related domain workflows.

- Familiarity with analytics instrumentation and experiment design.

- Interest in mentoring peers and improving team standards (seed #4).$$,
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- 채용 공고 스킬 연결 (job description skills)
INSERT INTO "job_description_skill" (id, jd_id, skill_id, created_at, updated_at) VALUES
  -- Frontend Engineer: typescript, react, nextjs, css
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000401', 'typescript',         NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000401', 'react',              NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000401', 'nextjs',             NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000401', 'css',                NOW(), NOW()),
  -- Backend Engineer: nodejs, postgresql, sql, docker, aws
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000402', 'nodejs',             NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000402', 'postgresql',         NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000402', 'sql',                NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000402', 'docker',             NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000402', 'aws',                NOW(), NOW()),
  -- Product Manager: agile, scrum, project-management, communication
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000403', 'agile',              NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000403', 'scrum',              NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000403', 'project-management', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000403', 'communication',      NOW(), NOW()),
  -- Content Marketer: communication, project-management, agile
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000404', 'communication',      NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000404', 'project-management', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000404', 'agile',              NOW(), NOW())
ON CONFLICT (jd_id, skill_id) DO NOTHING;

-- 공지사항 (announcements)
INSERT INTO "announcement" (id, title, content, is_pinned, created_at, updated_at) VALUES
  (
    '00000000-0000-0000-0000-000000003101',
    '서비스 점검 안내',
    '2026-02-20 02:00~04:00 (KST) 동안 시스템 점검이 진행됩니다. 점검 중 일부 기능이 제한될 수 있습니다.',
    true,
    NOW(), NOW()
  ),
  (
    '00000000-0000-0000-0000-000000003102',
    '신규 채용 공고 업데이트',
    '프론트엔드/백엔드 포지션 신규 공고가 등록되었습니다. Jobs 페이지에서 상세 내용을 확인하세요.',
    false,
    NOW(), NOW()
  )
ON CONFLICT (id) DO NOTHING;
