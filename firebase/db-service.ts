import {ItemModel} from "../models";
import {BlogPostModel} from "../models/blog.model";
import firebase from "./clientApp";
import {PaymentModel} from "../models/payment.model";

class DatabaseService {
    public itemsCollection: firebase.firestore.CollectionReference<ItemModel>;
    public itemCatCollection: firebase.firestore.CollectionReference<any>;
    public blogCollection: firebase.firestore.CollectionReference<BlogPostModel>;
    public sessionsCollection: firebase.firestore.CollectionReference<BlogPostModel>;

    constructor() {

        this.itemsCollection = firebase.firestore().collection('items');
        this.itemCatCollection = firebase.firestore().collection('itemCategories');
        this.blogCollection = firebase.firestore().collection('blog');
        this.sessionsCollection = firebase.firestore().collection('sessions');
    }
    // provide reference to db object
    get ref() {
        return firebase.firestore();
    }
    /*
    * Items methods
    * */
    addItem(item: ItemModel) {
        return this.itemsCollection.add(item);
    }
    /*
    * get items
    * */
    getItems({limit = 25}) {
        return this.itemsCollection.orderBy('name', 'asc')
            .limit(limit)
            .get()
            .then(query => query.docs.map(doc => {
                const id = doc.id;
                const data = doc.data();
                return {id, ...data};
            }));
    }
    // paginate items
    paginateItems(lastItem, limit = 10) {
        return this.itemCatCollection
            .orderBy('name', 'asc')
            .startAfter(lastItem)
            .limit(limit)
            .get()
            .then(query => query.docs.map(doc => {
                const id = doc.id;
                const data = doc.data();
                return {id, ...data};
            }));
    }
    /*get item by id*/
    getItem(id: string) {
        return this.itemsCollection.doc(id).get()
            .then(doc => {
                const id = doc.id;
                const data = doc.data();
                return {id, ...data};
            });
    }
    /*get items by category name*/
    getItemsByCategory(name: string) {
        return this.itemsCollection
            .where('category', "==", name)
            .get()
            .then(query => query.docs.map(doc => {
                const id = doc.id;
                const data = doc.data();
                return {id, ...data};
            }));
    }
    /*
    * Update items
    * */
    updateItem(item: ItemModel) {
        return this.itemsCollection.doc(item.id).update(item);
    }
    deleteItem(id: string) {
        return this.itemsCollection.doc(id).delete();
    }
    /*
    * Categories methods
    * */
    addCategory(name: string) {
        return this.itemCatCollection
        .add({name, addedDate: new Date()});
    }
    getCategories() {
        return this.itemCatCollection
            .get()
            .then(query => query.docs.map(doc => {
                const id = doc.id;
                const data = doc.data();
                return {id, ...data};
            }));
    }
    /*update category*/
    updateCategory(cat: {id: string, name: string}, oldName: string) {
        return this.itemCatCollection
            .doc(cat.id)
            .update(cat)
            .then(() => {
                this.itemsCollection.where('category', '==', oldName).get().then(response => {
                    let batch = firebase.firestore().batch();
                    response.docs.forEach((doc) => {
                        const docRef = this.itemsCollection.doc(doc.id);
                        const item = doc.data();
                        item.category = cat.name;
                        batch.update(docRef, item);
                    });
                    batch.commit();
                })
            });
    }

    deleteCategory(id: string) {
        return this.itemCatCollection
            .doc(id).delete();
    }
    /*post methods*/
    addBlogPost(data: BlogPostModel) {
        return this.blogCollection
            .add(data);
    }
    getBlogPost(id: string) {
        return this.blogCollection
            .doc(id)
            .get()
            .then(doc => {
                const id = doc.id;
                const data = doc.data();
                return {id, ...data};
            });
    }
    getBlogPosts(limit = 15) {
        return this.blogCollection
            .orderBy('dateAdded', "desc")
            .get()
            .then(query => query.docs.map(doc => {
                const id = doc.id;
                const date = doc.get('dateAdded').toDate();
                const data = doc.data();
                data.dateAdded = date;
                return {id, ...data};
            }));
    }
    updateBlogPost(data: BlogPostModel) {
        return this.blogCollection.doc(data.id).update(data);
    }
    deleteBlogPost(id: string) {
        return this.blogCollection.doc(id).delete();
    }
    // sessions
    getBookings() {
        return this.sessionsCollection
            .orderBy('date', "desc")
            .get()
            .then(query => query.docs.map(doc => {
                const id = doc.id;
                const data = doc.data();
                return {id, ...data};
            }));
    }

    addBooking(data) {
        return this.sessionsCollection.add(data);
    }

    updateBooking(data) {
        return this.sessionsCollection.doc(data.id).update(data);
    }

}

export const dbService = new DatabaseService();

export const paymentCollection: firebase.firestore.CollectionReference<PaymentModel> = (firebase.firestore().collection('payments') as firebase.firestore.CollectionReference<PaymentModel>);

export const usersCollection = firebase.firestore().collection('users');

export const reportsCollection = firebase.firestore().collection('reports');

export const itemsCollection = firebase.firestore().collection('items');

export const realDatabase = firebase.database();
