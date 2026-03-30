export const CSelect = ({ label, options, value, onChange = () => { } }) => {
    return (
        <label className="text-slate-700 font-semibold flex flex-col">
            {label && label}
            <select
                className="w-full border rounded-xl p-3 text-gray-700 leading-tight font-light focus:outline-none focus:shadow-outline"
                onChange={(e) => onChange(e)}
                value={value}
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>{option.label}</option>
                ))}
            </select>
        </label>
    );
};