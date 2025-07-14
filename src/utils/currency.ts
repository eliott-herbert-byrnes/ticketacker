import { myBig } from "@/lib/big"

export const toCent = (amount: number) =>
    new myBig(amount).mul(100).round(2).toNumber()

export const fromCent = (amount: number) =>
    new myBig(amount).div(100).round(2).toNumber()


export const toCurrencyFromCent = (amount: number) => {
    return new Intl.NumberFormat("en-Us", {
        style: "currency",
        currency: "USD",
    }).format(fromCent(amount))
}