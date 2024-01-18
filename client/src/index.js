import React, {createContext}  from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import DeviceStore from './store/DeviceStore';
import UserStore from './store/UserStore';
// import reportWebVitals from './reportWebVitals';

export const Context = createContext(null)


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context.Provider value = {{
    user: new UserStore(),
    device: new DeviceStore()
  }}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Context.Provider>,
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
