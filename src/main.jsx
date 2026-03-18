// src/index.jsx
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import App from "./App.jsx"; // App contains Navbar + <Outlet />
import Home from "./Pages/Home/Home.jsx";
import Blogs from "./Pages/blogs/Blogs.jsx";
import BlogDetails from "./Pages/blogs/BlogDetails.jsx";
import Playlist from "./Pages/playlist/playlist.jsx";
import PlaylistDetail from "./Pages/playlist/PlaylistDetails.jsx";
import MasterClass from "./Pages/MasterClass/MasterClass.jsx";
import Programs from "./Pages/Programs/Programs.jsx";
import News from "./Pages/News/News.jsx";
import NewsDetails from "./Pages/News/NewsDetails.jsx";
import Interview from "./Pages/Interviews/Interview.jsx";
import SignIn from "./Pages/SignIn.jsx";
import LiveClass from "./Pages/MasterClass/LiveClass.jsx";
import RecordedClass from "./Pages/MasterClass/RecordedClass.jsx";
import UpcomingEventClass from "./Pages/MasterClass/UpcomingEventClass.jsx";

import LandingPage from "./Pages/Auth/LandingPage.jsx";
import Auth from "./Pages/Auth/Auth.jsx";
import PlanChooser from "./Pages/Auth/PlanChooser.jsx";

import ProfilePage from "./Pages/Profile/ProfilePage.jsx";
import ProfileCertificates from "./Pages/Profile/ProfileCertificates.jsx";
import ProfileBadges from "./Pages/Profile/ProfileBadges.jsx";
import ProfileSubscription from "./Pages/Profile/ProfileSubscription.jsx";
import ProfileNotifications from "./Pages/Profile/ProfileNotifications.jsx";
import Watchlist from "./Pages/Profile/Watchlist.jsx";
import ProfileSignOut from "./Pages/Profile/ProfileSignOut.jsx";
import StudentProgress from "./Pages/Profile/StudentProgress.jsx";

import NoNavbarLayout from "./components/Navbar/NoNavbarLayout.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";


const router = createBrowserRouter([
  // Landing page on root "/"
  {
    path: "/",
    element: <NoNavbarLayout />,
    children: [
      { 
        index: true, 
        element: (
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        ) 
      },
      { 
        path: "auth", 
        element: (
          <PublicRoute>
            <Auth />
          </PublicRoute>
        ) 
      },
      { path: "planChooser", element: <PlanChooser /> },
    ],
  },

  
  {
    path: "/app",
    element: <App />, // App contains Navbar + Outlet
    children: [
      { 
        index: true, 
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "playlist", 
        element: (
          <ProtectedRoute>
            <Playlist />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "playlist/:id", 
        element: (
          <ProtectedRoute>
            <PlaylistDetail />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "MasterClass", 
        element: (
          <ProtectedRoute>
            <MasterClass />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "Programs", 
        element: (
          <ProtectedRoute>
            <Programs />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "Blogs", 
        element: (
          <ProtectedRoute>
            <Blogs />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "Blogs/:id", 
        element: (
          <ProtectedRoute>
            <BlogDetails />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "News", 
        element: (
          <ProtectedRoute>
            <News />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "News/:id", 
        element: (
          <ProtectedRoute>
            <NewsDetails />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "Interviews", 
        element: (
          <ProtectedRoute>
            <Interview />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "signin", 
        element: (
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        ) 
      },
      { 
        path: "LiveClass/:id", 
        element: (
          <ProtectedRoute>
            <LiveClass />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "Recorded/:id", 
        element: (
          <ProtectedRoute>
            <RecordedClass />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "Upcoming/:id", 
        element: (
          <ProtectedRoute>
            <UpcomingEventClass />
          </ProtectedRoute>
        ) 
      },
      
    ],
  },

  
  {
    path: "/app/profile",
    element: <NoNavbarLayout />,
    children: [
      { 
        index: true, 
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ) 
      }, 
      { 
        path: "certificates", 
        element: (
          <ProtectedRoute>
            <ProfileCertificates />
          </ProtectedRoute>
        ) 
      }, 
      { 
        path: "badges", 
        element: (
          <ProtectedRoute>
            <ProfileBadges />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "subscription", 
        element: (
          <ProtectedRoute>
            <ProfileSubscription />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "notifications", 
        element: (
          <ProtectedRoute>
            <ProfileNotifications />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "watchlist", 
        element: (
          <ProtectedRoute>
            <Watchlist />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "progress", 
        element: (
          <ProtectedRoute>
            <StudentProgress />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "signout", 
        element: (
          <ProtectedRoute>
            <ProfileSignOut />
          </ProtectedRoute>
        ) 
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
