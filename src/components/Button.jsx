import styles from "./Button.module.css";

function Button({ children, onClick, type, isLoading = false }) {
  return (
    <button
      onClick={onClick}
      className={`${styles.btn} ${styles[type]}`}
      disabled={isLoading}
    >
      {children}
    </button>
  );
}

export default Button;
