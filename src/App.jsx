import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import FormsData from './components/FormsData';
import Authorities from './components/Authorities';
import Products from './components/Products';
import Categories from './components/Categories';
import Careers from './components/Careers';
import Circulars from './components/Circulars';
import Blogs from './components/Blogs';
import MediaEvents from './components/MediaEvents';
import NoticeBoard from './components/NoticeBoard';
import Tenders from './components/Tenders';
import EAuction from './components/EAuction';
import EQuotation from './components/EQuotation';
import Management from './components/Management';


import Login from './components/Login';


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('hc_admin_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router basename="/adminparekh">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="forms-data" element={<FormsData />} />
          <Route path="authorities" element={<Authorities />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="careers" element={<Careers />} />
          <Route path="circulars" element={<Circulars />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="media-events" element={<MediaEvents />} />
          <Route path="notice-board" element={<NoticeBoard />} />
          <Route path="tenders" element={<Tenders />} />
          <Route path="e-auction" element={<EAuction />} />
          <Route path="e-quotation" element={<EQuotation />} />
          <Route path="management" element={<Management />} />



        </Route>
      </Routes>
    </Router>
  );
}

export default App;
