export const CInput = ({ label = "", type = "text", id = "", name = "", placeholder = "", onChange = () => { }, value = "" }) => {
    return (
        <label className="w-full text-slate-700 font-semibold flex flex-col">
            {label && label}
            <input
                type={type}
                id={id}
                name={name}
                className="w-full border border-slate-300 rounded-xl font-light px-4 py-3 text-slate-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#EB8F00] placeholder:text-slate-40"
                placeholder={placeholder}
                onChange={(e) => onChange(e)}
                value={value}
            />
        </label>
    );
};