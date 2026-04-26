import { Link } from "react-router-dom";

function TextLink(props) {
  return (
    <Link className="text-blue-400 hover:underline" {...props} />
  );
}

export default TextLink;