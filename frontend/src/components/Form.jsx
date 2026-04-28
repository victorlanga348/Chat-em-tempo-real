function Form(props) {
    return (
        <form className="bg-gray-800 p-8 rounded-lg shadow-xl w-80" onSubmit={props.onSubmit} >
            {props.children}
        </form>
    );
}

export default Form;