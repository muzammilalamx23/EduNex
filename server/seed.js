require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');
const { processLessons } = require('./utils/courseHelpers');

const backendCoursesData = [
  {
    title: "Node.js Masterclass",
    description: "Master the fundamentals of Node.js, understand the event loop, file system, and core modules to build fast and scalable network applications.",
    difficulty: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    tags: ["node", "javascript", "backend", "v8", "event-loop"],
    url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4"
  },
  {
    title: "Express.js Fundamentals",
    description: "Learn the most popular Node.js web framework. Build robust routing, handle middleware, and manage HTTP requests and responses effectively.",
    difficulty: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    tags: ["express", "routing", "middleware", "api"],
    url: "https://www.youtube.com/watch?v=L72fhGm1tfE"
  },
  {
    title: "MongoDB & Mongoose Bootcamp",
    description: "Dive deep into NoSQL databases. Learn document modeling, aggregation pipelines, and robust schema validation using Mongoose.",
    difficulty: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    tags: ["mongodb", "mongoose", "nosql", "database"],
    url: "https://www.youtube.com/watch?v=-56x56UppqQ"
  },
  {
    title: "Secure JWT Authentication",
    description: "Implement enterprise-grade security. Learn password hashing, JWT generation, HttpOnly cookies, and role-based access control.",
    difficulty: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1510511459019-5efa3cb4ae41?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    tags: ["jwt", "auth", "security", "bcrypt", "cookies"],
    url: "https://www.youtube.com/watch?v=mbsmsi7l3r4"
  },
  {
    title: "Advanced REST APIs",
    description: "Go beyond basic CRUD. Master pagination, filtering, sorting, field limiting, and API versioning for production-ready RESTful services.",
    difficulty: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    tags: ["rest", "api", "pagination", "filtering", "architecture"],
    url: "https://www.youtube.com/watch?v=pKd0Rpw7O48"
  },
  {
    title: "GraphQL Zero to Hero",
    description: "Stop over-fetching data. Learn schemas, queries, mutations, resolvers, and Apollo Server to build efficient data graphs.",
    difficulty: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    tags: ["graphql", "apollo", "api", "resolvers"],
    url: "https://www.youtube.com/watch?v=ed8SzALpx1Q"
  },
  {
    title: "Redis Caching Strategies",
    description: "Supercharge your backend performance. Learn in-memory data structures, cache invalidation, session stores, and pub/sub.",
    difficulty: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    tags: ["redis", "caching", "performance", "pubsub"],
    url: "https://www.youtube.com/watch?v=jgpVdJB2sKQ"
  },
  {
    title: "Docker for Backend Developers",
    description: "Containerize your applications. Write Dockerfiles, manage multi-container apps with Docker Compose, and prepare for CI/CD.",
    difficulty: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    tags: ["docker", "containers", "devops", "compose"],
    url: "https://www.youtube.com/watch?v=gAkwW2tuIqE"
  },
  {
    title: "WebSockets & Real-Time",
    description: "Build bidirectional, event-driven applications. Master Socket.io, rooms, namespaces, and broadcasting for chat and live updates.",
    difficulty: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1516382799247-87df95d790b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    tags: ["websockets", "socket.io", "realtime", "events"],
    url: "https://www.youtube.com/watch?v=ZKEqqIO7n-k"
  },
  {
    title: "Microservices Architecture",
    description: "Break down the monolith. Learn to design, communicate, and deploy distributed microservices using event buses and API gateways.",
    difficulty: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    tags: ["microservices", "architecture", "rabbitmq", "gateway"],
    url: "https://www.youtube.com/watch?v=rv4LljiEQRU"
  },
  {
    title: "System Design Basics",
    description: "Prepare for elite engineering interviews. Master load balancing, horizontal scaling, database sharding, and CDN strategies.",
    difficulty: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    tags: ["system-design", "scaling", "architecture", "interview"],
    url: "https://www.youtube.com/watch?v=bUHFg8Cj5sn"
  },
  {
    title: "PostgreSQL & Prisma ORM",
    description: "Master relational databases in the modern era. Learn SQL fundamentals, migrations, and type-safe database access with Prisma.",
    difficulty: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    tags: ["postgresql", "prisma", "sql", "orm"],
    url: "https://www.youtube.com/watch?v=RebA5J-rlwg"
  },
  {
    title: "TypeScript for Backend",
    description: "Catch errors at compile-time. Add strict typing to Node.js applications, configure tsconfig, and define interfaces for your APIs.",
    difficulty: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    tags: ["typescript", "nodejs", "types", "compiler"],
    url: "https://www.youtube.com/watch?v=BCg4U1FzODs"
  },
  {
    title: "Next-Level NestJS",
    description: "Build enterprise-grade applications with Angular-inspired architecture. Master modules, controllers, providers, and dependency injection.",
    difficulty: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    tags: ["nestjs", "typescript", "architecture", "enterprise"],
    url: "https://www.youtube.com/watch?v=GHTA143_b-s"
  },
  {
    title: "Background Jobs with BullMQ",
    description: "Offload heavy tasks to background workers. Learn message queues, delayed jobs, retries, and Redis integration using BullMQ.",
    difficulty: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    tags: ["queue", "bullmq", "redis", "background-jobs", "workers"],
    url: "https://www.youtube.com/watch?v=1xN5-7U0tAE"
  },
  {
    title: "AWS Deployment & Serverless",
    description: "Take your backend to the cloud. Learn to deploy Node.js applications using EC2, S3, RDS, and build serverless architectures with AWS Lambda and API Gateway.",
    difficulty: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    tags: ["aws", "cloud", "serverless", "lambda", "ec2"],
    url: "https://www.youtube.com/watch?v=3hLmDS179YE"
  },
  {
    title: "CI/CD Pipelines for Backend",
    description: "Automate your workflows. Master continuous integration and deployment using GitHub Actions to automatically test, build, and deploy your code.",
    difficulty: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    tags: ["ci-cd", "github-actions", "automation", "devops"],
    url: "https://www.youtube.com/watch?v=R8_veQiYBjI"
  },
  {
    title: "Backend Security & Rate Limiting",
    description: "Harden your servers against attacks. Learn to implement rate limiting, prevent SQL/NoSQL injections, mitigate CSRF/XSS, and use Helmet.",
    difficulty: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    tags: ["security", "rate-limiting", "helmet", "owasp", "hacking"],
    url: "https://www.youtube.com/watch?v=bENcgkE_I_0"
  },
  {
    title: "Apache Kafka Basics",
    description: "Handle massive data streams. Learn distributed event streaming, topics, partitions, producers, and consumers to build resilient architectures.",
    difficulty: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    tags: ["kafka", "event-streaming", "data-engineering", "microservices"],
    url: "https://www.youtube.com/watch?v=JalUUBKdcA0"
  }
];

