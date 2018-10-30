// Create a user document on firestore with name 
function createUser(name,isPatient){
    userRef.add({
        name: name,
        patient: isPatient
    }).then(function(user){
        console.log("New user registered with id :",user.id," and name: ",name);
        // setCookie('groupId',user.id,24,'/');
    }).catch((err)=>{
        console.log("Error registering user: ", err);
    })
}
// <summary>create a chat group of members on firestore</summary>
function createGroup(members,name){
    chatRef.add({
        group_name:name,
        members: members
    }).then(function(group){
        console.log("New group created with id :",group.id," and name: ",group_name, "and members: ", members);
        // setCookie('groupId',group.id,24,'/');
        // setCookie('groupName',group_name,24,'/');
    }).catch((err)=>{
        console.log("Error creating group : ", err);
    });
}
//// <summary>Get chats from groups with id as group_id</summary>
function getChats(group_id){
    chatRef
    .doc(group_id)
    .get()
    .then(function(group) {
        if(group.data().messages){
            // console.log('Messages for group: ', group.data().members);
            group.data().messages.forEach(element => {
                console.log(element);
            });
        } else {
            console.log("No message for this group.");
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
            console.log(snap.data());
        snap.docs.forEach(group => {
            console.log('watching:',group);
        })
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
}
// <summary>Send a text message to group with id group_id 
// with sender as sender and sent_at as now() 
// with read_at array as the map of all members 
// except sender to the read time which is null initially.</summary>
function sendChat(group_id,text,sender){
    chatRef.doc(group_id)
    .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
            sender:sender,
            text:text,
            sentAt: new Date()
        })
    })
    .then(function(docRef) {
        UpdateScroll();
        getChats(group_id);
        console.log("Sent message to group with ID: ", group_id);
    })
    .catch(function(error) {
        console.error("Error sending message: ", error);
    });
}
