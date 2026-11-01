/* ════════════════════════════════════════════════════════════════════
   SITE CONTENT: edit this file to update the portfolio.
   Every section of the page is built from the data below by render.js,
   so you never need to touch index.html to change text, links or lists.

   Tips
   - Add an item: copy an existing { ... } block, paste it, change the values.
     Keep the comma between blocks.
   - Remove an item: delete its { ... } block.
   - Order on the page = order in the list.
   - <em>word</em> makes a word green, <br> forces a line break.
   - Counts (projects, papers, certificates), numbering (P/01, 01, 02...),
     GPA bars and the © year are calculated automatically.
   ════════════════════════════════════════════════════════════════════ */
window.SITE = {
  person: {
    name: ['Sadibul', 'Hasan Sadib'],     // each entry is one line of the big hero name
    fullName: 'Sadibul Hasan Sadib',
    email: 'Sadibhasan520@gmail.com',
    cv: 'Sadib_CV.pdf',
    location: 'Tongi, Bangladesh',
    status: 'Open to AI &amp; data engineering roles', // shown in the hero and the footer
  },

  // Social and file links. hero / footer choose where each button shows.
  // icon: cv, linkedin, github, orcid, kaggle, telegram, email, link
  links: [
    { label: 'Download CV', url: 'Sadib_CV.pdf', icon: 'cv', primary: true, hero: true, footer: true },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/sadib-hasan-85082b185/', icon: 'linkedin', hero: true, footer: true },
    { label: 'GitHub', url: 'https://github.com/sadib017', icon: 'github', hero: true, footer: true },
    { label: 'ORCID', url: 'https://orcid.org/0009-0004-0665-2285', icon: 'orcid', hero: true },
    { label: 'Kaggle', url: 'https://www.kaggle.com/sadibhasan', icon: 'kaggle', hero: true },
    { label: 'Telegram', url: 'http://t.me/Sadib_hasan', icon: 'telegram', footer: true },
  ],

  // Nav, side rail and Ctrl K palette all come from this list. stage = the rail label.
  sections: [
    { id: 'about', nav: 'About', stage: 'Extract', title: 'About' },
    { id: 'skills', nav: 'Skills', stage: 'Transform', title: 'Technical skills' },
    { id: 'projects', nav: 'Projects', stage: 'Load', title: 'Projects' },
    { id: 'experience', nav: 'Experience', stage: 'Runtime', title: 'Experience' },
    { id: 'publications', nav: 'Research', stage: 'Output', title: 'What it produced', label: 'Research' },
    { id: 'education', nav: 'Education', stage: 'Validate', title: 'Education' },
    { id: 'certificates', nav: 'Certifications', stage: 'Verify', title: 'Certifications' },
    { id: 'contact', nav: 'Contact', stage: 'Serve', title: 'Contact' },
  ],

  hero: {
    label: 'Data · Analytics · Automation',
    tagline: 'I build data pipelines, models and dashboards that turn raw records into clear answers.',
    facts: [                                   // the small table under the tagline
      ['Role', 'Aspiring AI &amp; Data Engineer'],
      ['Now', 'Trainee RCM Analyst, at DocPro'],
      ['Degree', 'B.Sc. in CSE'],
      ['Base', 'Tongi, Bangladesh'],
      ['Status', 'status'],                    // 'status' = use person.status with the live dot
    ],
    photo: 'photo.jpg',
    photoFocus: '50% 62%',                     // which part of the photo stays in frame (x% y%)
    photoTags: ['S.H. Sadib', 'Dhaka'],
    telemetry: { lat: '23.89 N', lon: '90.40 E', city: 'Dhaka', timeZone: 'Asia/Dhaka' },
  },

  about: {
    statement: 'I am a CSE graduate who builds <em>data pipelines</em> and <em>AI tools</em>. I work in Python, SQL and PostgreSQL, ship REST APIs in Docker, and publish research in medical imaging and public health.',
    focusTitle: 'Current Focus',
    focus: [
      'Data analysis and BI dashboards',
      'Business reporting and KPIs',
      'Workflow automation with Python',
      'SQL, ETL and data pipelines',
      'Applied ML research',
    ],
  },

  skills: {
    // "By category" tab. Clicking a skill filters projects whose skills list contains it.
    categories: {
      'Languages': ['Python', 'SQL', 'JavaScript', 'PHP', 'C/C++', 'Dart'],
      'Data &amp; Analysis': ['Pandas', 'NumPy', 'SHAP', 'Statistics', 'Data Cleaning'],
      'Databases': ['PostgreSQL', 'MySQL', 'Redis'],
      'BI &amp; Visualization': ['Power BI', 'Looker Studio', 'Matplotlib', 'Seaborn', 'Plotly', 'Streamlit'],
      'Machine Learning': ['Scikit-learn', 'XGBoost', 'PyTorch', 'TensorFlow', 'Keras'],
      'Deep Learning': ['ConvNeXt', 'ViT', 'TinyViT', 'DenseNet', 'SE-Net', 'RAG'],
      'Backend &amp; APIs': ['Django', 'DRF', 'Laravel', 'Flask', 'Node.js', 'RESTful APIs', 'Celery'],
      'Tools &amp; Platforms': ['Docker', 'Git', 'GitHub', 'Postman', 'Nginx', 'Kaggle', 'Google Colab'],
    },
    // "Graph" tab. Each node: [x, y] position from 0 to 1 (left/top to right/bottom).
    graph: {
      nodes: { // listed in the order they appear on phones
        Python: [0.50, 0.14], SQL: [0.26, 0.33], PostgreSQL: [0.32, 0.58], MySQL: [0.12, 0.58], Redis: [0.44, 0.78],
        Pandas: [0.27, 0.10], NumPy: [0.08, 0.12], 'Scikit-learn': [0.83, 0.36], PyTorch: [0.76, 0.10], TensorFlow: [0.93, 0.18],
        Django: [0.61, 0.32], Laravel: [0.25, 0.80], React: [0.15, 0.93], 'REST APIs': [0.44, 0.38], Celery: [0.56, 0.58],
        Docker: [0.63, 0.80], Nginx: [0.73, 0.93], JavaScript: [0.07, 0.80], 'C/C++': [0.90, 0.80], 'Computer Vision': [0.82, 0.58],
        'Power BI': [0.07, 0.36], Flutter: [0.36, 0.93], Git: [0.55, 0.93],
      },
      links: [['Python', 'Pandas'], ['Pandas', 'NumPy'], ['Python', 'Django'], ['Python', 'Scikit-learn'], ['Scikit-learn', 'PyTorch'],
        ['PyTorch', 'TensorFlow'], ['PyTorch', 'Computer Vision'], ['Computer Vision', 'C/C++'], ['SQL', 'PostgreSQL'], ['SQL', 'MySQL'],
        ['SQL', 'Power BI'], ['Pandas', 'Power BI'], ['Django', 'PostgreSQL'], ['Django', 'MySQL'], ['Django', 'Celery'], ['Celery', 'Redis'],
        ['Laravel', 'PostgreSQL'], ['Laravel', 'React'], ['React', 'JavaScript'], ['REST APIs', 'Django'], ['REST APIs', 'Laravel'],
        ['Docker', 'Django'], ['Docker', 'Nginx'], ['Redis', 'Laravel'], ['Flutter', 'REST APIs'], ['Git', 'Docker'], ['Python', 'SQL']],
    },
    ticker: ['Python', 'SQL', 'PostgreSQL', 'Pandas', 'Docker', 'REST APIs', 'PyTorch', 'Power BI', 'Redis', 'Scikit-learn', 'MySQL', 'Git'],
  },

  // status: 'Completed' (green) or anything else, e.g. 'Ongoing' (amber).
  // skills: used by the skill graph filter. tags: the small chips on the card.
  // featured: true makes it the big card with stats and the optional architecture diagram.
  projects: [
    {
      featured: true,
      title: 'GhurteJai: a travel platform for Bangladesh',
      type: 'Featured · Backend &amp; Data',
      status: 'Completed',
      desc: 'Django REST backend with PostgreSQL, Redis caching, Celery workers, Docker Compose and Nginx. Role based access, moderation, full text search and a Flutter client.',
      stats: [['20+', 'Endpoint groups'], ['5', 'Services'], ['RBAC', 'Access control']],
      tags: ['Python', 'DRF', 'PostgreSQL', 'Redis', 'Celery', 'Docker'],
      skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Celery', 'Docker', 'Nginx', 'Flutter', 'REST APIs'],
      links: [['View repository', 'https://github.com/ShrekBytes/ghurtejai']],
      arch: {
        label: 'Architecture: Flutter client to DRF API behind Nginx, with Redis cache, Celery jobs and PostgreSQL',
        nodes: [['Client', 'Flutter', 4, 16], ['API', 'DRF + Nginx', 44, 16], ['Cache', 'Redis', 76, 42], ['DB', 'Postgres', 76, 70], ['Jobs', 'Celery', 44, 70]], // [title, sub, left %, top %]
        paths: ['M86 52 H142', 'M222 62 C252 62 250 120 262 120', 'M222 62 C258 62 252 188 262 188', 'M182 76 V170'], // drawn in a 320 x 240 box
      },
    },
    {
      title: 'JobTracker', type: 'Web app', status: 'Completed',
      desc: 'Track applications across hiring stages, with auth, dashboard analytics and responsive CRUD.',
      tags: ['Laravel', 'React', 'Inertia.js', 'PostgreSQL'],
      skills: ['Laravel', 'React', 'PostgreSQL', 'REST APIs'],
      links: [['Repo', 'https://github.com/sadib017/job-tracker-using-laravel'], ['Live', 'https://job-tracker-using-laravel.onrender.com/']],
    },
    {
      title: 'ESP32-CAM object detection', type: 'Edge AI', status: 'Completed',
      desc: 'On device inference on an ESP32-CAM: 80 to 85% accuracy at about 500 ms per frame.',
      tags: ['C/C++', 'Edge Impulse', 'ESP32'],
      skills: ['C/C++', 'Computer Vision', 'Edge Impulse'],
      links: [['Repo', 'https://github.com/sadib017/Object-Detection-Using-ESP-32-CAM']],
    },
    {
      title: 'OrbitCRM', type: 'Web3 CRM', status: 'Ongoing',
      desc: 'Multi workspace CRM for Web3 teams: members, contributors, tickets, campaigns and tasks.',
      tags: ['Laravel', 'React', 'Redis', 'Sanctum'],
      skills: ['Laravel', 'React', 'Redis', 'PostgreSQL', 'REST APIs'],
      links: [['Repo', 'https://github.com/sadib017/OrbitCRM-Web3-Community-and-Contributor-Management-Platform']],
    },
    {
      title: 'SnapFill', type: 'Browser extension', status: 'Completed',
      desc: 'One click autofill for job forms, matching 17 field types. Data stays local, passwords are never filled.',
      tags: ['JavaScript', 'Manifest V3'],
      skills: ['JavaScript'],
      links: [['Repo', 'https://github.com/sadib017/SnapFill']],
    },
    {
      title: 'E-Laundry', type: 'Web app', status: 'Completed',
      desc: 'Laundry booking and order tracking for university students, with a status dashboard.',
      tags: ['Python', 'Django', 'MySQL'],
      skills: ['Python', 'Django', 'MySQL'],
      links: [['Repo', 'https://github.com/sadib017/E-Laundry-Management-System']],
    },
  ],

  // now: true adds the green "Now" pill. details is the text behind "More details".
  experience: [
    {
      when: 'Sep 2026 · Present', org: 'DocPro', meta: 'Healthcare data', now: true,
      role: 'Trainee RCM Analyst',
      summary: 'Claim denial analysis, eligibility checks and charge entry for US healthcare billing.',
      details: 'Supporting end to end US healthcare Revenue Cycle Management, including patient eligibility verification, charge entry, and insurance claim submission. Assisting with accounts receivable follow up and claim denial analysis to identify rejection causes, resolve billing errors, and support timely reimbursement in compliance with HIPAA guidelines.',
    },
    {
      when: 'Jun 2026 to Aug 2026', org: 'CSE-TECH, DIU', meta: 'Backend',
      role: 'Laravel Backend Developer',
      summary: 'REST APIs for a client LMS: content delivery, progress tracking, role based access.',
      details: 'Developed the Laravel backend for a client Learning Management System project under Daffodil International University, inspired by platforms like Sikho. Built RESTful APIs and backend logic for content delivery, progress tracking, and role based access control.',
    },
    {
      when: 'Aug 2025 to Jan 2026', org: 'DIU', meta: 'Research',
      role: 'Undergraduate Research Assistant',
      summary: 'Data collection, analysis and literature review. Merged into 4 papers, see Research.',
      details: 'Supported research activities including data collection, literature review, and analysis. Organized research materials, documented findings, and contributed to project development under faculty supervision.',
    },
    {
      when: 'Mar 2025 · Present', org: 'CDC, DIU', meta: 'Leadership',
      role: 'Career Ambassador',
      summary: 'Helped run 3+ career workshops and supported 60+ students.',
      details: 'Supported the Career Development Center in organizing workshops, career fairs, and resume review sessions. Contributed to student engagement tracking, data collection, and reporting to support program improvement.',
    },
    {
      when: 'Feb 2023 to Aug 2023', org: 'Bololex', meta: 'Remote · Community',
      role: 'Community Manager',
      summary: 'Ran a 500+ member community, AMAs and feedback loops.',
      details: 'Managed and moderated a community of 500+ members. Organized 2+ AMA sessions and community events, and monitored engagement trends and user feedback to improve member satisfaction.',
    },
  ],

  research: {
    // Filter buttons: [id, label]. A paper shows under every filter listed in its tags.
    filters: [['imaging', 'Medical imaging'], ['health', 'Public health'], ['conference', 'Conference']],
    // ok: true shows the status pill green, otherwise it is amber.
    papers: [
      {
        title: 'Calibrated Selective Prediction Using Deep Ensembles for Thyroid Nodule Ultrasound Classification Under Dataset Shift',
        field: 'Imaging', tags: ['imaging'], status: '1st revision', ok: true,
        summary: 'Deep ensembles that know when to abstain, calibrated to stay reliable when the ultrasound data shifts.',
        keywords: ['Deep Ensembles', 'Calibration', 'Dataset Shift'],
      },
      {
        title: 'BoneFusionNet: A Detection Guided Multimodal Deep Learning with Clinical Metadata Fusion for Bone Tumor Classification on Radiographs',
        field: 'Imaging', tags: ['imaging'], status: 'Under review',
        summary: 'Detection guided crops fused with clinical metadata for bone tumor classification on radiographs.',
        keywords: ['ConvNeXt', 'BTXRD dataset', 'Fusion'],
      },
      {
        title: 'Measles Outbreak Reporting in Bangladesh, April–July 2026: Analysis of a National District-Level Routine Surveillance Series',
        field: 'Health', tags: ['health'], status: 'Under review',
        summary: 'District level analysis of national routine surveillance data during the 2026 measles outbreak.',
        keywords: ['Public Health', 'Surveillance Data'],
      },
      {
        title: 'Shared Lead Exposure in Pregnant Women and Their Young Children in Bangladesh: A National Cross-Sectional Study',
        field: 'Health', tags: ['health'], status: 'Under review',
        summary: 'National cross sectional study of shared lead exposure between mothers and young children.',
        keywords: ['Public Health', 'Cross Sectional'],
      },
    ],
    emptyText: 'No papers here yet. New ones will show up here.',
    interests: ['Medical image analysis', 'Uncertainty quantification', 'Explainability &amp; Grad-CAM', 'Vision transformers',
      'Clinical decision support', 'Public health data', 'Trustworthy AI', 'Agentic AI'],
  },

  // score / outOf draw the bar and the count-up number.
  education: [
    { when: '2022 to 2026', level: 'Undergraduate', school: 'Daffodil International University', title: 'B.Sc. in Computer Science &amp; Engineering', grade: 'CGPA', score: 3.42, outOf: 4 },
    { when: '2021', level: 'HSC', school: 'Uttara High School &amp; College', title: 'Higher Secondary Certificate', grade: 'GPA', score: 5, outOf: 5 },
    { when: '2019', level: 'SSC', school: 'Safiuddin Sarkar Academy &amp; College', title: 'Secondary School Certificate', grade: 'GPA', score: 4.83, outOf: 5 },
  ],

  certifications: {
    filters: [['ml', 'AI &amp; ML'], ['data', 'Data'], ['tools', 'Tools']],
    // image: a file in the certificates folder (leave '' if you have none, the card still works).
    // url: the verify link (leave '' to show "Credential link coming").
    items: [
      { title: 'Deep Learning Specialization', issuer: 'DeepLearning.AI', date: 'Jan 2026', topic: 'ml', image: 'certificates/deep-learning-specialization.jpg', url: 'https://coursera.org/share/620135d0a88363a597ea6220a035ea92' },
      { title: 'Machine Learning Specialization', issuer: 'Stanford', date: 'Sep 2025', topic: 'ml', image: 'certificates/machine-learning-specialization.jpg', url: 'https://coursera.org/share/69fb5623dabc0c55521179d490b2fc6d' },
      { title: 'Python for Data Science, AI &amp; Development', issuer: 'IBM', date: 'Sep 2025', topic: 'data', image: 'certificates/python-for-data-science.jpg', url: 'https://coursera.org/share/332097cd64d870071d7b18fa34f159ee' },
      { title: 'Data Visualization with Python', issuer: 'IBM', date: 'Jul 2025', topic: 'data', image: 'certificates/data-visualization-with-python.jpg', url: 'https://coursera.org/share/64e1df28fa05b74909c04242576eec51' },
      { title: 'Getting Started with Git and GitHub', issuer: 'IBM', date: 'May 2025', topic: 'tools', image: 'certificates/git-and-github.jpg', url: 'https://coursera.org/share/3fba62b1bb63c5f15ee4e33dcd6caf2b' },
    ],
  },

  footer: {
    headline: 'Have data that needs a pipeline<br>or analytics? Let&rsquo;s&nbsp;talk.',
    updated: 'October 2026',   // shown as "Last updated ..."; 'auto' uses the date the file was last saved
  },
};
