import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import MainForm from "./MainForm";

function Layout() {
  return (
    <div className="page">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;
