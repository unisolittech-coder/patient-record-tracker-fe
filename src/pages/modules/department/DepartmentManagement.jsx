import { useState, useEffect } from "react";
import BreadCrumb from "../../../components/common/BreadCrumb";
import PagePath from "../../../components/common/PagePath";
import Button from "../../../components/common/Button";
import DataTable from "../../../components/common/DataTable";
import { TextInput, SelectInput } from "../../../components/common/FormFields";
import useDepartmentMgmt from "../../../hooks/departmentMgmt/useDepartmentMgmt";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const breadcrumbPaths = [
  { label: "Department Management", url: "/department-management" },
  { label: "Department" },
];

const validationSchema = Yup.object({
  department: Yup.string().required("Department name is required"),
  floorNo: Yup.string().required("Floor number is required"),
  roomNos: Yup.array()
    .min(1, "At least one room number is required")
    .required("Room numbers are required"),
});

const floorOptions = [
  { label: "Ground Floor", value: "Ground Floor" },
  { label: "1st Floor", value: "1st Floor" },
  { label: "2nd Floor", value: "2nd Floor" },
  { label: "3rd Floor", value: "3rd Floor" },
  { label: "4th Floor", value: "4th Floor" },
  { label: "5th Floor", value: "5th Floor" },
];

const ADD_NEW_OPTION = { label: "➕ Add New Department", value: "__ADD_NEW__" };

const initialFormValues = {
  department: "",
  floorNo: "",
  roomNos: [],
};

