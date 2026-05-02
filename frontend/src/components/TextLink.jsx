import { Link } from "react-router-dom";

function TextLink(props) {
  return (
    <Link className="text-blue-400 hover:text-blue-300 font-medium transition-colors" {...props} />
  );
}

export default TextLink;