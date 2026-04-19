import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Monitor, Server, Layers, ChevronDown, ChevronLeft,
    Map, BookOpen, Code2, Rocket, BrainCircuit, Trophy,
    Sparkles, CheckCircle2, BarChart2, Terminal, FlaskConical,
    Clock, Flag, ExternalLink, GraduationCap, Youtube, Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── Toggle: set to false to revert to original Features ── */
export const useRoadmap = true;

/* ─── Static roadmap data ─────────────────────────────────── */
const ROADMAPS = {
    frontend: {
        id: 'frontend',
        label: 'Frontend Developer',
        tagline: 'Build interactive user interfaces',
        description:
            'Master HTML, CSS, JavaScript and modern frameworks like React to create stunning web experiences that delight users.',
        icon: Monitor,
        accentColor: '#00FF00',
        accentMuted: 'rgba(0,255,0,0.12)',
        stages: [
            {
                id: 'basics',
                title: 'Stage 1 — Foundations',
                icon: BookOpen,
                topics: [
                    'HTML5 Semantics & Accessibility',
                    'CSS3 Layouts: Flexbox & Grid',
                    'JavaScript ES6+ Fundamentals',
                    'DOM Manipulation & Events',
                    'Responsive Design & Media Queries',
                    'Version Control with Git & GitHub',
                ],
                resources: [
                    { label: 'HTML Full Course — freeCodeCamp', url: 'https://www.youtube.com/watch?v=kUMe1FH4CHE', type: 'youtube' },
                    { label: 'CSS Flexbox & Grid — Kevin Powell', url: 'https://www.youtube.com/watch?v=u044iM9xsWU', type: 'youtube' },
                    { label: 'MDN Web Docs — HTML Reference', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', type: 'docs' },
                    { label: 'Git & GitHub Crash Course', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk', type: 'youtube' },
                ],
            },
            {
                id: 'core',
                title: 'Stage 2 — Core Concepts',
                icon: Code2,
                topics: [
                    'Data Structures & Algorithms (JS)',
                    'Asynchronous JS: Promises, async/await',
                    'REST APIs & Fetch / Axios',
                    'Browser DevTools & Debugging',
                    'Package Managers: npm / pnpm',
                    'Basic TypeScript',
                ],
                resources: [
                    { label: 'JavaScript — The Complete Guide (Mosh)', url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', type: 'youtube' },
                    { label: 'Async JS Crash Course', url: 'https://www.youtube.com/watch?v=PoRJizFvM7s', type: 'youtube' },
                    { label: 'TypeScript for Beginners', url: 'https://www.youtube.com/watch?v=BwuLxPH8IDs', type: 'youtube' },
                    { label: 'JavaScript.info — Modern JS Tutorial', url: 'https://javascript.info', type: 'docs' },
                ],
            },
            {
                id: 'dev',
                title: 'Stage 3 — Frameworks & Tools',
                icon: Layers,
                topics: [
                    'React.js — Components, Hooks, Context',
                    'React Router & Single-Page Apps',
                    'State Management: Zustand / Redux Toolkit',
                    'Styling: Tailwind CSS / CSS Modules',
                    'Build Tools: Vite / Webpack',
                    'Testing: Vitest + React Testing Library',
                ],
                resources: [
                    { label: 'React Full Course — freeCodeCamp', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8', type: 'youtube' },
                    { label: 'React Docs (Official)', url: 'https://react.dev', type: 'docs' },
                    { label: 'Redux Toolkit Crash Course', url: 'https://www.youtube.com/watch?v=bbkBuqC1rU4', type: 'youtube' },
                    { label: 'Tailwind CSS in 100 Seconds', url: 'https://www.youtube.com/watch?v=mr15Xzb1Ook', type: 'youtube' },
                ],
            },
            {
                id: 'advanced',
                title: 'Stage 4 — Advanced Frontend',
                icon: Rocket,
                topics: [
                    'Performance: Code-splitting, Lazy loading',
                    'Core Web Vitals & Lighthouse',
                    'SSR & SSG with Next.js',
                    'PWA & Service Workers',
                    'Web Accessibility (WCAG)',
                    'Animation: Framer Motion / GSAP',
                ],
                resources: [
                    { label: 'Next.js Full Course — Vercel', url: 'https://www.youtube.com/watch?v=ZVnjOPwW4ZA', type: 'youtube' },
                    { label: 'Web Performance — web.dev', url: 'https://web.dev/performance/', type: 'docs' },
                    { label: 'GSAP Animation Course', url: 'https://www.youtube.com/watch?v=M4GCT-2kaoo', type: 'youtube' },
                    { label: 'PWA Crash Course', url: 'https://www.youtube.com/watch?v=IaJqMcOMuDM', type: 'youtube' },
                ],
            },
            {
                id: 'interview',
                title: 'Stage 5 — Interview Prep',
                icon: Trophy,
                topics: [
                    'Top 50 JavaScript Interview Questions',
                    'React Concept Deep-Dives',
                    'Live Coding Challenges',
                    'System Design for Frontend',
                    'Portfolio & Resume Optimization',
                    'Mock Interviews & Feedback',
                ],
                resources: [
                    { label: 'Frontend Interview Handbook', url: 'https://www.frontendinterviewhandbook.com', type: 'docs' },
                    { label: 'LeetCode — JS Problems', url: 'https://leetcode.com/problemset/javascript/', type: 'docs' },
                    { label: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'docs' },
                    { label: 'Big Frontend Dev — Practice', url: 'https://bigfrontend.dev', type: 'docs' },
                ],
            },
        ],
    },

    backend: {
        id: 'backend',
        label: 'Backend Developer',
        tagline: 'Design robust server architectures',
        description:
            'Learn server-side programming, databases, APIs, and cloud services to build scalable backend systems.',
        icon: Server,
        accentColor: '#ADFF2F',
        accentMuted: 'rgba(173,255,47,0.1)',
        stages: [
            {
                id: 'basics',
                title: 'Stage 1 — Programming Foundations',
                icon: BookOpen,
                topics: [
                    'Node.js Core Modules & Event Loop',
                    'OOP Concepts & Design Principles',
                    'JavaScript for Backend (CommonJS / ESM)',
                    'Shell Scripting & Linux Basics',
                    'Git Workflows & Code Reviews',
                    'HTTP Protocol Deep Dive',
                ],
                resources: [
                    { label: 'Node.js Full Course — Mosh', url: 'https://www.youtube.com/watch?v=TlB_eWDSMt4', type: 'youtube' },
                    { label: 'Linux Command Line Crash Course', url: 'https://www.youtube.com/watch?v=uwAqEzhyjtw', type: 'youtube' },
                    { label: 'Node.js Official Docs', url: 'https://nodejs.org/en/docs', type: 'docs' },
                    { label: 'HTTP Definitive Guide (MDN)', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP', type: 'docs' },
                ],
            },
            {
                id: 'core',
                title: 'Stage 2 — Data & Algorithms',
                icon: Code2,
                topics: [
                    'Data Structures in Node.js',
                    'Algorithm Problem Solving',
                    'Database Theory: Normalization',
                    'SQL Fundamentals (PostgreSQL)',
                    'NoSQL Fundamentals (MongoDB)',
                    'Query Optimization & Indexing',
                ],
                resources: [
                    { label: 'DSA — freeCodeCamp Full Course', url: 'https://www.youtube.com/watch?v=8hly31xKli0', type: 'youtube' },
                    { label: 'SQL Tutorial — Mode Analytics', url: 'https://mode.com/sql-tutorial/', type: 'docs' },
                    { label: 'MongoDB University — Free Courses', url: 'https://university.mongodb.com', type: 'docs' },
                    { label: 'PostgreSQL Full Course', url: 'https://www.youtube.com/watch?v=qw--VYLpxG4', type: 'youtube' },
                ],
            },
            {
                id: 'dev',
                title: 'Stage 3 — APIs & Development',
                icon: Layers,
                topics: [
                    'Express.js & Middleware Pattern',
                    'RESTful API Design Best Practices',
                    'Authentication: JWT, OAuth 2.0',
                    'GraphQL Basics',
                    'ORMs: Prisma / Mongoose',
                    'Input Validation & Error Handling',
                ],
                resources: [
                    { label: 'Express.js Crash Course', url: 'https://www.youtube.com/watch?v=L72fhGm1tfE', type: 'youtube' },
                    { label: 'REST API Design Best Practices', url: 'https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/', type: 'docs' },
                    { label: 'JWT Authentication Guide', url: 'https://jwt.io/introduction', type: 'docs' },
                    { label: 'GraphQL Full Course', url: 'https://www.youtube.com/watch?v=ed8SzALpx1Q', type: 'youtube' },
                ],
            },
            {
                id: 'advanced',
                title: 'Stage 4 — Advanced Backend',
                icon: BrainCircuit,
                topics: [
                    'Microservices Architecture',
                    'Message Queues: Redis / RabbitMQ',
                    'Docker & Container Orchestration',
                    'Cloud: AWS / Azure / GCP basics',
                    'CI/CD Pipelines',
                    'Security: OWASP Top 10',
                ],
                resources: [
                    { label: 'Microservices Explained — Hussein Nasser', url: 'https://www.youtube.com/watch?v=CdBtNQZH8a4', type: 'youtube' },
                    { label: 'Docker Full Course', url: 'https://www.youtube.com/watch?v=pTFZFxd5hOI', type: 'youtube' },
                    { label: 'AWS Free Tier — Get Started', url: 'https://aws.amazon.com/free/', type: 'docs' },
                    { label: 'OWASP Top 10 Security Risks', url: 'https://owasp.org/www-project-top-ten/', type: 'docs' },
                ],
            },
            {
                id: 'interview',
                title: 'Stage 5 — Interview Prep',
                icon: Trophy,
                topics: [
                    'Node.js Deep-Dive Questions',
                    'Database & SQL Challenges',
                    'System Design Interviews',
                    'API Design Case Studies',
                    'Live Take-Home Projects',
                    'Behavioral & Culture Questions',
                ],
                resources: [
                    { label: 'Backend Interview Questions — GitHub', url: 'https://github.com/arialdomartini/Back-End-Developer-Interview-Questions', type: 'docs' },
                    { label: 'System Design Interview — Alex Xu Book', url: 'https://bytebytego.com', type: 'docs' },
                    { label: 'SQL Interview Practice — HackerRank', url: 'https://www.hackerrank.com/domains/sql', type: 'docs' },
                    { label: 'LeetCode — Backend Track', url: 'https://leetcode.com', type: 'docs' },
                ],
            },
        ],
    },

    fullstack: {
        id: 'fullstack',
        label: 'Full Stack Developer',
        tagline: 'Master both frontend and backend',
        description:
            'Combine frontend and backend skills to build complete web applications from database to user interface.',
        icon: Layers,
        accentColor: '#FFD700',
        accentMuted: 'rgba(255,215,0,0.1)',
        stages: [
            {
                id: 'basics',
                title: 'Stage 1 — Core Fundamentals',
                icon: BookOpen,
                topics: [
                    'HTML, CSS & Vanilla JS',
                    'Node.js & Express Basics',
                    'Git, GitHub & Collaboration',
                    'Command Line Essentials',
                    'JSON & REST Concepts',
                    'Dev Environment Setup',
                ],
                resources: [
                    { label: 'The Odin Project — Full Stack Path', url: 'https://www.theodinproject.com', type: 'docs' },
                    { label: 'freeCodeCamp Full Stack Curriculum', url: 'https://www.freecodecamp.org/learn', type: 'docs' },
                    { label: 'Node.js + Express Crash Course', url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4', type: 'youtube' },
                    { label: 'Git Crash Course — Traversy Media', url: 'https://www.youtube.com/watch?v=SWYqp7iY_Tc', type: 'youtube' },
                ],
            },
            {
                id: 'core',
                title: 'Stage 2 — Problem Solving',
                icon: Code2,
                topics: [
                    'Data Structures & Algorithms',
                    'JavaScript / TypeScript Patterns',
                    'Database Design Fundamentals',
                    'SQL + NoSQL Proficiency',
                    'Debugging & Testing Mindset',
                    'Code Quality & Clean Code',
                ],
                resources: [
                    { label: 'JavaScript Algorithms — GitHub', url: 'https://github.com/trekhleb/javascript-algorithms', type: 'docs' },
                    { label: 'Clean Code Summary', url: 'https://github.com/ryanmcdermott/clean-code-javascript', type: 'docs' },
                    { label: 'TypeScript Deep Dive (Free Book)', url: 'https://basarat.gitbook.io/typescript/', type: 'docs' },
                    { label: 'CS50 — Introduction to Databases', url: 'https://cs50.harvard.edu/sql/', type: 'docs' },
                ],
            },
            {
                id: 'dev',
                title: 'Stage 3 — Full Stack Development',
                icon: Layers,
                topics: [
                    'React.js Frontend (Hooks, Router)',
                    'Node.js + Express Backend',
                    'MongoDB or PostgreSQL Integration',
                    'REST API Design & Consumption',
                    'Authentication (JWT + Sessions)',
                    'Deployment on Vercel / Render',
                ],
                resources: [
                    { label: 'MERN Stack Crash Course — Traversy', url: 'https://www.youtube.com/watch?v=-0exw-9YJBo', type: 'youtube' },
                    { label: 'Full Stack Open — University of Helsinki', url: 'https://fullstackopen.com', type: 'docs' },
                    { label: 'Deploy MERN app on Render', url: 'https://render.com/docs/deploy-node-express-app', type: 'docs' },
                    { label: 'Prisma ORM Quickstart', url: 'https://www.prisma.io/docs/getting-started', type: 'docs' },
                ],
            },
            {
                id: 'advanced',
                title: 'Stage 4 — Advanced Topics',
                icon: Rocket,
                topics: [
                    'Next.js (SSR, ISR, App Router)',
                    'Docker & Containerization',
                    'Cloud Basics: AWS EC2, S3, RDS',
                    'WebSockets & Real-Time Apps',
                    'Performance & Caching Strategies',
                    'Scalable Architecture Design',
                ],
                resources: [
                    { label: 'Next.js 14 Full Course', url: 'https://www.youtube.com/watch?v=ZVnjOPwW4ZA', type: 'youtube' },
                    { label: 'Docker & Kubernetes Full Course', url: 'https://www.youtube.com/watch?v=Wf2eSG3owoA', type: 'youtube' },
                    { label: 'Socket.io Crash Course', url: 'https://www.youtube.com/watch?v=ZKEqqIO7n-k', type: 'youtube' },
                    { label: 'AWS Free Tier Guide', url: 'https://aws.amazon.com/free/', type: 'docs' },
                ],
            },
            {
                id: 'interview',
                title: 'Stage 5 — Interview Prep',
                icon: Trophy,
                topics: [
                    'Full Stack System Design',
                    'JavaScript & React Deep Dives',
                    'Backend API Challenges',
                    'End-to-End Take-Home Projects',
                    'Portfolio with 3 Capstone Apps',
                    'Mock Technical Interviews',
                ],
                resources: [
                    { label: 'Full Stack Interview Questions — GitHub', url: 'https://github.com/h5bp/Front-end-Developer-Interview-Questions', type: 'docs' },
                    { label: 'Pramp — Free Mock Interviews', url: 'https://www.pramp.com', type: 'docs' },
                    { label: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'docs' },
                    { label: 'Portfolio Inspiration — Brittany Chiang', url: 'https://brittanychiang.com', type: 'docs' },
                ],
            },
        ],
    },
    datascientist: {
        id: 'datascientist',
        label: 'Data Scientist',
        tagline: 'Extract insights from data',
        description:
            'Learn statistics, machine learning, and data visualization to turn raw data into actionable business insights.',
        icon: BarChart2,
        accentColor: '#60A5FA',
        accentMuted: 'rgba(96,165,250,0.1)',
        duration: '6–8 months',
        phases: 6,
        stages: [
            {
                id: 'basics',
                title: 'Stage 1 — Foundations',
                icon: BookOpen,
                topics: [
                    'Python Basics & Syntax',
                    'Statistics: Mean, Median, Std Dev',
                    'Probability & Distributions',
                    'SQL for Data Querying',
                    'Data Types & Cleaning',
                    'Git & Jupyter Notebooks',
                ],
                resources: [
                    { label: 'Python for Everybody — Dr. Chuck', url: 'https://www.youtube.com/watch?v=8DvywoWv6fI', type: 'youtube' },
                    { label: 'Statistics Fundamentals — StatQuest', url: 'https://www.youtube.com/watch?v=qBigTkBLU6g', type: 'youtube' },
                    { label: 'SQL for Data Analysis — Mode', url: 'https://mode.com/sql-tutorial/', type: 'docs' },
                    { label: 'Kaggle — Free Python & SQL Courses', url: 'https://www.kaggle.com/learn', type: 'docs' },
                ],
            },
            {
                id: 'core',
                title: 'Stage 2 — Core Concepts',
                icon: Code2,
                topics: [
                    'NumPy & Pandas for Data Wrangling',
                    'Data Visualization: Matplotlib, Seaborn',
                    'Hypothesis Testing & A/B Tests',
                    'Feature Engineering',
                    'Exploratory Data Analysis (EDA)',
                    'Working with APIs & JSON Data',
                ],
                resources: [
                    { label: 'Pandas Tutorial — Corey Schafer', url: 'https://www.youtube.com/watch?v=ZyhVh-qRZPA', type: 'youtube' },
                    { label: 'Data Visualization with Matplotlib', url: 'https://www.youtube.com/watch?v=DAQNHzOcO5A', type: 'youtube' },
                    { label: 'Kaggle — Pandas Course (Free)', url: 'https://www.kaggle.com/learn/pandas', type: 'docs' },
                    { label: 'Towards Data Science — EDA Guide', url: 'https://towardsdatascience.com/exploratory-data-analysis-8fc1cb20fd15', type: 'docs' },
                ],
            },
            {
                id: 'dev',
                title: 'Stage 3 — Machine Learning',
                icon: BrainCircuit,
                topics: [
                    'Supervised Learning: Regression, Classification',
                    'Unsupervised Learning: Clustering, PCA',
                    'scikit-learn Pipeline',
                    'Cross-Validation & Hyperparameter Tuning',
                    'Metrics: Accuracy, F1, ROC-AUC',
                    'Ensemble Methods: Random Forest, XGBoost',
                ],
                resources: [
                    { label: 'ML with Python — freeCodeCamp', url: 'https://www.youtube.com/watch?v=7eh4d6sabA0', type: 'youtube' },
                    { label: 'scikit-learn Official Docs', url: 'https://scikit-learn.org/stable/', type: 'docs' },
                    { label: 'Kaggle — Intro to ML (Free)', url: 'https://www.kaggle.com/learn/intro-to-machine-learning', type: 'docs' },
                    { label: 'StatQuest — ML Concepts Playlist', url: 'https://www.youtube.com/@statquest', type: 'youtube' },
                ],
            },
            {
                id: 'advanced',
                title: 'Stage 4 — Deep Learning',
                icon: Rocket,
                topics: [
                    'Neural Networks & Backpropagation',
                    'TensorFlow & Keras',
                    'PyTorch Fundamentals',
                    'CNNs for Image Classification',
                    'RNNs & LSTMs for Sequences',
                    'Transfer Learning & Fine-Tuning',
                ],
                resources: [
                    { label: 'Deep Learning Specialization — Andrew Ng (Free audit)', url: 'https://www.coursera.org/specializations/deep-learning', type: 'docs' },
                    { label: 'PyTorch Full Course — freeCodeCamp', url: 'https://www.youtube.com/watch?v=V_xro1bcAuA', type: 'youtube' },
                    { label: 'Fast.ai — Practical Deep Learning', url: 'https://www.fast.ai', type: 'docs' },
                    { label: '3Blue1Brown — Neural Networks Series', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi', type: 'youtube' },
                ],
            },
            {
                id: 'interview',
                title: 'Stage 5 — Interview Prep',
                icon: Trophy,
                topics: [
                    'Statistics & Probability Questions',
                    'ML Algorithm Deep Dives',
                    'Case Study: Business Problem Solving',
                    'Kaggle Competition Portfolio',
                    'SQL Interview Challenges',
                    'Mock Technical Screening',
                ],
                resources: [
                    { label: 'Data Science Interview Questions — GitHub', url: 'https://github.com/alexeygrigorev/data-science-interviews', type: 'docs' },
                    { label: 'Kaggle Competitions — Start Here', url: 'https://www.kaggle.com/competitions', type: 'docs' },
                    { label: 'StrataScratch — SQL & Python Practice', url: 'https://www.stratascratch.com', type: 'docs' },
                    { label: 'ML Interview Q&A — Chip Huyen', url: 'https://huyenchip.com/ml-interviews-book/', type: 'docs' },
                ],
            },
        ],
    },

    devops: {
        id: 'devops',
        label: 'DevOps Engineer',
        tagline: 'Automate and streamline operations',
        description:
            'Bridge development and operations with CI/CD pipelines, containerization, and infrastructure automation.',
        icon: Terminal,
        accentColor: '#F97316',
        accentMuted: 'rgba(249,115,22,0.1)',
        duration: '5–7 months',
        phases: 7,
        stages: [
            {
                id: 'basics',
                title: 'Stage 1 — Linux & Networking',
                icon: BookOpen,
                topics: [
                    'Linux File System & Commands',
                    'Shell Scripting (Bash)',
                    'TCP/IP, DNS, HTTP/HTTPS',
                    'SSH Keys & Secure Access',
                    'Package Managers: apt, yum',
                    'Cron Jobs & Process Management',
                ],
                resources: [
                    { label: 'Linux for Beginners — freeCodeCamp', url: 'https://www.youtube.com/watch?v=ROjZy1WbCIA', type: 'youtube' },
                    { label: 'Bash Scripting Tutorial', url: 'https://www.youtube.com/watch?v=tK9Oc6AEnR4', type: 'youtube' },
                    { label: 'Networking Fundamentals — Professor Messer', url: 'https://www.professormesser.com', type: 'docs' },
                    { label: 'Linux Foundation — Free Intro Course', url: 'https://training.linuxfoundation.org/training/introduction-to-linux/', type: 'docs' },
                ],
            },
            {
                id: 'core',
                title: 'Stage 2 — Core Concepts',
                icon: Code2,
                topics: [
                    'Version Control: Git Branching Strategies',
                    'Infrastructure as Code Concepts',
                    'Configuration Management Principles',
                    'Monitoring & Logging Basics',
                    'Agile & DevOps Culture',
                    'Security: Secrets Management',
                ],
                resources: [
                    { label: 'DevOps Roadmap — roadmap.sh', url: 'https://roadmap.sh/devops', type: 'docs' },
                    { label: 'Git Branching Strategies — Atlassian', url: 'https://www.atlassian.com/git/tutorials/comparing-workflows', type: 'docs' },
                    { label: 'HashiCorp Vault Secrets Management', url: 'https://developer.hashicorp.com/vault/tutorials', type: 'docs' },
                    { label: 'DevOps Culture — Google SRE Book', url: 'https://sre.google/sre-book/table-of-contents/', type: 'docs' },
                ],
            },
            {
                id: 'dev',
                title: 'Stage 3 — Containers & Orchestration',
                icon: Layers,
                topics: [
                    'Docker: Images, Containers, Compose',
                    'Dockerfile Best Practices',
                    'Kubernetes: Pods, Deployments, Services',
                    'Helm Charts & Package Management',
                    'Container Registries: DockerHub, ECR',
                    'Networking in Kubernetes',
                ],
                resources: [
                    { label: 'Docker Full Course — TechWorld with Nana', url: 'https://www.youtube.com/watch?v=3c-iBn73dDE', type: 'youtube' },
                    { label: 'Kubernetes Full Course — freeCodeCamp', url: 'https://www.youtube.com/watch?v=X48VuDVv0do', type: 'youtube' },
                    { label: 'Play with Kubernetes (Free Lab)', url: 'https://labs.play-with-k8s.com', type: 'docs' },
                    { label: 'Helm Docs — Official', url: 'https://helm.sh/docs/', type: 'docs' },
                ],
            },
            {
                id: 'advanced',
                title: 'Stage 4 — CI/CD & Cloud',
                icon: Rocket,
                topics: [
                    'GitHub Actions & GitLab CI',
                    'Jenkins Pipelines',
                    'Terraform for Infrastructure as Code',
                    'AWS Core Services: EC2, S3, RDS, EKS',
                    'Ansible for Configuration Management',
                    'Observability: Prometheus & Grafana',
                ],
                resources: [
                    { label: 'GitHub Actions Full Course', url: 'https://www.youtube.com/watch?v=R8_veQiYBjI', type: 'youtube' },
                    { label: 'Terraform Full Course — freeCodeCamp', url: 'https://www.youtube.com/watch?v=SLB_c_ayRMo', type: 'youtube' },
                    { label: 'AWS Cloud Practitioner — Free Path', url: 'https://aws.amazon.com/training/digital/', type: 'docs' },
                    { label: 'Prometheus & Grafana Setup Guide', url: 'https://grafana.com/docs/grafana/latest/getting-started/get-started-grafana-prometheus/', type: 'docs' },
                ],
            },
            {
                id: 'interview',
                title: 'Stage 5 — Interview Prep',
                icon: Trophy,
                topics: [
                    'Linux & Networking Scenario Questions',
                    'Docker & Kubernetes Troubleshooting',
                    'CI/CD Pipeline Design Challenges',
                    'Cloud Architecture Discussions',
                    'Incident Response & On-Call Scenarios',
                    'Mock DevOps Technical Interviews',
                ],
                resources: [
                    { label: 'DevOps Interview Questions — GitHub', url: 'https://github.com/Tikam02/DevOps-Guide', type: 'docs' },
                    { label: 'Linux Interview Questions — Top 50', url: 'https://www.guru99.com/linux-interview-questions.html', type: 'docs' },
                    { label: 'Kubernetes Interview Questions', url: 'https://www.edureka.co/blog/interview-questions/kubernetes-interview-questions/', type: 'docs' },
                    { label: 'System Design for DevOps', url: 'https://bytebytego.com', type: 'docs' },
                ],
            },
        ],
    },

    mlengineer: {
        id: 'mlengineer',
        label: 'ML Engineer',
        tagline: 'Build intelligent systems at scale',
        description:
            'Design, train, and deploy machine learning models at scale for production environments and real-world applications.',
        icon: FlaskConical,
        accentColor: '#A78BFA',
        accentMuted: 'rgba(167,139,250,0.1)',
        duration: '7–10 months',
        phases: 8,
        stages: [
            {
                id: 'basics',
                title: 'Stage 1 — Programming Foundations',
                icon: BookOpen,
                topics: [
                    'Python: NumPy, Pandas, OOP',
                    'Mathematics: Linear Algebra, Calculus',
                    'Probability & Statistics',
                    'SQL & Data Pipelines',
                    'Git & Experiment Tracking',
                    'Virtual Environments & Dependencies',
                ],
                resources: [
                    { label: 'Python ML Ecosystem — Real Python', url: 'https://realpython.com/learning-paths/machine-learning/', type: 'docs' },
                    { label: 'Linear Algebra — 3Blue1Brown', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', type: 'youtube' },
                    { label: 'MLflow Getting Started', url: 'https://mlflow.org/docs/latest/getting-started/index.html', type: 'docs' },
                    { label: 'Kaggle — Python & Pandas (Free)', url: 'https://www.kaggle.com/learn', type: 'docs' },
                ],
            },
            {
                id: 'core',
                title: 'Stage 2 — ML Fundamentals',
                icon: Code2,
                topics: [
                    'Supervised & Unsupervised Learning',
                    'Model Evaluation & Validation',
                    'Feature Engineering & Selection',
                    'Bias-Variance Tradeoff',
                    'scikit-learn & Standard Pipelines',
                    'Experiment Tracking with MLflow',
                ],
                resources: [
                    { label: 'ML Specialization — Andrew Ng (Free audit)', url: 'https://www.coursera.org/specializations/machine-learning-introduction', type: 'docs' },
                    { label: 'Hands-On ML — Aurélien Géron (GitHub)', url: 'https://github.com/ageron/handson-ml3', type: 'docs' },
                    { label: 'StatQuest — Bias-Variance', url: 'https://www.youtube.com/watch?v=EuBBz3bI-aA', type: 'youtube' },
                    { label: 'MLflow Tutorial', url: 'https://www.youtube.com/watch?v=859OxXrt_TI', type: 'youtube' },
                ],
            },
            {
                id: 'dev',
                title: 'Stage 3 — Deep Learning',
                icon: BrainCircuit,
                topics: [
                    'Neural Networks: Architecture & Layers',
                    'PyTorch & TensorFlow',
                    'CNNs, RNNs, Transformers',
                    'Transfer Learning & Fine-Tuning LLMs',
                    'Hyperparameter Optimization',
                    'GPU Training & Acceleration',
                ],
                resources: [
                    { label: 'Deep Learning Specialization — Coursera (free audit)', url: 'https://www.coursera.org/specializations/deep-learning', type: 'docs' },
                    { label: 'PyTorch Full Course — freeCodeCamp', url: 'https://www.youtube.com/watch?v=V_xro1bcAuA', type: 'youtube' },
                    { label: 'Attention Is All You Need — Paper Explained', url: 'https://www.youtube.com/watch?v=iDulhoQ2pro', type: 'youtube' },
                    { label: 'Hugging Face — Fine-Tuning LLMs Course', url: 'https://huggingface.co/learn', type: 'docs' },
                ],
            },
            {
                id: 'advanced',
                title: 'Stage 4 — MLOps & Production',
                icon: Rocket,
                topics: [
                    'Model Serving: FastAPI, TorchServe',
                    'Model Versioning & Registry',
                    'Feature Stores: Feast / Tecton',
                    'Data Drift & Model Monitoring',
                    'Containerizing ML Models (Docker)',
                    'CI/CD for ML Pipelines',
                ],
                resources: [
                    { label: 'MLOps Zoomcamp — DataTalks.Club (Free)', url: 'https://github.com/DataTalksClub/mlops-zoomcamp', type: 'docs' },
                    { label: 'FastAPI for ML Model Serving', url: 'https://www.youtube.com/watch?v=h5wLuVDr0oc', type: 'youtube' },
                    { label: 'Evidently AI — Model Monitoring', url: 'https://www.evidentlyai.com', type: 'docs' },
                    { label: 'Made With ML — MLOps Guide', url: 'https://madewithml.com', type: 'docs' },
                ],
            },
            {
                id: 'interview',
                title: 'Stage 5 — Interview Prep',
                icon: Trophy,
                topics: [
                    'ML System Design Interviews',
                    'Coding: ML Algorithm from Scratch',
                    'Deep Learning Concept Questions',
                    'MLOps Scenario Walkthroughs',
                    'Research Paper Discussions',
                    'Mock ML Engineer Interviews',
                ],
                resources: [
                    { label: 'ML System Design — Chip Huyen Book', url: 'https://huyenchip.com/machine-learning-systems-design/toc.html', type: 'docs' },
                    { label: 'ML Interview Questions — GitHub', url: 'https://github.com/andrewekhalel/MLQuestions', type: 'docs' },
                    { label: 'Papers With Code — Trending Research', url: 'https://paperswithcode.com', type: 'docs' },
                    { label: 'ML Interviews Book (Free PDF)', url: 'https://huyenchip.com/ml-interviews-book/', type: 'docs' },
                ],
            },
        ],
    },
};

const CARD_LIST = [
    ROADMAPS.frontend,
    ROADMAPS.backend,
    ROADMAPS.fullstack,
    ROADMAPS.datascientist,
    ROADMAPS.devops,
    ROADMAPS.mlengineer,
];

/* ─── Animation variants ──────────────────────────────────── */
const fadeIn = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.38, delay: i * 0.08, ease: 'easeOut' },
    }),
    exit: { opacity: 0, y: -12, transition: { duration: 0.18 } },
};

const accordionContent = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.28, ease: 'easeOut' } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
};

/* ─── Stage Accordion Item ────────────────────────────────── */
const StageItem = ({ stage, index, accent }) => {
    const [open, setOpen] = useState(index === 0);
    const [tab, setTab] = useState('topics');   // 'topics' | 'resources'
    const Icon = stage.icon;
    const hasResources = stage.resources && stage.resources.length > 0;

    return (
        <div
            className="rounded-2xl border transition-all duration-300"
            style={{
                background: open ? 'rgba(255,255,255,0.02)' : 'var(--color-surface)',
                borderColor: open ? `${accent}40` : 'var(--color-border-subtle)',
                boxShadow: open ? `0 0 24px ${accent}12` : 'none',
            }}
        >
            {/* Header */}
            <button
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
                aria-expanded={open}
                id={`stage-btn-${stage.id}-${index}`}
            >
                <div className="flex items-center gap-4">
                    <span
                        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                        style={{ background: open ? `${accent}20` : 'var(--color-surface-light)', border: `1px solid ${accent}30` }}
                    >
                        <Icon size={18} style={{ color: accent }} />
                    </span>
                    <span className="font-semibold text-white text-sm md:text-base">{stage.title}</span>
                </div>
                <ChevronDown
                    size={18}
                    className="flex-shrink-0 text-[var(--color-text-dim)] transition-transform duration-300"
                    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: open ? accent : undefined }}
                />
            </button>

            {/* Expandable content */}
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="content"
                        variants={accordionContent}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="overflow-hidden"
                    >
                        {/* Tab switcher */}
                        {hasResources && (
                            <div className="px-6 pt-0 pb-3 flex gap-2">
                                <button
                                    onClick={() => setTab('topics')}
                                    className="px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-200"
                                    style={{
                                        background: tab === 'topics' ? `${accent}20` : 'transparent',
                                        color: tab === 'topics' ? accent : 'var(--color-text-dim)',
                                        border: `1px solid ${tab === 'topics' ? `${accent}40` : 'transparent'}`,
                                    }}
                                >
                                    📋 Topics
                                </button>
                                <button
                                    onClick={() => setTab('resources')}
                                    className="px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-200"
                                    style={{
                                        background: tab === 'resources' ? `${accent}20` : 'transparent',
                                        color: tab === 'resources' ? accent : 'var(--color-text-dim)',
                                        border: `1px solid ${tab === 'resources' ? `${accent}40` : 'transparent'}`,
                                    }}
                                >
                                    🔗 Resources
                                </button>
                            </div>
                        )}

                        <div className="px-6 pb-6 pt-1">
                            {/* Topics panel */}
                            {tab === 'topics' && (
                                <ul className="grid sm:grid-cols-2 gap-2">
                                    {stage.topics.map((topic, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--color-text-muted)]">
                                            <CheckCircle2
                                                size={15}
                                                className="mt-0.5 flex-shrink-0"
                                                style={{ color: accent }}
                                            />
                                            {topic}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Resources panel */}
                            {tab === 'resources' && hasResources && (
                                <div className="flex flex-col gap-2">
                                    {stage.resources.map((res, i) => (
                                        <a
                                            key={i}
                                            href={res.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group/res"
                                            style={{
                                                background: 'var(--color-surface-light)',
                                                border: '1px solid var(--color-border-subtle)',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = `${accent}40`; e.currentTarget.style.background = `${accent}08`; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border-subtle)'; e.currentTarget.style.background = 'var(--color-surface-light)'; }}
                                        >
                                            {res.type === 'youtube' ? (
                                                <Youtube size={15} className="flex-shrink-0" style={{ color: '#FF0000' }} />
                                            ) : (
                                                <Globe size={15} className="flex-shrink-0" style={{ color: accent }} />
                                            )}
                                            <span className="text-sm text-[var(--color-text-muted)] group-hover/res:text-white transition-colors flex-1">
                                                {res.label}
                                            </span>
                                            <ExternalLink size={12} className="flex-shrink-0 text-[var(--color-text-dim)] group-hover/res:text-white transition-colors" />
                                        </a>
                                    ))}

                                    {/* Platform courses CTA */}
                                    <div
                                        className="mt-3 rounded-xl p-4 flex items-center justify-between gap-4"
                                        style={{ background: `${accent}0A`, border: `1px dashed ${accent}30` }}
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-white mb-0.5">Learn on EduNex</p>
                                            <p className="text-xs text-[var(--color-text-dim)]">Browse structured courses on this topic</p>
                                        </div>
                                        <Link
                                            to="/courses"
                                            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg transition-all duration-200"
                                            style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}30` }}
                                        >
                                            <GraduationCap size={13} />
                                            Browse Courses
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ─── Overview Cards ──────────────────────────────────────── */
const OverviewCard = ({ roadmap, onClick, index }) => {
    const Icon = roadmap.icon;
    return (
        <motion.div
            custom={index}
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onClick()}
            aria-label={`Open ${roadmap.label} roadmap`}
            className="glow-card group cursor-pointer flex flex-col relative overflow-hidden"
            style={{ outline: 'none' }}
        >
            {/* Glow orb */}
            <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${roadmap.accentColor}18, transparent)` }}
            />

            {/* Icon badge */}
            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105"
                style={{ background: roadmap.accentMuted, border: `1px solid ${roadmap.accentColor}30` }}
            >
                <Icon size={26} style={{ color: roadmap.accentColor }} />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{roadmap.label}</h3>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: roadmap.accentColor }}>
                {roadmap.tagline}
            </p>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed flex-1">
                {roadmap.description}
            </p>

            {/* Duration & phases badges */}
            <div className="mt-5 flex items-center gap-3">
                {roadmap.duration && (
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-text-muted)]">
                        <Clock size={12} style={{ color: roadmap.accentColor }} />
                        {roadmap.duration}
                    </span>
                )}
                {roadmap.phases && (
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-text-muted)]">
                        <Flag size={12} style={{ color: roadmap.accentColor }} />
                        {roadmap.phases} Phases
                    </span>
                )}
            </div>

            {/* Phases preview tags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
                {roadmap.stages.slice(0, 3).map((s, i) => (
                    <span
                        key={i}
                        className="text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wider"
                        style={{ background: roadmap.accentMuted, color: roadmap.accentColor, border: `1px solid ${roadmap.accentColor}25` }}
                    >
                        {s.title.split('—')[0].trim()}
                    </span>
                ))}
                <span
                    className="text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wider"
                    style={{ background: roadmap.accentMuted, color: roadmap.accentColor, border: `1px solid ${roadmap.accentColor}25` }}
                >
                    +{roadmap.stages.length - 3} more
                </span>
            </div>

            {/* CTA row */}
            <div
                className="mt-6 flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
                style={{ color: roadmap.accentColor }}
            >
                <Map size={14} />
                <span>View Full Roadmap</span>
            </div>
        </motion.div>
    );
};

