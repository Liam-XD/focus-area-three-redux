// This function formats a Date object into a string in the format 'YYYY-MM-DD'
export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

// This function takes a base date and a number of days to add, and returns the new date with the added days
export const addDays = (baseDate: Date, daysToAdd: number): Date => {
    const result = new Date(baseDate);
    result.setDate(result.getDate() + daysToAdd);
    return result;
};