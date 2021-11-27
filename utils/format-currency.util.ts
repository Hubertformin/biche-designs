export function formatCurrency(val: number) {
    return new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR' })
        .format(val);
}
