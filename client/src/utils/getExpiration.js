export const getExpiration = (date1) => {
    let creationDate = new Date(date1);
    let expirationDate = new Date(creationDate);

    expirationDate.setDate(creationDate.getDate() + 6);
    let diffTime = expirationDate.getTime() - (new Date()).getTime();
    
    let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    diffTime -= diffDays * (1000 * 60 * 60 * 24);
    
    let diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    diffTime -= diffHours * (1000 * 60 * 60);
    
    let diffMins = Math.floor(diffTime / (1000 * 60));

    return `${diffDays} days, ${diffHours} hours and ${diffMins} minutes`;
};