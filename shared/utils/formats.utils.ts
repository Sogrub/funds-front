import dayjs from "dayjs";

export const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
}

export const formatDate = (value: string) => {
    return dayjs(value).format("DD/MM/YYYY");
}

export const formatDateWithTime = (value: string) => {
    return dayjs(value).format("DD/MM/YYYY HH:mm");
}