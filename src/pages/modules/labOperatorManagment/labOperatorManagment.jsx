import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BreadCrumb from "../../../components/common/BreadCrumb";
import PagePath from "../../../components/common/PagePath";
import Button from "../../../components/common/Button";
import { TextInput } from "../../../components/common/FormFields";
import useLabOperatorManagment from "../../../hooks/lab/labOperatorManagment/useLabOperatorManagment";

export default function LabOperatorManagment() {
    const { loading, error, submitLabReports, resetForm, fetchLabPatientSearch, labPatientSearch } = useLabOperatorManagment();
    const navigate = useNavigate();
    const formRef = useRef(null);

    const [uniqueId, setUniqueId] = useState("");
    const [tests, setTests] = useState([{ testName: "", report: null }]);
    const [fileNames, setFileNames] = useState([""]);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (!uniqueId.trim()) {
            setSearched(false);
        }
    }, [uniqueId]);

    const handleSearch = async () => {
        if (!uniqueId.trim()) {
            toast.error("Please enter a Unique ID");
            return;
        }
        setSearched(false);
        const success = await fetchLabPatientSearch(uniqueId);
        setSearched(success);
    };

    const breadcrumbPaths = [
        { label: "Lab Operator Management" },
        { label: "Lab Report Submission" },
    ];

    const handleTestNameChange = (index, value) => {
        const newTests = [...tests];
        newTests[index].testName = value;
        setTests(newTests);
    };

    const handleReportChange = (index, file) => {
        const newTests = [...tests];
        newTests[index].report = file;
        setTests(newTests);

        const newFileNames = [...fileNames];
        newFileNames[index] = file ? file.name : "";
        setFileNames(newFileNames);
    };

    const addTest = () => {
        setTests([...tests, { testName: "", report: null }]);
        setFileNames([...fileNames, ""]);
    };

    const removeTest = (index) => {
        if (tests.length === 1) {
            toast.warning("At least one test is required");
            return;
        }
        const newTests = tests.filter((_, i) => i !== index);
        const newFileNames = fileNames.filter((_, i) => i !== index);
        setTests(newTests);
        setFileNames(newFileNames);
    };

    const clearForm = () => {
        setUniqueId("");
        setTests([{ testName: "", report: null }]);
        setFileNames([""]);
        setSearched(false);
        resetForm();
        if (formRef.current) {
            formRef.current.reset();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!uniqueId.trim()) {
            toast.error("Unique ID is required");
            return;
        }

        const validTests = tests.filter(t => t.testName.trim() && t.report);
        if (validTests.length === 0) {
            toast.error("Please add at least one test with a report file");
            return;
        }

        const payload = new FormData();
        payload.append("uhid", uniqueId);
        payload.append("testNames", JSON.stringify(validTests.map(t => t.testName)));
        validTests.forEach((test) => {
            payload.append("reports", test.report);
        });

        const result = await submitLabReports(payload);
        if (result) {
            clearForm();
        }
    };

    const handleReset = () => {
        clearForm();
    };

    return (
        <div className="max-w-7xl mx-auto">
            <BreadCrumb paths={breadcrumbPaths} />

            <PagePath
                title="Lab Report Submission"
                // showSearchBar={false}
                // showAddButton={true}
                // addButtonLabel="Add Entry Manually"
                // onAdd={() => navigate("/doctor/lab-operator/manual-entry")}
            />

            {/* {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-3 text-red-700">
                        <i className="pi pi-exclamation-circle text-xl"></i>
                        <p>{error}</p>
                    </div>
                </div>
            )} */}

            <form ref={formRef} onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Patient Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex gap-2 items-end">
                            <div className="flex-1">
                                <TextInput
                                    id="uniqueId"
                                    name="uniqueId"
                                    label="Unique ID"
                                    required
                                    value={uniqueId}
                                    onChange={(e) => setUniqueId(e.target.value)}
                                    placeholder="Enter patient unique ID"
                                    disabled={loading}
                                />
                            </div>
                            <Button
                                type="button"
                                label="Search"
                                icon="pi pi-search"
                                variant="primary"
                                onClick={handleSearch}
                                disabled={loading || !uniqueId.trim()}
                            />
                        </div>
                        {searched && labPatientSearch?.patientName && (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-gray-700">Patient Name</label>
                                <div className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-800 min-h-[42px]">
                                    {labPatientSearch.patientName}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Tests & Reports</h2>
                        <Button
                            type="button"
                            label="Add Test"
                            icon="pi pi-plus"
                            variant="secondary"
                            onClick={addTest}
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-4">
                        {tests.map((test, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-xl p-4 relative"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <TextInput
                                            id={`testName-${index}`}
                                            label="Test Name"
                                            required
                                            value={test.testName}
                                            onChange={(e) => handleTestNameChange(index, e.target.value)}
                                            placeholder="Enter test name"
                                            disabled={loading}
                                        />
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm font-semibold text-gray-700">
                                                Report/File <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="file"
                                                id={`report-${index}`}
                                                onChange={(e) => handleReportChange(index, e.target.files[0])}
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors text-sm"
                                                disabled={loading}
                                            />
                                            {fileNames[index] && (
                                                <span className="text-xs text-green-600 flex items-center gap-1">
                                                    <i className="pi pi-check-circle"></i>
                                                    {fileNames[index]}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {tests.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTest(index)}
                                            className="mt-7 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remove test"
                                            disabled={loading}
                                        >
                                            <i className="pi pi-trash text-lg"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <Button
                        type="button"
                        label="Reset"
                        icon="pi pi-refresh"
                        variant="secondary"
                        onClick={handleReset}
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        label="Submit Reports"
                        icon="pi pi-send"
                        variant="primary"
                        loading={loading}
                        disabled={loading}
                    />
                </div>
            </form>
        </div>

    );
}
