export type Role = "VISITOR" | "INVESTIGATOR" | "ADMIN";
export type ProjectRole = "INVESTIGADOR_PRINCIPAL" | "EQUIPO_INVESTIGACION" | "EQUIPO_TRABAJO";
export type ProjectStatus = "DRAFT" | "PENDING_APPROVAL" | "ACTIVE" | "COMPLETED" | "REJECTED";
export type PublicationStatus = "DRAFT" | "SUBMITTED" | "ACCEPTED" | "REJECTED" | "PUBLISHED";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isDoctor: boolean;
  institution: string;
  role: Role;
  researchLines: string[]; // IDs of research lines
  avatarUrl?: string;
}

export interface ResearchLine {
  id: string;
  name: string;
  description: string;
  keywords: string[];
}

export interface ProjectMember {
  userId: string;
  role: ProjectRole;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  fundingEntity: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  members: ProjectMember[];
  budget?: number;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  doi?: string;
  pdfUrl?: string;
  status: PublicationStatus;
  submitDate?: string;
  projectId?: string;
}
