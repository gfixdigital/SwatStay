import type { ProviderApprovalStatus } from "../types/admin";
import { StatusBadge } from "./StatusBadge";

export function ProviderStatusBadge({ status }: { status: ProviderApprovalStatus }) { return <StatusBadge status={status}/>; }
