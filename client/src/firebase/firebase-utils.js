import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


const config = {
    apiKey: "AIzaSyBDGF7AcgpgvZ-xn470j9xAHD11nWD4YEs",
    authDomain: "momskitchen-db.firebaseapp.com",
    databaseURL: "https://momskitchen-db.firebaseio.com",
    projectId: "momskitchen-db",
    storageBucket: "momskitchen-db.appspot.com",
    messagingSenderId: "217898211315",
    appId: "1:217898211315:web:0ef05104d348741477a486"
};
firebase.initializeApp(config);

export const auth = firebase.auth();

export const firestore = firebase.firestore();

export const createUserProfileDocument = async (userAuth, additionalData) =>{
    if(!userAuth) return;
    const userRef = firestore.doc(`users/${userAuth.uid}`);
    const snapshot = await userRef.get();
    if(!snapshot.exists){
        const { displayName, email} = userAuth;
        const createdAt = new Date();
        try{
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData
            })
        }catch(error){
            console.log('error creating user',error.message);  
        }
    }
    return userRef; 
}
export const addDocumentsToCollections = async (collectionKey,objectsToAdd) => {
    const collectionRef = firestore.collection(collectionKey);
    const batch = firestore.batch();
    objectsToAdd.forEach(obj => {
        const newDocRef = collectionRef.doc(); 
        batch.set(newDocRef,obj); 
    });
    return await batch.commit();
};


export const convertCollectionsSnapshotToMap = (collections) =>{
    const transformedCollection = collections.docs.map(doc => {
        const {title,items} = doc.data();

        return{
            routeName: encodeURI(title.toLowerCase()),
            id: doc.id,
            title,
            items
        };
    });
    return transformedCollection.reduce((accumulator,collection) => {
        accumulator[collection.title.toLowerCase()] = collection;
        return accumulator;
    },{});
};


const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt:'select_account' });


export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;