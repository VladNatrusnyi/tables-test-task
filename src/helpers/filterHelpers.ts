import {FilterData} from "../Models/Filter";

export  const hasFilledField = (data: FilterData): boolean =>  {
    return Object.values(data).some(field => field.trim() !== '');
}

export const generateQueryString = (obj: FilterData): string => {
    return Object.entries(obj)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
}