/* ─── Detailed Roadmap View ───────────────────────────────── */
const RoadmapDetail = ({ roadmap, onBack }) => {
    const Icon = roadmap.icon;
    return (
        <motion.div
            key={roadmap.id}
            variants={fadeIn}
            custom={0}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {/* Back button */}
            <button
                onClick={onBack}
                id="roadmap-back-btn"
                className="btn btn-ghost mb-8 flex items-center gap-2 text-sm"
            >
                <ChevronLeft size={16} />
                Back to Roadmaps
            </button>

            {/* Header */}
            <div
                className="rounded-2xl p-8 mb-8 relative overflow-hidden"
                style={{ background: roadmap.accentMuted, border: `1px solid ${roadmap.accentColor}30` }}
            >
                <div
                    className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${roadmap.accentColor}10, transparent)` }}
                />
                <div className="flex items-start gap-5 relative z-10">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${roadmap.accentColor}20`, border: `1px solid ${roadmap.accentColor}40` }}
                    >
                        <Icon size={30} style={{ color: roadmap.accentColor }} />
                    </div>
                    <div>
                        <span
                            className="section-label inline-flex mb-3"
                            style={{ color: roadmap.accentColor, borderColor: `${roadmap.accentColor}30`, background: `${roadmap.accentColor}12` }}
                        >
                            <Map size={12} /> Learning Roadmap
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{roadmap.label}</h2>
                        <p className="text-[var(--color-text-muted)] max-w-xl">{roadmap.description}</p>
                    </div>
                </div>
            </div>

            {/* Stages */}
            <div className="flex flex-col gap-3">
                {roadmap.stages.map((stage, i) => (
                    <StageItem
                        key={stage.id}
                        stage={stage}
                        index={i}
                        accent={roadmap.accentColor}
                    />
                ))}
            </div>
        </motion.div>
    );
};

