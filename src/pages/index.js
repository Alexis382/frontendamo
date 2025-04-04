import React, { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi"; // Icono para el botón de subir

export default function UploadForm() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);
    const [images, setImages] = useState([]);
    const [expandedImage, setExpandedImage] = useState(null);

    // Maneja la selección del archivo
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setError(null);
        }
    };

    // Subir imagen al backend
    const handleUpload = async () => {
        if (!file) {
            setError("Selecciona una imagen antes de subir.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("https://3523110113-alexis5a-backend.hextech.space/imagenes/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Error al subir la imagen");

            const data = await response.json();
            console.log("Imagen subida:", data);
            fetchImages(); // Refrescar galería
        } catch (error) {
            setError("Error al subir la imagen.");
            console.error(error);
        }
    };

    // Obtener imágenes desde el backend
    const fetchImages = async () => {
        try {
            const response = await fetch("https://3523110113-alexis5a-backend.hextech.space/imagenes/all");
            const data = await response.json();
            console.log("Imágenes desde backend:", data.images);

            // ✅ Usamos directamente la URL de la variante pública (la primera)
            const imageUrls = data.images.map(image => image.variants[0]);

            setImages(imageUrls);
        } catch (error) {
            setError("Error al cargar las imágenes.");
            console.error(error);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleSelectImage = (image) => {
        setExpandedImage(image);
    };

    const handleCloseExpandedImage = () => {
        setExpandedImage(null);
    };

    return (
        <div className="upload-container">
            <h3>GALERIA DE IMAGENES</h3>
            <div className="upload-form">
                <label htmlFor="file-upload" className="custom-file-upload">
                    <FiUpload className="upload-icon" /> Seleccionar Imagen
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden-file-input"
                />
                {preview && <img src={preview} alt="Vista previa" className="preview-image" />}
                <button onClick={handleUpload} className="upload-button">Subir Imagen</button>
                {error && <p className="error-text">{error}</p>}
            </div>

            <h3>Imágenes</h3>
            <div className="image-gallery">
                {images.length > 0 ? (
                    images.map((image, index) => (
                        <div key={index} className="image-card" onClick={() => handleSelectImage(image)}>
                            <img src={image} alt={Imagen ${index + 1}} className="image-thumbnail" />
                            <p>Seleccionar</p>
                        </div>
                    ))
                ) : (
                    <p>No hay imágenes subidas.</p>
                )}
            </div>

            {expandedImage && (
                <div className="expanded-image-container" onClick={handleCloseExpandedImage}>
                    <img src={expandedImage} alt="Imagen Expandida" className="expanded-image" />
                </div>
            )}
        </div>
    );
}