const dsCoursesData = [
  {
    title: "Python for Data Science",
    description: "Master Python programming with a focus on data structures, algorithms, and libraries essential for data analysis.",
    difficulty: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=60",
    tags: ["python", "data-science", "programming"],
    url: "https://www.youtube.com/watch?v=rfscVS0vtbw"
  },
  {
    title: "Statistics & Probability",
    description: "Learn the mathematical foundations required for data science, including distributions, hypothesis testing, and Bayesian logic.",
    difficulty: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=60",
    tags: ["math", "statistics", "probability"],
    url: "https://www.youtube.com/watch?v=xxpc-HPKN28"
  },
  {
    title: "Data Analysis with Pandas",
    description: "Clean, manipulate, and analyze large datasets using Pandas and NumPy in Python.",
    difficulty: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=60",
    tags: ["pandas", "numpy", "data-analysis"],
    url: "https://www.youtube.com/watch?v=vmEHCJofslg"
  },
  {
    title: "Data Visualization with Matplotlib",
    description: "Create stunning, interactive, and informative data visualizations using Matplotlib and Seaborn.",
    difficulty: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=60",
    tags: ["visualization", "matplotlib", "seaborn"],
    url: "https://www.youtube.com/watch?v=UO98lJQ3QGI"
  },
  {
    title: "Machine Learning Basics",
    description: "Learn supervised and unsupervised learning algorithms using Scikit-Learn. Build regression and classification models.",
    difficulty: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=60",
    tags: ["machine-learning", "scikit-learn", "ai"],
    url: "https://www.youtube.com/watch?v=7eh4d6sabA0"
  }
];

