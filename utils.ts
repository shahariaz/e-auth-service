export const calculateDiscount = (price: number, parcentage: number) => {
    return price - (price * parcentage) / 100
}
