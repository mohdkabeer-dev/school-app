"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function AddSchoolPage() {
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [preview, setPreview] = useState(null);

  const fields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Address", name: "address", type: "text" },
    { label: "City", name: "city", type: "text" },
    { label: "State", name: "state", type: "text" },
    { label: "Contact", name: "contact", type: "number" },
    { label: "Email", name: "email_id", type: "email" },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    setError(false);

    if (!data.image?.[0]) {
      setLoading(false);
      setError(true);
      setMessage("Please select an image.");
      return;
    }

    const formData = new FormData();
    for (const key in data) {
      if (key === "image") formData.append(key, data[key][0]);
      else formData.append(key, data[key]);
    }

    try {
      const res = await fetch("/api/addSchool", { method: "POST", body: formData });
      const result = await res.json();
      setLoading(false);
      setMessage(result.message || "Operation completed");
      setError(!res.ok);

      if (res.ok) {
        reset();
        setPreview(result.imagePath); // optional: show uploaded image
        router.push("/showSchools"); // redirect after success
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(true);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-blue-500 mb-6">Add School</h1>

        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          {fields.map(f => (
            <div key={f.name} className="mb-4">
              <label className="block text-gray-700 mb-1">{f.label}</label>
              <input
                type={f.type}
                {...register(f.name, { required: `${f.label} is required` })}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {errors[f.name] && <p className="text-red-500 text-sm mt-1">{errors[f.name]?.message}</p>}
            </div>
          ))}

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Image</label>
            <input
              type="file"
              {...register("image", { validate: files => files.length > 0 || "Image is required" })}
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
            {preview && <img src={preview} alt="Preview" className="mt-3 w-full h-48 object-cover rounded-md" />}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md text-white font-semibold transition-colors ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
          >
            {loading ? "Adding..." : "Add School"}
          </button>
        </form>

        {message && <p className={`mt-4 text-center ${error ? "text-red-500" : "text-green-600"}`}>{message}</p>}
      </div>
    </div>
  );
}
