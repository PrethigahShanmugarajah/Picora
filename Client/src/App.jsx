// Client / src / App.jsx
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import AppLayout from "./components/Layout/AppLayout";
import Photos from "./pages/Photos";
import Favorites from "./pages/Favorites";
import Albums from "./pages/Albums/View/Albums";
import AlbumDetail from "./pages/AlbumDetail/View/AlbumDetail";
import Trash from "./pages/Trash/View/Trash";

const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            color: "#000000",
            fontFamily: '"Inria Serif", serif',
          },
        }}
      />

      <Routes>
        <Route path="/login" element={<Auth />} />

        <Route element={<AppLayout />}>
          <Route path="/" element={<Photos />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/albums/:id" element={<AlbumDetail />} />
          <Route path="/trash" element={<Trash />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
