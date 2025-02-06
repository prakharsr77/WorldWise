import { useNavigate } from "react-router-dom";
import Button from "./Button";

function BackButton() {
  const navigate = useNavigate();

  return (
    <Button
      type="back"
      onClick={(e) => {
        e.preventDefault();
        navigate(-1);
      }}
    >
      <span style={{ marginBottom: "5%" }}>&larr;</span> Back
    </Button>
  );
}

export default BackButton;
