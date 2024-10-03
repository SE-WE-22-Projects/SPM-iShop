
export const invalidCordinate = (num: number|null|undefined)=>{
    return num === null || num === undefined || isNaN(num) || num < 0
}