//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {createBrowserRouter} from "react-router-dom";
import { RouterProvider } from 'react-router-dom';
import { StrictMode } from 'react';
import { SearchWeather } from './pages/Weather-search.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/search",
    element: <SearchWeather/>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)