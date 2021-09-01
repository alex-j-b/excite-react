export const timestampToDate = timestamp => {
    let date = new Date(timestamp);
    let day = date.getDate() > 9 ? date.getDate() : '0' + (date.getDate()).toString();
    let month = date.getMonth()+1 > 9 ? date.getMonth()+1 : '0' + (date.getMonth()+1).toString();
    let min = date.getMinutes() > 9 ? date.getMinutes() : '0' + (date.getMinutes()).toString();
    let year = date.getFullYear().toString().substr(2);

    return `${day}/${month}/${year} à ${date.getHours()}h${min}`;
}
