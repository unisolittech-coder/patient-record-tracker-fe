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

const createPatientEntry = (id, uhid = "") => ({
    id,
    uhid,
    searched: false,
    searching: false,
    patientName: "",
    patientTestNames: [],
    tests: [{ testName: "", department: "", report: null }],
    fileNames: [""],
});

export default function LabOperatorReports() {
    const {
        loading,
        submitLabReports,
        resetForm,
        fetchLabPatientSearch,
        fetchPatientsWithTestNames,
        fetchLabOperatorTestNames,
    } = useLabOperatorManagment();
    const { fetchLabOperatorDepartments } = useDropdowns();
    const [searchParams] = useSearchParams();
    const formRef = useRef(null);
    const nextPatientId = useRef(1);
    const [patients, setPatients] = useState(() => [
        createPatientEntry(0, searchParams.get("uhid") || ""),
    ]);
    const [availableTestNames, setAvailableTestNames] = useState([]);
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

    const updatePatient = (id, update) => {
        setPatients(current => current.map(patient =>
            patient.id === id ? update(patient) : patient
        ));
    };

    const handleUhidChange = (id, value) => {
        updatePatient(id, patient => ({
            ...createPatientEntry(patient.id, value),
        }));
    };

    const handleSearch = async id => {
        const currentPatient = patients.find(patient => patient.id === id);
        const uhid = currentPatient?.uhid.trim() || "";
        if (!uhid) {
            toast.error("Please enter an MRID");
            return;
        }

        updatePatient(id, patient => ({
            ...patient,
            searched: false,
            searching: true,
            patientName: "",
            patientTestNames: [],
        }));
        try {
            const patientDetails = await fetchLabPatientSearch(uhid);
            if (!patientDetails) return;

            const patientsWithTestNames = await fetchPatientsWithTestNames({
                page: 1,
                limit: 100,
                search: uhid,
            });
            const selectedPatient = Array.isArray(patientsWithTestNames)
                ? patientsWithTestNames.find(patient => patient.uhid === uhid)
                : null;
            updatePatient(id, patient => ({
                ...patient,
                searched: true,
                patientName: patientDetails.patientName || "",
                patientTestNames: selectedPatient?.testNames || patientDetails.testNames || [],
            }));
        } finally {
            updatePatient(id, patient => ({ ...patient, searching: false }));
        }
    };

    const handleTestNameChange = (patientId, index, value) => {
        updatePatient(patientId, patient => ({
            ...patient,
            tests: patient.tests.map((test, testIndex) =>
                testIndex === index ? { ...test, testName: value } : test
            ),
        }));
    };

    const handleDepartmentChange = (patientId, index, value) => {
        updatePatient(patientId, patient => ({
            ...patient,
            tests: patient.tests.map((test, testIndex) =>
                testIndex === index ? { ...test, department: value?.value || "" } : test
            ),
        }));
    };

    const handleReportChange = (patientId, index, file) => {
        updatePatient(patientId, patient => ({
            ...patient,
            tests: patient.tests.map((test, testIndex) =>
                testIndex === index ? { ...test, report: file } : test
            ),
            fileNames: patient.fileNames.map((name, fileIndex) =>
                fileIndex === index ? file?.name || "" : name
            ),
        }));
    };

    const addTest = patientId => {
        const patient = patients.find(item => item.id === patientId);
        if (!patient || patient.tests.length >= 10) {
            toast.warning("Maximum 10 reports per patient");
            return;
        }

        updatePatient(patientId, patient => ({
            ...patient,
            tests: [...patient.tests, { testName: "", department: "", report: null }],
            fileNames: [...patient.fileNames, ""],
        }));
    };

    const removeTest = (patientId, index) => {
        const patient = patients.find(item => item.id === patientId);
        if (patient?.tests.length === 1) {
            toast.warning("At least one test is required");
            return;
        }

        updatePatient(patientId, current => ({
            ...current,
            tests: current.tests.filter((_, testIndex) => testIndex !== index),
            fileNames: current.fileNames.filter((_, fileIndex) => fileIndex !== index),
        }));
    };

    const addPatient = () => {
        const id = nextPatientId.current++;
        setPatients(current => [...current, createPatientEntry(id)]);
    };

    const removePatient = id => {
        setPatients(current => current.length > 1
            ? current.filter(patient => patient.id !== id)
            : current
        );
    };

    const clearForm = () => {
        const id = nextPatientId.current++;
        setPatients([createPatientEntry(id)]);
        resetForm();
        formRef.current?.reset();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (patients.some(patient => !patient.searched || !patient.uhid.trim())) {
            toast.error("Search every patient MRID before submitting");
            return;
        }

        const submissions = [];
        for (const patient of patients) {
            const enteredTests = patient.tests.filter(test =>
                test.testName || test.department || test.report
            );
            if (enteredTests.length > 10) {
                toast.error(`A maximum of 10 reports can be submitted for MRID ${patient.uhid}`);
                return;
            }
            const validTests = enteredTests.filter(test =>
                test.testName.trim() && test.department && test.report
            );
            if (validTests.length === 0 || validTests.length !== enteredTests.length) {
                toast.error(`Complete each test and report for MRID ${patient.uhid}`);
                return;
            }
            submissions.push({ patient, tests: validTests });
        }

        for (let index = 0; index < submissions.length; index++) {
            const { patient, tests: patientTests } = submissions[index];
            const payload = new FormData();
            payload.append("uhid", patient.uhid.trim());
            payload.append("testNames", JSON.stringify(patientTests.map(test => test.testName)));
            payload.append("departments", JSON.stringify(patientTests.map(test => test.department)));
            patientTests.forEach(test => payload.append("reports", test.report));

            const result = await submitLabReports(payload, { showSuccessToast: false });
            if (!result) {
                const submittedIds = new Set(
                    submissions.slice(0, index).map(submission => submission.patient.id)
                );
                if (submittedIds.size > 0) {
                    setPatients(current => current.filter(item => !submittedIds.has(item.id)));
                    toast.warning("Earlier patients were submitted. Remaining patient entries are kept.");
                }
                return;
            }
        }
        toast.success("Reports submitted successfully for all patients");
        clearForm();
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
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Patient Information</h2>
                        <Button
                            type="button"
                            label="Add Patient"
                            icon="pi pi-plus"
                            variant="secondary"
                            onClick={addPatient}
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-5">
                        {patients.map((patient, index) => (
                            <section key={patient.id} className={index > 0 ? "border-t border-gray-200 pt-5" : ""}>
                                <div className="flex items-center justify-between gap-3 mb-3">
                                    <h3 className="text-sm font-semibold text-gray-800">Patient {index + 1}</h3>
                                    {patients.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removePatient(patient.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            title="Remove patient"
                                            aria-label={`Remove patient ${index + 1}`}
                                            disabled={loading}
                                        >
                                            <i className="pi pi-trash" />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex gap-2 items-end">
                                        <div className="flex-1">
                                            <TextInput
                                                id={`uhid-${patient.id}`}
                                                name={`uhid-${patient.id}`}
                                                label="MRID"
                                                required
                                                value={patient.uhid}
                                                onChange={event => handleUhidChange(patient.id, event.target.value)}
                                                onKeyDown={event => {
                                                    if (event.key === "Enter") {
                                                        event.preventDefault();
                                                        handleSearch(patient.id);
                                                    }
                                                }}
                                                placeholder="Enter patient MRID"
                                                disabled={loading || patient.searching}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            label="Search"
                                            icon="pi pi-search"
                                            variant="primary"
                                            onClick={() => handleSearch(patient.id)}
                                            disabled={loading || patient.searching || !patient.uhid.trim()}
                                        />
                                    </div>
                                    {patient.searched && (
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm font-semibold text-gray-700">Patient Name</label>
                                            <div className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-800 min-h-[42px]">
                                                {patient.patientName || "N/A"}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {patient.searched && (
                                    <div className="mt-4">
                                        <LabOperatorTestsReports
                                            tests={patient.tests}
                                            testNames={[...new Set([...availableTestNames, ...patient.patientTestNames])]}
                                            fileNames={patient.fileNames}
                                            departments={departments}
                                            loading={loading}
                                            onAddTest={() => addTest(patient.id)}
                                            onRemoveTest={testIndex => removeTest(patient.id, testIndex)}
                                            onTestNameChange={(testIndex, value) => handleTestNameChange(patient.id, testIndex, value)}
                                            onDepartmentChange={(testIndex, value) => handleDepartmentChange(patient.id, testIndex, value)}
                                            onReportChange={(testIndex, file) => handleReportChange(patient.id, testIndex, file)}
                                        />
                                    </div>
                                )}
                            </section>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <Button
                        type="button"
                        label="Reset"
                        icon="pi pi-refresh"
                        variant="secondary"
                        onClick={clearForm}
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
