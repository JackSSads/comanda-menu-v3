export const CTextarea = ({ label, name, value, onChange, placeholder }) => {
    return (
        <label className="text-slate-700 font-semibold flex flex-col">
            {label && label}
            <textarea
                id={name}
                name={name}
                placeholder={placeholder}
                className="w-full border rounded-xl p-3 text-gray-700 font-light focus:outline-none focus:ring-2 focus:ring-amber-500"
                onChange={(e) => onChange(e)}
                value={value}
            />
        </label>
    );
};