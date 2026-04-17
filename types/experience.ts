export type ExperienceItem = {
  period: string;
  title: string;
  description: string;
};

export type ExperienceData = {
  sectionTitle: string;
  experiences: ExperienceItem[];
  techStackTitle: string;
  techStack: string[];
};