export default function DepartmentManagement() {
  const {
    loading,
    departmentRes,
    addDepartment,
    fetchDepartments,
    fetchDepartmentDropdown,
    fetchDepartmentDetails,
    updateDepartment,
    deleteDepartment,
  } = useDepartmentMgmt();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [roomInput, setRoomInput] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [isAddNewMode, setIsAddNewMode] = useState(false);
  const [viewDetails, setViewDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const loadDropdownData = () => {
    fetchDepartmentDropdown().then((data) => {
      if (data && Array.isArray(data)) {
        const options = data.map((item) => ({
          label: item.department || item.name || item,
          value: item.department || item.name || item,
        }));
        // Add "Add New" option at the end
        setDepartmentOptions([...options, ADD_NEW_OPTION]);
      } else {
        // If dropdown is empty, only show "Add New"
        setDepartmentOptions([ADD_NEW_OPTION]);
      }
    });
  };

  useEffect(() => {
    fetchDepartments();
    loadDropdownData();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialFormValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        let success;
        if (editingId) {
          // PUT - update existing department (only floorNo and roomNos)
          const payload = {
            floorNo: values.floorNo,
            roomNos: values.roomNos,
          };
          success = await updateDepartment(editingId, payload);
        } else {
          // POST - create new department (all fields)
          const payload = {
            department: values.department,
            floorNo: values.floorNo,
            roomNos: values.roomNos,
          };
          success = await addDepartment(payload);
        }

        if (success) {
          toast.success(
            editingId
              ? "Department updated successfully!"
              : "Department added successfully!",
          );
          setShowForm(false);
          setEditingId(null);
          setIsAddNewMode(false);
          formik.resetForm();
          setRoomInput("");
          fetchDepartments();
          loadDropdownData();
        }
      } catch (error) {
        console.error("Department save error:", error);
        toast.error("Something went wrong while saving department");
      }
    },
  });

  const handleAddClick = () => {
    setEditingId(null);
    setIsAddNewMode(false);
    formik.resetForm();
    setRoomInput("");
    setShowForm(true);
  };

  const handleEditClick = (rowData) => {
    setEditingId(rowData._id);
    setIsAddNewMode(false);
    formik.setValues({
      department: rowData.department || "",
      floorNo: rowData.floorNo || "",
      roomNos: rowData.roomNos || [],
    });
    setRoomInput("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewClick = async (rowData) => {
    setShowDetailsModal(true);
    setViewDetails(null);
    setDetailsLoading(true);
    try {
      // Fetch full department details from gmc-cleaning-backend
      const res = await fetchDepartmentDetails(rowData._id);
      if (res) {
        const data = res?.data || res;
        setViewDetails(Array.isArray(data) ? data[0] : data);
      }
    } catch (error) {
      console.error("Error loading details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleDepartmentChange = (selectedOption) => {
    const value = selectedOption?.value || "";

    if (value === "__ADD_NEW__") {
      // User wants to add a new department manually
      setIsAddNewMode(true);
      setEditingId(null);
      formik.setFieldValue("department", "");
      formik.setFieldValue("floorNo", "");
      formik.setFieldValue("roomNos", []);
      setRoomInput("");
    } else {
      // User selected an existing department - find it in the list
      setIsAddNewMode(false);
      const selectedDept = departmentRes.find(
        (item) => item.department === value,
      );
      if (selectedDept) {
        setEditingId(selectedDept._id);
        formik.setFieldValue("department", value);
        formik.setFieldValue("floorNo", selectedDept.floorNo || "");
        formik.setFieldValue("roomNos", selectedDept.roomNos || []);
      } else {
        setEditingId(null);
        formik.setFieldValue("department", value);
      }
    }
  };

  const handleDeleteClick = (rowData) => {
    setDeleteId(rowData._id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const success = await deleteDepartment(deleteId);
    if (success) {
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchDepartments();
      loadDropdownData();
    }
  };

  const handleRoomInputChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    const sanitized = value.replace(/[^0-9]/g, "");
    setRoomInput(sanitized);
  };

  const handleRoomKeyDown = (e) => {
    // Block non-numeric keys
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
      "Enter",
    ];
    if (allowedKeys.includes(e.key)) return;
    if (e.ctrlKey || e.metaKey) return;
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }

    if (e.key === "Enter") {
      e.preventDefault();
      handleAddRoom();
    }
  };

  const handleAddRoom = () => {
    const room = roomInput.trim();
    if (!room) return;

    const currentRooms = formik.values.roomNos || [];
    if (currentRooms.includes(room)) {
      toast.warning("Room number already added");
      return;
    }

    formik.setFieldValue("roomNos", [...currentRooms, room]);
    setRoomInput("");
  };

  const handleRemoveRoom = (roomToRemove) => {
    const currentRooms = formik.values.roomNos || [];
    formik.setFieldValue(
      "roomNos",
      currentRooms.filter((room) => room !== roomToRemove),
    );
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setIsAddNewMode(false);
    formik.resetForm();
    setRoomInput("");
  };

  const departmentBodyTemplate = (rowData) => {
    return (
      <button
        onClick={() => handleViewClick(rowData)}
        className="flex items-center gap-3 w-full text-left hover:bg-blue-50 rounded-lg p-1 transition-colors"
        title="Click to view details"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white flex items-center justify-center shrink-0">
          <i className="pi pi-building text-sm" />
        </div>
        <div>
          <p className="font-medium text-gray-800">{rowData.department}</p>
        </div>
      </button>
    );
  };

  const floorBodyTemplate = (rowData) => {
    const floor = rowData.floorNo || "-";
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
        <i className="pi pi-arrow-up mr-1 text-xs" />
        {floor}
      </span>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleViewClick(rowData)}
          className="h-8 w-8 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center justify-center"
          title="View Details"
        >
          <i className="pi pi-eye text-xs" />
        </button>
        <button
          onClick={() => handleEditClick(rowData)}
          className="h-8 w-8 rounded-lg bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-200 flex items-center justify-center"
          title="Edit Department"
        >
          <i className="pi pi-pencil text-xs" />
        </button>
        <button
          onClick={() => handleDeleteClick(rowData)}
          className="h-8 w-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 flex items-center justify-center"
          title="Delete Department"
        >
          <i className="pi pi-trash text-xs" />
        </button>
      </div>
    );
  };

  const tableData = Array.isArray(departmentRes)
    ? departmentRes.map((item, index) => ({
        ...item,
        srNo: index + 1,
        floorNo: item.floorNo || "",
      }))
    : [];

  const columns = [
    {
      field: "srNo",
      header: "Sr. No.",
      sortable: false,
      minWidth: "80px",
    },
    {
      field: "department",
      header: "Department",
      sortable: true,
      body: departmentBodyTemplate,
      minWidth: "250px",
    },
    {
      field: "floorNo",
      header: "Floor",
      sortable: true,
      body: floorBodyTemplate,
      minWidth: "120px",
    },
    {
      field: "action",
      header: "Actions",
      sortable: false,
      body: actionBodyTemplate,
      minWidth: "160px",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <BreadCrumb paths={breadcrumbPaths} />

      <PagePath
        title="Department Management"
        showAddButton={!showForm}
        addButtonLabel="Add Department"
        onAdd={handleAddClick}
      />

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="mb-4 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">
              {editingId
                ? "Update Department"
                : isAddNewMode
                  ? "Add New Department"
                  : "Assign Floor & Rooms"}
            </h2>
            <p className="text-sm text-gray-500">
              {editingId
                ? "Update floor and room information for this department."
                : isAddNewMode
                  ? "Enter department details to create a new department."
                  : "Select a department to assign floor and rooms, or add a new one."}
            </p>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative z-30">
                {isAddNewMode ? (
                  <TextInput
                    id="department"
                    name="department"
                    label="Department Name"
                    placeholder="Enter new department name"
                    value={formik.values.department}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    error={
                      formik.touched.department && formik.errors.department
                    }
                  />
                ) : (
                  <SelectInput
                    id="department"
                    name="department"
                    label="Department Name"
                    options={departmentOptions}
                    placeholder="Select Department or Add New"
                    value={
                      departmentOptions.find(
                        (option) => option.value === formik.values.department,
                      ) || null
                    }
                    onChange={handleDepartmentChange}
                    onBlur={() => formik.setFieldTouched("department", true)}
                    isDisabled={!!editingId}
                    required
                    error={
                      formik.touched.department && formik.errors.department
                    }
                  />
                )}
              </div>

              <div className="relative z-20">
                <SelectInput
                  id="floorNo"
                  name="floorNo"
                  label="Floor Number"
                  options={floorOptions}
                  placeholder="Select Floor"
                  value={
                    floorOptions.find(
                      (option) => option.value === formik.values.floorNo,
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    formik.setFieldValue("floorNo", selectedOption?.value || "")
                  }
                  onBlur={() => formik.setFieldTouched("floorNo", true)}
                  required
                  error={formik.touched.floorNo && formik.errors.floorNo}
                />
              </div>

              {/* Room Numbers */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Room Numbers <span className="text-red-500">*</span>
                </label>

                <div className="flex gap-2 max-w-xs">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={roomInput}
                    onChange={handleRoomInputChange}
                    onKeyDown={handleRoomKeyDown}
                    placeholder="Room no. (e.g. 101)"
                    className="w-40 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors border-gray-300"
                  />
                  <Button
                    type="button"
                    label="Add"
                    variant="secondary"
                    icon="pi pi-plus"
                    onClick={handleAddRoom}
                  />
                </div>

                {formik.touched.roomNos && formik.errors.roomNos && (
                  <small className="text-red-500 text-xs mt-1 block">
                    {formik.errors.roomNos}
                  </small>
                )}

                {/* Room Tags */}
                {formik.values.roomNos?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formik.values.roomNos.map((room, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200"
                      >
                        <i className="pi pi-hashtag text-xs" />
                        {room}
                        <button
                          type="button"
                          onClick={() => handleRemoveRoom(room)}
                          className="ml-1 text-blue-400 hover:text-red-500 transition-colors"
                          title="Remove room"
                        >
                          <i className="pi pi-times text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end gap-3">
              <Button
                type="button"
                label="Cancel"
                variant="secondary"
                icon="pi pi-times"
                onClick={handleCancel}
              />
              <Button
                type="submit"
                label={loading ? "Saving..." : editingId ? "Update" : "Save"}
                variant="primary"
                icon={loading ? "pi pi-spin pi-spinner" : "pi pi-save"}
                className="px-6"
                disabled={loading}
              />
            </div>
          </form>
        </div>
      )}

      {/* Departments Table */}
      <DataTable
        data={tableData}
        columns={columns}
        loading={loading}
        emptyMessage="No departments found."
      />

      {/* Department Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDetailsModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <i className="pi pi-building text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Department Details</h3>
                  <p className="text-sm text-blue-100">
                    View full department information
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-9 h-9 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                title="Close"
              >
                <i className="pi pi-times text-lg" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {detailsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <i className="pi pi-spin pi-spinner text-3xl text-blue-500" />
                </div>
              ) : viewDetails ? (
                <div className="space-y-6">
                  {/* Department Name */}
                  <div className="text-center pb-4 border-b border-gray-100">
                    <h4 className="text-2xl font-bold text-gray-800">
                      {viewDetails.department || "-"}
                    </h4>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Floor
                      </p>
                      <p className="mt-1 text-lg font-bold text-gray-800">
                        {viewDetails.floorNo || "-"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Department ID
                      </p>
                      <p className="mt-1 text-lg font-bold text-gray-800 truncate">
                        {viewDetails._id || "-"}
                      </p>
                    </div>
                  </div>

                  {/* Room Numbers */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                      Room Numbers
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(viewDetails.roomNos && viewDetails.roomNos.length > 0) ? (
                        viewDetails.roomNos.map((room, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium border border-blue-200"
                          >
                            <i className="pi pi-hashtag mr-1 text-xs" />
                            {room}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm">No rooms assigned</p>
                      )}
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Created At
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {viewDetails.createdAt
                        ? new Date(viewDetails.createdAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <i className="pi pi-exclamation-triangle text-4xl mb-3" />
                  <p>No details found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <i className="pi pi-exclamation-triangle text-red-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Delete Department
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Are you sure you want to delete this department? This action
                  cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                label="Cancel"
                variant="secondary"
                icon="pi pi-times"
                onClick={() => setShowDeleteModal(false)}
              />
              <Button
                type="button"
                label={loading ? "Deleting..." : "Delete"}
                variant="danger"
                icon={loading ? "pi pi-spin pi-spinner" : "pi pi-trash"}
                onClick={handleConfirmDelete}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}