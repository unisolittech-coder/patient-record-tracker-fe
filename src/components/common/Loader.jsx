import { ProgressSpinner } from "primereact/progressspinner";

const Loader = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <ProgressSpinner />
    </div>
  );
};

export default Loader;