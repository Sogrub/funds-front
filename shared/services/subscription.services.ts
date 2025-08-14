import { GenericResponse } from "@shared/interfaces/generic.interfaces";
import { Subscription } from "@shared/interfaces/subscriptions.interfaces";
import { httpAdapter } from "@shared/utils/http-adapter.util";

export const getSubscriptions = async (userId: number, fundId: number) => {
    return await httpAdapter<GenericResponse<Subscription[]>>({
        url: "subscriptions",
        method: "GET",
        params: {
            user_id: String(userId),
            fund_id: String(fundId),
        },
    });
}

export const createSubscription = async (userId: number, fundId: number, amount: number) => {
    return await httpAdapter<GenericResponse<Subscription>>({
        url: "subscriptions",
        method: "POST",
        data: {
            user_id: userId,
            fund_id: fundId,
            amount: amount,
        },
    });
}

export const editSubscription = async (subscriptionId: number, type: "ACTIVE" | "CANCELLED", amount?: number) => {
    const params = amount ? { type, amount: String(amount) } : { type };
    return await httpAdapter<GenericResponse<Subscription>>({
        url: `subscriptions/${subscriptionId}`,
        method: "PATCH",
        params: Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined)
        ),
    });
}