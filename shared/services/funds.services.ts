import { Fund } from "@shared/interfaces/funds.interfaces";
import { GenericResponse } from "@shared/interfaces/generic.interfaces";
import { httpAdapter } from "@shared/utils/http-adapter.util";

export const getFunds = async () => {
    return await httpAdapter<GenericResponse<Fund[]>>({
        url: "funds",
        method: "GET",
    });
}