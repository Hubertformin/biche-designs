import {ItemModel} from "./item.model";

export type ItemCategoryModel = {
    id?: string;
    name?: string;
    items?: ItemModel[];
    addedDate?: Date;
}