export type OrderState = "PRE_ORDER" | "ORDER";
export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export type ItemModel = {
    id?: string;
    name?: string;
    unitPrice?: number;
    category?: string;
    quantity?: number;
    photos?: string[];
    colors?: string[];
    sizes?: string[];
    description?: string;
    lowStockLevel?: number;
    thumbnails?: {
        small: string;
        medium: string;
        large: string;
    },
    stockStatus?: StockStatus;
    orderState?: OrderState;
    addedDate?: Date;
}

export type CartModel = {
    id: string;
    name: string;
    category: string;
    stockStatus?: StockStatus;
    attributes: {
        color: string;
        size: string;
    };
    itemQuantity?: number;
    quantity: number;
    unitPrice: number;
    lowStockLevel?: number;
    thumbnails?: {
        small: string;
        medium: string;
        large: string;
    };
}
