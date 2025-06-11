import { useEffect, useRef } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";

function ImageUpload({
  imageFile,
  setImageFile,
  uploadedImageUrl,
  setUploadedImageUrl,
  setLoadingImage,
  loadingImage,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setImageFile(selectedFile);
      setUploadedImageUrl(""); // Optional: clear previous URL when new image is selected
    }
    event.target.value = null; // Reset input so same file can be selected again
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const selectedFile = event.dataTransfer.files[0];
    if (selectedFile) setImageFile(selectedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    setUploadedImageUrl("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function uploadImageToCloudinary() {
    if (!imageFile) return;

    setLoadingImage(true);
    const data = new FormData();
    data.append("my_file", imageFile);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/home/products/image-upload`,
        data
      );

      if (response.data?.success && response.data?.result?.url) {
        setUploadedImageUrl(response.data.result.url);
      } else {
        console.error("Image upload failed:", response.data);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoadingImage(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div className={`w-100 ${isCustomStyling ? "" : "mt-4"}`}>
      <Form.Group controlId="image-upload">
        <Form.Label className="fw-semibold fs-5">Upload Image</Form.Label>
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border border-secondary border-dashed p-3 rounded ${
            isEditMode ? "opacity-50" : ""
          }`}
        >
          <Form.Control
            type="file"
            ref={inputRef}
            onChange={handleImageFileChange}
            disabled={isEditMode}
            className="d-none"
          />

          {!imageFile ? (
            <div
              className={`d-flex flex-column align-items-center justify-content-center h-100 ${
                isEditMode ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              style={{ height: "120px", cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                if (!isEditMode && !loadingImage && inputRef.current) {
                  inputRef.current.click();
                }
              }}
            >
              <div className="text-muted mb-2 fs-3">📤</div>
              <span>Upload Your Image</span>
            </div>
          ) : loadingImage ? (
            <div className="d-flex align-items-center">
              <Spinner animation="border" variant="secondary" size="sm" />
              <span className="ms-2">Uploading...</span>
            </div>
          ) : (
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <span role="img" aria-label="file" className="me-2 fs-5">
                  📄
                </span>
                <span className="text-truncate">{imageFile.name}</span>
              </div>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleRemoveImage}
              >
                Remove
              </Button>
            </div>
          )}
        </div>
      </Form.Group>
    </div>
  );
}

export default ImageUpload;
