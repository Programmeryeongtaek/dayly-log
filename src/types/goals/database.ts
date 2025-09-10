import { Category } from "../budget";

export interface Goal {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  type: "save_money" | "reduce_expense" | "increase_income" | "custom";
  target_amount: number | null;
  current_amount: number;
  target_count: number | null;
  current_count: number;
  target_date: string | null;
  status: "active" | "completed" | "paused" | "cancelled";
  created_from_date: string;
  reason: string | null;
  challenge_mode: "amount" | "count" | "both";
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface GoalFormData {
  title: string;
  description?: string | null;
  reason?: string | null;
  type: "save_money" | "reduce_expense" | "increase_income" | "custom";
  target_amount?: number | null;
  target_count?: number | null;
  target_date?: string | null;
  challenge_mode: "amount" | "count" | "both";
  category_id?: string | null;
}
