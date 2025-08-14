import { GenericResponse } from "@shared/interfaces/generic.interfaces";
import { User } from "@shared/interfaces/users.interfaces";
import { httpAdapter } from "@shared/utils/http-adapter.util";

export const getUsers = async () => {
    return await httpAdapter<GenericResponse<User[]>>({
        url: "users",
        method: "GET",
    });
}