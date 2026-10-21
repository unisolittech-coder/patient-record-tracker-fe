import Button from "../../../components/common/Button";
import { SelectInput } from "../../../components/common/FormFields";

export default function LabOperatorTestsReports({
    tests,
    testNames,
    fileNames,
    departments,
    loading,
    onAddTest,
    onRemoveTest,
    onTestNameChange,
    onDepartmentChange,
    onReportChange,
    onReset,
}) {
    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Tests & Reports</h2>
                    <Button
                        type="button"
                        label="Add Test"
                        icon="pi pi-plus"
                        variant="secondary"
                        onClick={onAddTest}
                        disabled={loading}
                    />
                </div>

                <div className="space-y-4">
                    {tests.map((test, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-4 relative">
                            <div className="flex items-start gap-4">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <SelectInput
                                        id={`testName-${index}`}
                                        label="Test Name"
                                        required
                                        options={testNames.map(testName => ({
                                            value: testName,
                                            label: testName,
                                        }))}
                                        value={test.testName
                                            ? { value: test.testName, label: test.testName }
                                            : null}
                                        onChange={value => onTestNameChange(index, value?.value || "")}
                                        placeholder="Select test name"
                                        isDisabled={loading}
                                    />
                                    <SelectInput
                                        id={`department-${index}`}
                                        label="Department"
                                        required
                                        options={departments.map(department => ({
                                            value: department,
                                            label: department,
                                        }))}
                                        value={test.department
                                            ? { value: test.department, label: test.department }
                                            : null}
                                        onChange={value => onDepartmentChange(index, value)}
                                        placeholder="Select department"
                                        disabled={loading}
                                    />
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Report/File <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="file"
                                            id={`report-${index}`}
                                            onChange={event => onReportChange(index, event.target.files[0])}
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
                                        onClick={() => onRemoveTest(index)}
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
                    onClick={onReset}
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
        </>
    );
}
