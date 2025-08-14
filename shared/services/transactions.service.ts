import { GenericResponse } from "@shared/interfaces/generic.interfaces";
import { Transaction } from "@shared/interfaces/transactions.interfaces";
import { httpAdapter } from "@shared/utils/http-adapter.util";

export const getTransactions = async (userId: number, fundId: number) => {
    return await httpAdapter<GenericResponse<Transaction[]>>({
        url: "transactions",
        method: "GET",
        params: {
            user_id: String(userId),
            fund_id: String(fundId),
        },
    });
}