import type { TeamMember } from "../types/admin";

export const teamMembers: (TeamMember & { email: string; assignedModule: string; status: "Active" | "Invited" })[] = [
  { id: "tm-1", name: "Adnan", email: "adnan@gfix.pk", role: "Admin", assignedModule: "Architecture", activeQueue: 1, status: "Active" },
  { id: "tm-2", name: "Ahmed", email: "ahmed@gfix.pk", role: "Operations", assignedModule: "Providers", activeQueue: 2, status: "Active" },
  { id: "tm-3", name: "Asim", email: "asim@gfix.pk", role: "Operations", assignedModule: "Admin operations", activeQueue: 1, status: "Active" },
  { id: "tm-4", name: "Sana", email: "sana@gfix.pk", role: "Support", assignedModule: "Tourist support", activeQueue: 2, status: "Active" },
  { id: "tm-5", name: "Samreen", email: "samreen@gfix.pk", role: "QA", assignedModule: "Frontend QA", activeQueue: 0, status: "Invited" },
  { id: "tm-6", name: "Wohaib", email: "wohaib@gfix.pk", role: "QA", assignedModule: "Workflow QA", activeQueue: 0, status: "Invited" },
];
