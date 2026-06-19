import { ExperienceData } from "@/types/experience";

export const experienceData: ExperienceData = {
  sectionTitle: "Career History",
  experiences: [
    {
      period: "2019 - 2024",
      title: "ORT - University",
      description: "My education has been a journey into understanding how programs are created and how they can transform ideas into something almost tangible. What fascinates me most is how something purely virtual can shape the real world. I began this path, like many classic kids, inspired by video games, curious about how entire worlds could be built. From simple Windows Forms applications to dynamic web platforms and graphic engines capable of rendering interactive environments with their own physics. Along the way, I didn’t just learn the foundations of processors, programs, transpilers, and binary code. I also learned how to work effectively in teams, the importance of clear communication, and how to build with intent. I developed a strong focus on modularity and scalability, understanding that good software is not just about making things work, but about making them grow and evolve over time."
},
    {
      period: "2021 - 2024",
      title: "Software Engineer FullStack Developer | Infocorp",
      description: "I worked within a collaborative team environment managing the end-to-end lifecycle of banking systems for the Virgin Islands, Guyana, and Trinidad & Tobago. My role required high adaptability, frequently rotating into other teams to resolve bottlenecks and managing the technical onboarding for new engineers to maintain our development standards. I handled the complete workflow from Azure DevOps tasking to production 'liberations,' coordinating closely with QA to ensure successful verifications. This position demanded strict prioritization of production-level issues, often requiring me to perform sensitive operations on complex production databases and AWS environments where system integrity was critical. From optimizing SQL indexes to developing in .NET and React, I balanced technical precision with the high-pressure demands of live international banking infrastructure."
},    
    {
      period: "2025 - 2026",
      title: "IT Infrastructure Technician | Department of Education and Youth",
      description: `Relocating to Dublin, Ireland, presented a valuable opportunity to immerse myself in an English speaking professional environment while directly applying the foundational hardware concepts I studied in university. I got to be incredibly hands on with our hardware and network from day one. I took charge of the entire hardware lifecycle, which included sourcing the equipment, building the workstations, and keeping our local servers running smoothly so the team had secure, reliable access to their work.\n\nWhenever a computer started dragging, I was the go to person to get it back up to speed. I tackled this through targeted upgrades, getting inside the case to add more RAM, swap in faster storage, or install dedicated GPUs to give aging hardware a serious performance boost. Beyond traditional IT, I also had the chance to help the team deploy a custom, fine tuned AI model for the department. We integrated it as a local server that I helped build, where the model ran to assist all employees with department specific questions.`
}
,
    {
      period: "2024 - 2026",
      title: "Personal Project | Morpheus: AI Audio Annotation Framework",
      description: `Morpheus is a real-time audio intelligence platform designed to bridge the gap between raw acoustic signals and actionable business automation.\n\nBuilt on an event-driven WebSockets architecture, the system continuously ingests audio chunks through a non-blocking evaluation loop. It extracts high-dimensional acoustic embeddings on the fly and uses Dynamic Time Warping to match intents instantly. Because the pipeline evaluates speech progressively, it can trigger complex actions with near-zero latency. In many cases, it executes commands before you even finish speaking to create digital interactions that feel completely natural and fluid.`
},
  ],
  techStackTitle: "Core Stack",
  techStack: [
    // Core Languages
    "TypeScript", "Python", "Java", "C#", 
    
    // Systems & Low-Level
    "C", "C++", "Assembly",
    
    // Frontend
    "React", "Next.js", "Tailwind CSS", "Vite", 
    
    // Backend & Architecture
    "Node.js", "FastAPI", "Spring Boot", ".NET Core", 
    "WebSockets", "Event-Driven Architecture",
    
    // Databases & Data Engineering
    "PostgreSQL", "SQL Server", "SQLAlchemy", 
    "ETL Pipelines", "Data Warehousing", 
    
    // Infrastructure
    "Docker", "AWS", "Git",
    
    // Data Science & Signal Processing
    "Pandas", "NumPy", "Audio Signal Processing", 
    
    // AI & Machine Learning
    "PyTorch", "TensorFlow", "Hugging Face", "Speech Recognition (ASR)"
]
};
