export interface AnalyticsData {
  date: string;
  visitors: number;
  pageViews: number;
  uniqueVisitors: number;
}

export interface TrackVisitorRequest {
  page?: string;
  source?: "direct" | "search" | "referral" | "social" | "email";
}

export type AnalyticsPeriod = "7" | "30" | "90";
