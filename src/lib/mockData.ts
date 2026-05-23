import { Project, Publication, ResearchLine, User } from "../types";

export const mockUsers: User[] = [
  {
    id: "u1",
    firstName: "Elena",
    lastName: "Ramírez",
    email: "elena.ramirez@university.edu",
    isDoctor: true,
    institution: "Universidad Politécnica",
    role: "ADMIN",
    researchLines: ["rl1", "rl2"],
    avatarUrl: "https://i.pravatar.cc/150?u=u1"
  },
  {
    id: "u2",
    firstName: "Carlos",
    lastName: "Mendoza",
    email: "carlos.mendoza@university.edu",
    isDoctor: true,
    institution: "Universidad Politécnica",
    role: "INVESTIGATOR",
    researchLines: ["rl1"],
    avatarUrl: "https://i.pravatar.cc/150?u=u2"
  },
  {
    id: "u3",
    firstName: "Ana",
    lastName: "García",
    email: "ana.garcia@university.edu",
    isDoctor: false,
    institution: "Universidad Politécnica",
    role: "INVESTIGATOR",
    researchLines: ["rl3"],
    avatarUrl: "https://i.pravatar.cc/150?u=u3"
  }
];

export const mockResearchLines: ResearchLine[] = [
  {
    id: "rl1",
    name: "Inteligencia Artificial Aplicada",
    description: "Desarrollo de modelos de Deep Learning para resolver problemas complejos en la industria y la salud.",
    keywords: ["Machine Learning", "Deep Learning", "Salud", "Industria 4.0"]
  },
  {
    id: "rl2",
    name: "Ciberseguridad y Redes",
    description: "Investigación en protocolos seguros, criptografía cuántica y análisis de vulnerabilidades.",
    keywords: ["Seguridad", "Redes", "Criptografía", "IoT"]
  },
  {
    id: "rl3",
    name: "Sistemas Distribuidos",
    description: "Diseño y evaluación de arquitecturas de sistemas distribuidos y computación en la nube.",
    keywords: ["Cloud", "Sistemas Distribuidos", "Arquitectura", "Escalabilidad"]
  }
];

export const mockProjects: Project[] = [
  {
    id: "p1",
    title: "AI-MED: Diagnóstico Temprano mediante IA",
    summary: "Proyecto centrado en el uso de redes neuronales convolucionales para la detección temprana de anomalías en radiografías.",
    fundingEntity: "Ministerio de Ciencia e Innovación",
    startDate: "2024-01-15",
    endDate: "2027-01-14",
    status: "ACTIVE",
    budget: 150000,
    members: [
      { userId: "u1", role: "INVESTIGADOR_PRINCIPAL" },
      { userId: "u2", role: "EQUIPO_INVESTIGACION" },
      { userId: "u3", role: "EQUIPO_TRABAJO" }
    ]
  },
  {
    id: "p2",
    title: "SecNet: Seguridad en IoT para Smart Cities",
    summary: "Desarrollo de un framework ligero de seguridad para dispositivos IoT desplegados en entornos urbanos.",
    fundingEntity: "Unión Europea - Horizonte 2020",
    startDate: "2023-06-01",
    endDate: "2025-05-31",
    status: "ACTIVE",
    budget: 320000,
    members: [
      { userId: "u2", role: "INVESTIGADOR_PRINCIPAL" },
      { userId: "u1", role: "EQUIPO_INVESTIGACION" }
    ]
  },
  {
    id: "p3",
    title: "QuantumCrypt: Algoritmos Post-Cuánticos",
    summary: "Investigación de nuevos estándares criptográficos resistentes a ataques con computación cuántica.",
    fundingEntity: "Agencia Estatal de Investigación",
    startDate: "2025-09-01",
    endDate: "2028-08-31",
    status: "PENDING_APPROVAL",
    budget: 200000,
    members: [
      { userId: "u1", role: "INVESTIGADOR_PRINCIPAL" }
    ]
  }
];

export const mockPublications: Publication[] = [
  {
    id: "pub1",
    title: "Deep Learning Approaches for Early Detection of Lung Cancer in X-Ray Scans",
    authors: ["Elena Ramírez", "Carlos Mendoza"],
    doi: "10.1016/j.artmed.2024.102345",
    status: "PUBLISHED",
    submitDate: "2024-03-10",
    projectId: "p1"
  },
  {
    id: "pub2",
    title: "Lightweight Authentication Protocol for Resource-Constrained IoT Devices",
    authors: ["Carlos Mendoza", "Elena Ramírez", "Ana García"],
    doi: "10.1109/TIFS.2024.3141592",
    status: "PUBLISHED",
    submitDate: "2024-05-22",
    projectId: "p2"
  },
  {
    id: "pub3",
    title: "Analysis of Post-Quantum Cryptographic Schemes on Edge Devices",
    authors: ["Elena Ramírez"],
    status: "SUBMITTED",
    submitDate: "2026-02-15",
    projectId: "p3"
  }
];
