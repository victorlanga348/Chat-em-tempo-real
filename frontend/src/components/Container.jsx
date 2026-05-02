function Container(props) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden" {...props}>
            {/* Background decorative elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
            
            <div className="relative z-10 w-full flex items-center justify-center">
                {props.children}
            </div>
        </div>
    );
}

export default Container;