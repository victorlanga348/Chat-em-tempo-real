function Form(props) {
    return (
        <form className="bg-gray-800 p-8 rounded-lg shadow-xl w-96" onSubmit={props.onSubmit} >
            {props.children}
        </form>
    );
}

export default Form;