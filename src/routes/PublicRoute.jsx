import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "../components/common/ErrorBoundary";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import { ROLES } from "../constants/roles";
import DepartmentManagement from "../pages/modules/department/DepartmentManagement";
import PaymentManagement from "../pages/modules/payment/PaymentManagement";

// Lazy loading components
const Login = lazy(() => import("../pages/auth/Login"));

// Dashboard
const AdminDashboard = lazy(
  () => import("../pages/modules/dashboard/AdminDashboard"),
);

// Patient Data
const PatientsListData = lazy(
  () => import("../pages/modules/patientData/PatientsListData"),
);
const PatientDataView = lazy(
  () => import("../pages/modules/patientData/PatientDataView"),
);
const PatientDataUpdate = lazy(
  () => import("../pages/modules/patientData/PatientDataUpdate"),
);

// Patient Registration
const NewPatientRegistration = lazy(
  () => import("../pages/modules/patientRegistrations/NewPatientRegistration"),
);

// Receptionist Management
const ReceptionishtsListData = lazy(
  () =>
    import("../pages/modules/receptionishtManagement/ReceptionishtsListData"),
);
const AddEditReceptionisht = lazy(
  () => import("../pages/modules/receptionishtManagement/AddEditReceptionisht"),
);

// Analytics
const Analytics = lazy(() => import("../pages/modules/analytics/Analytics"));

//DOctor Patient Management 
const DoctorPatientManagement = lazy(() => import('../pages/modules/doctorManagment/DoctorPatientManagement'));

// Fallback loader
const Loader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <i className="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
  </div>
);

export default function PublicRoute() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Login />} />
            {/* <Route path="/" element={<Navigate to="/" replace />} /> */}

            {/* Authenticated Routes wrapped in Layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<AdminDashboard />} />{" "}
                {/* Or logic for ReceptionishtDashboard based on role */}
                <Route
                  element={
                    <RoleProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]} />
                  }
                >
                  <Route
                    path="/receptionist-management"
                    element={<ReceptionishtsListData />}
                  />
                  <Route
                    path="/receptionist-management/add"
                    element={<AddEditReceptionisht />}
                  />
                  <Route
                    path="/receptionist-management/edit/:id"
                    element={<AddEditReceptionisht />}
                  />
                  <Route path="/analytics" element={<Analytics />} />
                </Route>


<Route element={<RoleProtectedRoute allowedRoles={[ROLES.DOCTOR, ROLES.SUPER_ADMIN]} />}>
    <Route path="/doctor/patient-management" element={<DoctorPatientManagement />} />
    {/* Other doctor routes */}
</Route>





                <Route path="/patient-data" element={<PatientsListData />} />
                <Route
                  path="/patient-data/view/:id"
                  element={<PatientDataView />}
                />
                <Route
                  path="/patient-data/edit/:id"
                  element={<PatientDataUpdate />}
                />
                <Route
                  path="/patient-registration"
                  element={<NewPatientRegistration />}
                />
                <Route
                  path="/department-management"
                  element={<DepartmentManagement />}
                />
                <Route
                  path="/payment-management"
                  element={<PaymentManagement />}
                />
              </Route>
            </Route>

            {/* Catch-all route for 404 */}
            <Route
              path="*"
              element={
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
