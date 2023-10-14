export function getStartOfDay() {
    const startOfDay = new Date().setHours(0, 0, 0, 0) // Create a new Date object to avoid modifying the original date
    // Set hours, minutes, seconds, and milliseconds to zero to get the start of the day
    // startOfDay.setHours(0, 0, 0, 0);
    console.log(startOfDay)
    return startOfDay;
}

//logic to know when user updting 
export function changed_Date(oldDate) {
    const date1 = new Date();
    const date2 = new Date(oldDate);
    console.log(date1)
    console.log(date2)
    const timeDiff = date1 - date2;
    const day = timeDiff / (1000 * 60 * 60 * 24);
    return Math.floor(day);
}