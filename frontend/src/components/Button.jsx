function Button(props) {
  return (
    <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl font-bold hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 cursor-pointer active:scale-[0.98] outline-none shadow-lg shadow-blue-500/20 mt-2" {...props} />
  );
}

export default Button;