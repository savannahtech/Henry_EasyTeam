export interface IProduct {
    _id: string;
    name: string;
    category: string;
    price: number;
    commission: number | null;
    __v: number;
}
