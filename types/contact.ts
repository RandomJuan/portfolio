export type SocialLink = {
  name: string;
  url: string;
};

export type ContactData = {
  title: string;
  description: string;
  buttonText: string;
  buttonEmail: string;
  copyright: string;
  socials: SocialLink[];
};