const mlCoursesData = [
  {
    title: "Deep Learning with PyTorch",
    description: "Build deep neural networks. Learn tensors, backpropagation, and how to train models using PyTorch.",
    difficulty: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=60",
    tags: ["deep-learning", "pytorch", "neural-networks"],
    url: "https://www.youtube.com/watch?v=V_xro1bcAuA"
  },
  {
    title: "Natural Language Processing (NLP)",
    description: "Process and analyze human language data. Learn transformers, LLMs, and sentiment analysis.",
    difficulty: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=60",
    tags: ["nlp", "transformers", "llm"],
    url: "https://www.youtube.com/watch?v=xvqsFTUsOmc"
  },
  {
    title: "Computer Vision Fundamentals",
    description: "Teach machines to see. Master image classification, object detection, and CNNs using OpenCV and PyTorch.",
    difficulty: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=60",
    tags: ["computer-vision", "cnn", "opencv"],
    url: "https://www.youtube.com/watch?v=OcycT1mfcMI"
  },
  {
    title: "MLOps & Model Deployment",
    description: "Take your models from notebook to production. Learn model registry, tracking, and scalable serving.",
    difficulty: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=60",
    tags: ["mlops", "deployment", "production"],
    url: "https://www.youtube.com/watch?v=8qJ1zI-G6-E"
  }
];

const devopsExtraData = [
  {
    title: "Kubernetes Orchestration",
    description: "Manage containerized applications across clusters. Master pods, services, deployments, and ingress.",
    difficulty: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=60",
    tags: ["kubernetes", "orchestration", "devops"],
    url: "https://www.youtube.com/watch?v=X48VuDVv0do"
  },
  {
    title: "Infrastructure as Code (Terraform)",
    description: "Provision and manage any cloud, infrastructure, or service using HashiCorp Terraform.",
    difficulty: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=60",
    tags: ["terraform", "iac", "devops"],
    url: "https://www.youtube.com/watch?v=l5k1ai_GBDE"
  }
];

const mapCourseData = (data) => data.map(c => ({
    title: c.title,
    difficulty: c.difficulty,
    category: "Development",
    thumbnail: c.thumbnail,
    description: c.description,
    tags: c.tags,
    lessons: [
        { title: "Introduction", type: "heading" },
        {
            title: c.title + " Full Course",
            section: "Videos",
            type: "video",
            videoUrl: c.url,
            duration: 60
        }
    ]
}));

const backendCourses = mapCourseData(backendCoursesData);
const dsCourses = mapCourseData(dsCoursesData);
const mlCourses = mapCourseData(mlCoursesData);
const devopsExtraCourses = mapCourseData(devopsExtraData);

