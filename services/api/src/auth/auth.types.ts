import { UserRole } from "../common/enums";

export interface AuthenticatedUser { id: string; role: UserRole; email?: string; }
