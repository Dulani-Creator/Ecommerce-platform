import { useState } from "react";
import mediaUpload from "../Utils/mediaUpload";

export default function TestPage() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    async function uploadImage() {
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const link = await mediaUpload(file);
            console.log("Uploaded URL:", link);
            setImageUrl(link);
        } catch (err) {
            console.error("Upload failed:", err);
            setError(err.message || "Failed to upload image.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full h-full flex flex-col gap-4 justify-center items-center p-4">
            <input
                type="file"
                accept="image/*"
                className="text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600 file:cursor-pointer"
                onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    console.log("Selected file:", selectedFile);
                    setFile(selectedFile);
                    setError("");
                }}
            />

            <button
                onClick={uploadImage}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {loading ? "Uploading..." : "Upload"}
            </button>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {imageUrl && (
                <div className="flex flex-col items-center gap-2">
                    <p className="text-green-500 text-sm">Upload successful!</p>
                    <img src={imageUrl} alt="Uploaded preview" className="max-w-xs rounded shadow" />
                    <a
                        href={imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 underline text-sm"
                    >
                        Open Image in New Tab
                    </a>
                </div>
            )}
        </div>
    );
}