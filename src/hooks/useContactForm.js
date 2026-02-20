import { useState, useRef } from "react";
import { validateForm } from "../utils/validation";
import axios from "axios";

const useContactForm = () => {
  const recaptchaRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recaptchaToken = recaptchaRef.current?.getValue();
    const validationErrors = validateForm(formData, recaptchaToken);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("loading");

    try {
      await axios.post(import.meta.env.VITE_API_URL || "https://placeholder.api/contact", {
        ...formData,
        recaptchaToken,
      });

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      recaptchaRef.current?.reset();
    } catch (err) {
      setStatus("error");
    }
  };

  return { formData, errors, status, handleChange, handleSubmit, recaptchaRef };
};

export default useContactForm;