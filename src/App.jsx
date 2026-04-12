import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router basename="/adminparekh">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="forms-data" element={<FormsData />} />
          <Route path="authorities" element={<Authorities />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="careers" element={<Careers />} />
          <Route path="circulars" element={<Circulars />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="media-events" element={<MediaEvents />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
