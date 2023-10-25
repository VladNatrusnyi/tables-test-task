export const convertDateToYYYYMMDD = (inputDate: string): string => {
    try {
        const [day, month, year] = inputDate.split('-');
        const parsedYear = parseInt(year, 10);
        const fullYear = parsedYear < 100 ? (parsedYear + 2000).toString() : year;
        return `${fullYear}-${month}-${day}`;
    } catch (error) {
        return "Incorrect date format";
    }

}


export const convertTextToDate =(text: string): Date => {
    const parts = text.split('-');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Місяці у JavaScript починаються з 0
    const year = 2000 + parseInt(parts[2], 10); // Припускаємо, що рік відноситься до 2000 року

    return new Date(year, month, day);
}
