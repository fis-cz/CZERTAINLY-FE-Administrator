import { AuditLogOperation, AuditLogOperationStatus, AuditLogSourceTarget } from "types/auditlog";

export interface AuditLogModel {
   id: number;
   author: string;
   created: Date;
   operationStatus: AuditLogOperationStatus;
   origination: AuditLogSourceTarget;
   affected: AuditLogSourceTarget;
   objectIdentifier: string;
   operation: AuditLogOperation;
   additionalData: any;
}
