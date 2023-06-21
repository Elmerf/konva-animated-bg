import { useRef, useState } from "react";

const useImageInput = () => {
  const inputRef = useRef<HTMLInputElement>(document.createElement("input"));
  const [image, setImage] = useState<HTMLImageElement>();

  inputRef.current.type = "file";
  inputRef.current.accept = ".png, .jpg, .gif";
  inputRef.current.onchange = function () {
    if (inputRef.current.files) {
      const file = inputRef.current.files[0];
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        const img = new window.Image();
        img.src = reader.result as string;
        setImage(img);
      };
    }
  };

  const loadImage = () => {
    inputRef.current.click();
  };

  return { loadImage, image };
};

export default useImageInput;
