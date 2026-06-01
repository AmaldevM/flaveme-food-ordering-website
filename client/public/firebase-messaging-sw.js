// Import and configure the Firebase SDK inside the service worker context
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker.
// These placeholders can be configured during manual deployment.
firebase.initializeApp({
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
});

// Retrieve an instance of Firebase Cloud Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'Flave Me Alert!';
  const notificationOptions = {
    body: payload.notification?.body || 'Order status update.',
    icon: payload.notification?.image || '/assets/icons8-delivery-96-removebg-preview-HhiLdRxp.png',
    badge: '/assets/icons8-shopping-cart-96-removebg-preview-D1mJ7qfG.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
