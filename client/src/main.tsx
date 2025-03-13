import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.tsx';

import ErrorPage from './pages/ErrorPage.tsx';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import SignUp from './pages/SignUp.tsx';
import Recipe from './pages/Recipe.tsx';
import MyEats from './pages/MyEats.tsx';
import Search from './pages/Search.tsx';
import NewEat from './pages/NewEat.tsx';
import About from './pages/About.tsx';

//add add-recipe route
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <SignUp />,
      },
      {
        path: '/recipe/:id/information',
        element: <Recipe />,
      },
      {
        path: '/:id/myEats',
        element: <MyEats/>,
      },
      {
        path: '/search/',
        element: <Search/>
      },
      {
        path: '/:id/neweat',
        element: <NewEat />
      },
      {
        path: '/about/',
        element: <About/>
      },
    ],
  },
])

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
