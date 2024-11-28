export const vietnamCurrency = (price) => {
    return price.toLocaleString('vi', {style : 'currency', currency : 'VND'})
}