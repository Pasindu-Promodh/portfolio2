import data from "./projects.json";
import categoryList from "./categories.json";

export type Project = {
  id: number;
  name: string;
  description: string;
  longDescription: string;
  image: string;
  images?: string[];
  videos?: string[];
  techStack: string[];
  status: string;
  category: string;
  features?: string[];
  preview?: string;
  github?: string;
};

export const projects: Project[] = data;
export const categories: string[] = categoryList;
export const ALL_PROJECTS = categories[0];

// Media in public/ is stored as a relative path and served from this site.
export function mediaUrl(src: string) {
  return /^https?:\/\//.test(src) ? src : import.meta.env.BASE_URL + src;
}
