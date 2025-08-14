export interface Subscription {
    id: number;
    user_id: number;
    fund_id: number;
    amount: number;
    type: string;
    subscription_date: string;
    cancellation_date: string;
}