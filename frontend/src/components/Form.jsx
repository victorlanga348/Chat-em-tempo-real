function Form(props) {
    return (
        <form className="glass p-10 rounded-2xl w-full max-w-md flex flex-col gap-2" onSubmit={props.onSubmit} >
            {props.children}
        </form>
    );
}

export default Form;