/* ─── Main Export ─────────────────────────────────────────── */
const RoadmapSection = () => {
    const [selectedRoadmap, setSelectedRoadmap] = useState(null);

    const handleSelect = useCallback(id => {
        setSelectedRoadmap(id);
        // Smooth scroll to section top
        setTimeout(() => {
            document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }, []);

    const handleBack = useCallback(() => setSelectedRoadmap(null), []);

    const activeRoadmap = selectedRoadmap ? ROADMAPS[selectedRoadmap] : null;

    return (
        <section id="roadmap" className="py-28 px-6 relative">
            {/* Background accent */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,255,0,0.04)_0%,transparent_60%)] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section header — always visible */}
                <div className="text-center mb-14">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex justify-center mb-5"
                    >
                        <span className="section-label">
                            <Sparkles size={13} /> Career Roadmaps
                        </span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                    >
                        Structured Learning <br />
                        <span className="text-gradient">Paths to Your Dream Role</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-[var(--color-text-muted)] text-lg max-w-2xl mx-auto"
                    >
                        Click any role below to explore a stage-by-stage learning roadmap — from zero to interview-ready.
                    </motion.p>
                </div>

                {/* Dynamic content */}
                <AnimatePresence mode="wait">
                    {!activeRoadmap ? (
                        /* Overview: 3 cards */
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -12, transition: { duration: 0.18 } }}
                            className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
                        >
                            {CARD_LIST.map((roadmap, i) => (
                                <OverviewCard
                                    key={roadmap.id}
                                    roadmap={roadmap}
                                    index={i}
                                    onClick={() => handleSelect(roadmap.id)}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        /* Detail: expanded stages */
                        <RoadmapDetail
                            key={activeRoadmap.id}
                            roadmap={activeRoadmap}
                            onBack={handleBack}
                        />
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default RoadmapSection;
