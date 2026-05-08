export interface CreateBatchDto {
  name?: string;
  subject: string;
  recipients: string[];
}
 
export interface BatchStatsResult {
  id: string;
  name: string | null;
  totalSent: number;
  totalOpens: number;
  uniqueOpens: number;
}
 