const courses = [
    {
        title: "Frontend Foundations: HTML & CSS",
        difficulty: "Beginner",
        category: "Development",
        thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop",
        description: "Master the building blocks of the web. Learn semantic HTML, CSS layouts, and responsive design.",
        lessons: [
            { title: "Phase 1: HTML Mastery", type: "heading" },
            {
                title: "Introduction to Web Architecture",
                section: "HTML Topics",
                type: "reading",
                content: "Learn how the internet works, the role of browsers, and how HTML serves as the skeleton of every webpage.",
                duration: 5
            },
            {
                title: "HTML Full Course for Beginners",
                section: "HTML Videos",
                type: "video",
                videoUrl: "https://www.youtube.com/watch?v=kUMe1FH4CHE",
                duration: 60
            },
            { title: "Phase 2: CSS Foundations", type: "heading" },
            {
                title: "CSS Full Course",
                section: "CSS Videos",
                type: "video",
                videoUrl: "https://www.youtube.com/watch?v=yfoY53QXEnI",
                duration: 90
            },
            {
                title: "Flexbox and Grid Masterclass",
                section: "CSS Videos",
                type: "video",
                videoUrl: "https://www.youtube.com/watch?v=3YW65K6LcIA",
                duration: 45
            }
        ]
    },
    {
        title: "Modern JavaScript Essentials",
        difficulty: "Beginner",
        category: "Development",
        thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=60",
        description: "Learn the programming language that powers the internet. From basics to ES6+ features.",
        lessons: [
            { title: "JavaScript for Beginners", section: "Basics", type: "video", videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk", duration: 60 },
            { title: "Variables and Constants", section: "Basics", type: "video", videoUrl: "https://www.youtube.com/watch?v=edWbHp_k_9Y", duration: 10 },
            { title: "Data Types & Operators", section: "Basics", type: "video", videoUrl: "https://www.youtube.com/watch?v=nOatPJCn0Ic", duration: 15 },
            { title: "Functions & Scope", section: "Advanced", type: "video", videoUrl: "https://www.youtube.com/watch?v=N8ap4k_1QEQ", duration: 25 }
        ]
    },
    {
        title: "React.js Mastery: Zero to Hero",
        difficulty: "Intermediate",
        category: "Development",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
        description: "Build modern, fast web applications with React. Learn JSX, State, Props, Hooks, and API integration.",
        lessons: [
            { title: "Phase 1: React Fundamentals", type: "heading" },
            { title: "The React Mindset", section: "Fundamentals", type: "video", videoUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8", duration: 15 },
            { title: "JSX Essentials", section: "Fundamentals", type: "video", videoUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8", duration: 25 },
            { title: "Props & Reusable Components", section: "Fundamentals", type: "video", videoUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8", duration: 20 },
            { title: "Phase 2: Hooks & Logic", type: "heading" },
            { title: "useState: Managing Component State", section: "Hooks & Logic", type: "video", videoUrl: "https://www.youtube.com/watch?v=4YO7zZ6vVTA", duration: 20 },
            { title: "useEffect: Handling Side Effects", section: "Hooks & Logic", type: "video", videoUrl: "https://www.youtube.com/watch?v=0ZJgIjIuY7U", duration: 30 },
            { title: "Conditional Rendering & Logic", section: "Hooks & Logic", type: "video", videoUrl: "https://www.youtube.com/watch?v=7o5FPaVAadM", duration: 15 },
            { title: "Phase 3: Building a Real-World Project", type: "heading" },
            { title: "Project: Build a Task Management App", section: "Project", type: "video", videoUrl: "https://www.youtube.com/watch?v=00H208vR_hI", duration: 45 },
            { title: "Project: Fetching Data from an API", section: "Project", type: "video", videoUrl: "https://www.youtube.com/watch?v=RGKi6LSPDLU", duration: 25 }
        ]
    },
    ...backendCourses,
    ...dsCourses,
    ...mlCourses,
    ...devopsExtraCourses
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        await Course.deleteMany({});
        console.log('Cleared existing courses');
        
        // Find an admin user to assign as the creator
        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.error('Error: No admin user found in DB. Please create an admin user first.');
            process.exit(1);
        }

        const coursesWithMetaData = courses.map(c => ({
            ...c,
            lessons: processLessons(c.lessons), // Extract video IDs
            createdBy: adminUser._id,
            status: 'published'
        }));

        await Course.insertMany(coursesWithMetaData);
        console.log(`Added ${coursesWithMetaData.length} seed courses`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
