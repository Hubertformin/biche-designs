import {StockStatus} from "../models/item.model";

export function formatStockStatus(type: StockStatus): string {
    switch (type) {
        case "IN_STOCK":
            return "In stock";
        case "LOW_STOCK":
            return "Low stock";
        case "OUT_OF_STOCK":
            return "Out of stock";
        default:
            return type;
    }
}