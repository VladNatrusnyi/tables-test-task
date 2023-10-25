// import "bootstrap/dist/css/bootstrap.min.css";
import {Route, Routes, useNavigate, useSearchParams} from "react-router-dom";
import {RootLayout} from "./layouts/RootLayout/RootLayout";
import {LoginPage} from "./pages/LoginPage/LoginPage";
import {TablePage} from "./pages/TablePage/TablePage";
import {useAppSelector} from "./helpers/redux-hook";
import {useEffect} from "react";
import {SearchParam} from "./Models/Table";
import {hasFilledField} from "./helpers/filterHelpers";

function App() {
    const navigate = useNavigate();

    const { isLoggedIn } = useAppSelector(state => state.auth)

    const { filterData } = useAppSelector(state => state.filter);

    const [searchParams] = useSearchParams();

    const pageLimit: SearchParam = searchParams.get('limit');
    const pageNumber: SearchParam  = searchParams.get('page');

    useEffect(() => {
        if (!hasFilledField(filterData)) {
            let path: string = pageLimit && pageNumber ? `/table?page=${pageNumber}&limit=${pageLimit}`: `/table?page=1&limit=5`
            isLoggedIn ? navigate(path) : navigate('/auth')
        }

    }, [isLoggedIn, pageLimit, pageNumber, filterData])

  return (
      <Routes>
          <Route path={'/'} element={<RootLayout />}>
              <Route index path="auth" element={<LoginPage />} />
              <Route path="table" element={<TablePage />} />

              <Route path="*" element={<div>Not Found</div>} />
          </Route>
      </Routes>
  );
}

export default App;
