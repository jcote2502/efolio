

export function getDuration(startDate, stopDate) {
    if (startDate && stopDate) {
        const start = {
            year: startDate.getFullYear(),
            month: startDate.getMonth()
        };
        const stop = {
            year: stopDate.getFullYear(),
            month: stopDate.getMonth()
        }
        const totalMonths = (stop.year - start.year) * 12 + (stop.month - start.month);
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;

        return `${months}mo ${years}yr`
    }
    if (startDate && !stopDate) {
        const currentDate = new Date();

        // Create objects for the start and current dates
        const start = {
            year: startDate.getFullYear(),
            month: startDate.getMonth(),
        };

        const stop = {
            year: currentDate.getFullYear(),
            month: currentDate.getMonth(),
        };

        // Calculate the total months difference
        const totalMonths = (stop.year - start.year) * 12 + (stop.month - start.month);

        // Calculate the years and remaining months
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;

        return `${months}mo  ${years > 0 ? years + 'yr' : ''}`;
    }
    return
}

export function validateDates(startDate, stopDate, isCurrent) {
    if (!stopDate && isCurrent) {
        return true
    }
    return stopDate > startDate;
}

export const renderMonthOptions = () => (
    Array.from({ length: 12 }, (_, i) => (
        <option key={i + 1} value={i + 1}>
            {new Date(0, i).toLocaleString('default', { month: 'long' })}
        </option>
    ))
)

export const renderYearOptions = () => {
    const date = new Date();
    const currentYear = date.getFullYear()
    return (
        Array.from({ length: currentYear - 1980 + 1 }, (_, i) => (
            <option key={currentYear - i} value={currentYear - i}>
                {currentYear-i}
            </option>
        ))
    );
}
