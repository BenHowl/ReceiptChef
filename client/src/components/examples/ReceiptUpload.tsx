import ReceiptUpload from '../ReceiptUpload';

export default function ReceiptUploadExample() {
  const handleImageUpload = (file: File) => {
    console.log('Image uploaded:', file.name);
  };

  return (
    <div className="p-6">
      <ReceiptUpload onImageUpload={handleImageUpload} />
    </div>
  );
}