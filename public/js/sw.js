if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker2.js')
    .then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    })
    .catch((err)=>{
      this.console.log('SW Error',err);
    });
    
  });
} else {
  console.log('No service Worker Found');
}
Notification.requestPermission(function(status) {
  console.log('Notification permission status:', status);
});
function displayNotification(msg) {
  if (Notification.permission == 'granted') {
    navigator.serviceWorker.getRegistration().then(function(reg) {
      reg.showNotification(msg);
    });
  }
}

  // self.addEventListener('notificationclick', function(e) {
  //   var notification = e.notification;
  //   var primaryKey = notification.data.primaryKey;
  //   var action = e.action;
  
  //   if (action == 'close') {
  //     notification.close();
  //   } else {
  //     clients.openWindow('http://localhost:8889/dashboard');
  //     notification.close();
  //   }
  // });
  // let deferredPrompt;

  // window.addEventListener('beforeinstallprompt', (e) => {
  //   // Prevent Chrome 67 and earlier from automatically showing the prompt
  //   e.preventDefault();
  //   // Stash the event so it can be triggered later.
  //   deferredPrompt = e;
  //   // Update UI notify the user they can add to home screen
  //   if (window.matchMedia('(display-mode: standalone)').matches) {  
  //     //application already added 
  //   } else {
  //     var btnAdd = document.getElementById('prompt');
  //     btnAdd.style.display = 'block';
  //     var addBtn = document.getElementById('yes_btn');
  //     addBtn.addEventListener('click', (e) => {
  //       console.log('add button clicked');
  //       // hide our user interface that shows our A2HS button
  //       // addBtn.style.display = 'none';
  //       // Show the prompt
  //       deferredPrompt.prompt();
  //       // Wait for the user to respond to the prompt
  //       deferredPrompt.userChoice
  //         .then((choiceResult) => {
  //           if (choiceResult.outcome === 'accepted') {
  //             console.log('User accepted the A2HS prompt');
  //           } else {
  //             console.log('User dismissed the A2HS prompt');
  //           }
  //           deferredPrompt = null;
  //         });
  //     });
  //   }
  // });
  