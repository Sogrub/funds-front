export interface Transaction {
    id: number;
    user_id: number;
    fund_id: number;
    type: "ACTIVE" | "CANCELLED";
    amount: number;
    date: string;
}