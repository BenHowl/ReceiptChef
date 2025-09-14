import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Service Worker disabled - causes white screen issues with icon caching
// TODO: Fix service worker caching strategy for proper PWA support
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then((registration) => {
//         console.log('SW registered: ', registration);
//       })
//       .catch((registrationError) => {
//         console.log('SW registration failed: ', registrationError);
//       });
//   });
// }

createRoot(document.getElementById("root")!).render(<App />);
