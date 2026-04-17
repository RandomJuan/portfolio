import { ContactData } from "@/types/contact";

export const contactData: ContactData = {
  title: "Let's build something.",
  description: "Feel free to reach out for collaborations or just a friendly hello.",
  buttonText: "Get in Touch",
  buttonEmail: "hello@example.com",
  copyright: `© ${new Date().getFullYear()} Juan Müller. All rights reserved.`,
  socials: [
    { name: "GitHub", url: "#" },
    { name: "LinkedIn", url: "#" },
    { name: "Twitter", url: "#" }
  ]
};
