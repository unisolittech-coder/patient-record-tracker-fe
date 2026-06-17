import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-8xl font-bold">404</h1>

      <p className="text-xl mt-4">
        Page Not Found
      </p>

      <Link
        to="/"
        className="mt-5 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Go Home
      </Link>
    </div>
  );
};

export default PageNotFound;