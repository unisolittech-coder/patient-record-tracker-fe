import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import BreadCrumb from "../../../components/common/BreadCrumb";
import PagePath from "../../../components/common/PagePath";
import Button from "../../../components/common/Button";
import { TextInput } from "../../../components/common/FormFields";
import useLabOperatorManagment from "../../../hooks/lab/labOperatorManagment/useLabOperatorManagment";
import useDropdowns from "../../../hooks/dropdown/useDropdowns";
import LabOperatorTestsReports from "./LabOperatorTestsReports";

export default function LabOperatorReports() {
    const {
        loading,
        submitLabReports,
        resetForm,
        fetchLabPatientSearch,
        fetchPatientsWithTestNames,
        fetchLabOperatorTestNames,
        labPatientSearch,
    } = useLabOperatorManagment();
    const { fetchLabOperatorDepartments } = useDropdowns();
    const [searchParams] = useSearchParams();
    const formRef = useRef(null);
    const [uniqueId, setUniqueId] = useState(() => searchParams.get("uhid") || "");
    const [tests, setTests] = useState([{ testName: "", department: "", report: null }]);
    const [patientTestNames, setPatientTestNames] = useState([]);
    const [availableTestNames, setAvailableTestNames] = useState([]);
    const [fileNames, setFileNames] = useState([""]);
    const [searched, setSearched] = useState(false);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const loadDepartments = async () => {
            const loadedDepartments = await fetchLabOperatorDepartments();
            setDepartments(loadedDepartments);
        };
        loadDepartments();
    }, [fetchLabOperatorDepartments]);

    useEffect(() => {
        fetchLabOperatorTestNames().then(setAvailableTestNames);
    }, [fetchLabOperatorTestNames]);

    const handleSearch = async () => {
        if (!uniqueId.trim()) {
            toast.error("Please enter an MRID");
            return;
        }

        setSearched(false);
        setPatientTestNames([]);
        const success = await fetchLabPatientSearch(uniqueId);
        if (!success) return;

        const patientsWithTestNames = await fetchPatientsWithTestNames({
            page: 1,
            limit: 100,
            search: uniqueId.trim(),
        });
        const selectedPatient = Array.isArray(patientsWithTestNames)
            ? patientsWithTestNames.find(patient => patient.uhid === uniqueId.trim())
            : null;
        setPatientTestNames(selectedPatient?.testNames || []);
        setSearched(true);
    };

    const handleTestNameChange = (index, value) => {
        setTests(current => current.map((test, testIndex) =>
            testIndex === index ? { ...test, testName: value } : test
        ));
    };

    const handleDepartmentChange = (index, value) => {
        setTests(current => current.map((test, testIndex) =>
            testIndex === index ? { ...test, department: value?.value || "" } : test
        ));
    };

    const handleReportChange = (index, file) => {
        setTests(current => current.map((test, testIndex) =>
            testIndex === index ? { ...test, report: file } : test
        ));
        setFileNames(current => current.map((name, fileIndex) =>
            fileIndex === index ? file?.name || "" : name
        ));
    };

    const testNameOptions = [...new Set([...availableTestNames, ...patientTestNames])];

    const addTest = () => {
        setTests(current => [...current, { testName: "", department: "", report: null }]);
        setFileNames(current => [...current, ""]);
    };

    const removeTest = (index) => {
        if (tests.length === 1) {
            toast.warning("At least one test is required");
            return;
        }

        setTests(current => current.filter((_, testIndex) => testIndex !== index));
        setFileNames(current => current.filter((_, fileIndex) => fileIndex !== index));
    };

    const clearForm = () => {
        setUniqueId("");
        setPatientTestNames([]);
        setTests([{ testName: "", department: "", report: null }]);
        setFileNames([""]);
        setSearched(false);
        resetForm();
        formRef.current?.reset();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!uniqueId.trim()) {
            toast.error("MRID is required");
            return;
        }

        const validTests = tests.filter(test => test.testName.trim() && test.report);
        if (validTests.length === 0) {
            toast.error("Please add at least one test with a report file");
            return;
        }

        const payload = new FormData();
        payload.append("uhid", uniqueId);
        payload.append("testNames", JSON.stringify(validTests.map(test => test.testName)));
        payload.append("departments", JSON.stringify(validTests.map(test => test.department)));
        validTests.forEach(test => payload.append("reports", test.report));

        const result = await submitLabReports(payload);
        if (result) clearForm();
    };

    const breadcrumbPaths = [
        { label: "Report Submission" },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <BreadCrumb paths={breadcrumbPaths} />
            <PagePath title="Report Submission" />

            <form ref={formRef} onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Patient Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex gap-2 items-end">
                            <div className="flex-1">
                                <TextInput
                                    id="uniqueId"
                                    name="uniqueId"
                                    label="MRID"
                                    required
                                    value={uniqueId}
                                    onChange={event => {
                                        setUniqueId(event.target.value);
                                        setSearched(false);
                                    }}
                                    onKeyDown={event => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            handleSearch();
                                        }
                                    }}
                                    placeholder="Enter patient MRID"
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

                {searched && labPatientSearch && (
                    <LabOperatorTestsReports
                        tests={tests}
                        testNames={testNameOptions}
                        fileNames={fileNames}
                        departments={departments}
                        loading={loading}
                        onAddTest={addTest}
                        onRemoveTest={removeTest}
                        onTestNameChange={handleTestNameChange}
                        onDepartmentChange={handleDepartmentChange}
                        onReportChange={handleReportChange}
                        onReset={clearForm}
                    />
                )}
            </form>
        </div>
    );
}
