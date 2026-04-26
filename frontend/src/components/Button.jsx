function Button(props) {
  return (
    <button className="w-full bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700 transition cursor-pointer active:scale-95 outline-none" {...props} />
  );
}

export default Button;