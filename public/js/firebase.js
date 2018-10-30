// Initialize Firebase
var config = {
    apiKey: "AIzaSyCrqDu121-kWTDQfhp8HjhtR3qEjHz_CeA",
    authDomain: "herbeat-a9659.firebaseapp.com",
    databaseURL: "https://herbeat-a9659.firebaseio.com",
    projectId: "herbeat-a9659",
    storageBucket: "herbeat-a9659.appspot.com",
    messagingSenderId: "67142744530"
};
var fireapp = firebase.initializeApp(config);
const db = firebase.firestore(fireapp);
const settings = {timestampsInSnapshots: true};
db.settings(settings);

const userRef = db.collection("users");
const chatRef = db.collection("chat_groups");

// Get all users from the firestore
function getUsers(){
    return userRef
    .get()
    .then((users)=>{
        // console.log(users.docs[0].data().username);
        return users;
    })
    .catch((err)=>{
        console.log('Error getting users:',err);
    })
}
// Create a user document on firestore with name 
function createUser(username,name){
    userRef
    .where('username','==',username)
    .get()
    .then((users)=>{
        if(users.docs.length == 0) {
            userRef.add({
                username: username,
                name: name,
                patient: true
            }).then(function(user){
                console.log("New user registered with id :",user.id," and username: ",username);
                // setCookie('groupId',user.id,24,'/');
            }).catch((err)=>{
                console.log("Error registering user: ", err);
            })
        } else {
             console.log('user already registered');
        }
    })
    .catch((err)=>{
        console.log('Error creating users:',err);
    })
}
// <summary>create a chat group of members on firestore</summary>
function createGroup(members,name){
    return chatRef
    .where('members','array-contains',members[0])
    .get()
    .then((groups)=>{
        var groupNotFound = true;
        groups.forEach(group => {
            if(group.data(0).members.includes(members[1])){
                groupNotFound = false;
            }
        });
        if(groups.docs.length == 0 || groupNotFound){
            console.log(groups)
            chatRef.add({
                group_name:'name',
                members: members
            }).then(function(group){
                console.log("New group created with id :",group.id," and name: ",'name', "and members: ", members);
                return(group.id);
                // setCookie('groupId',group.id,24,'/');
                // setCookie('groupName',group_name,24,'/');
            }).catch((err)=>{
                console.log("Error creating group : ", err);
            });
        } else {
            // console.log(groups.docs[0].id);
            console.log('group found');
            return(groups.docs[0].id);
        }
    })
    .catch((err)=>{
        console.log('Error creating group:',err);
    })
}
//// <summary>Get chats from groups with id as group_id</summary>
function getChats(group_id){
    return chatRef
    .doc(group_id)
    .get()
    .then(function(group) {
        if(group.data().messages){
            // console.log('Messages for group: ', group.data().members);
            group.data().messages.forEach(element => {
                // console.log(element);
            });
            return(group.data().messages);
        } else {
            console.log("No message for this group.");
            return(null);
        }
    })
    .catch(function(error) {
        console.log("Error getting chats: ", error);
    });
}

////<summary>Watch for all groups with id as group_id.</summary> 
function watchGroup(group_id){
    chatRef
    .doc(group_id)
    .onSnapshot((snap)=>{
            // console.log(snap.data());

            // snap.docs.forEach(group => {
            console.log('Message watching:',snap.id);
            // })
    });
}
// <summary>Get all groups containing username as member</summary>
function getGroups(username){
    chatRef
    .where('members','array-contains',username)
    .get()
    .then((groups)=>{
        groups.forEach(group => {
            console.log(group.id);
            // getChats(group.id);
            // watchGroup(group.id);
        });
    })
    .catch((err)=>{
        console.log('Error getting groups:',err);
    })
}
// <summary>Send a text message to group with id group_id 
// with sender as sender and sent_at as now() 
// with read_at array as the map of all members 
// except sender to the read time which is null initially.</summary>
function sendChat(group_id,text,sender){
    return chatRef.doc(group_id)
    .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
            sender:sender,
            text:text,
            sentAt: new Date()
        })
    })
    .then(function(docRef) {
        // UpdateScroll();
        // getChats(group_id);
        console.log("Sent message to group with ID: ", group_id);
        return true;
    })
    .catch(function(error) {
        console.error("Error sending message: ", error);
        return error;
    });
}
