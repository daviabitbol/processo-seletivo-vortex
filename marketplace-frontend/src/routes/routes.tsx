import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { Login } from "../pages/Login";
import { SignUp } from "../pages/SignUp";
import { Landing } from "../pages/Landing";
import { Home } from "../pages/Home";
import { CreateItem } from "../pages/CreateItem"
import { CheckItem } from "../pages/CheckItem";
import { UpdateItem } from "../pages/UpdateItem";
import { DeleteItem } from "../pages/DeleteItem";
import { Wishlist } from "../pages/WishList";
import { MyMessages } from "../pages/MyMessages";

export const PrivateRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/signup" replace />;
  }

  return <Outlet />;
};

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/" element={<Landing />}></Route>
        <Route element={<PrivateRoute />}>
          <Route path="/create-item" element={< CreateItem/>}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/profile" element={<Login />}></Route>
          <Route path="/check-item" element={<CheckItem />}></Route>
          <Route path="/update-item" element={<UpdateItem />}></Route>
          <Route path="/delete-item" element={<DeleteItem />}></Route>
          <Route path="/wishlist" element={<Wishlist />}></Route>
          <Route path="my-messages" element={<MyMessages />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
