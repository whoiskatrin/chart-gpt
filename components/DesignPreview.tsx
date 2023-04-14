import React, { useEffect, useState } from "react";
import { getFigmaFile, getImageURLs } from "../services/figma";

interface DesignPreviewProps {
  figmaLink: string;
}

const DesignPreview: React.FC<DesignPreviewProps> = ({ figmaLink }) => {
  const [designData, setDesignData] = useState<any>(null);
  const [imageURLs, setImageURLs] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchDesignData = async () => {
      if (!figmaLink) return;

      const fileId = figmaLink.split("/")[4];
      const fileData = await getFigmaFile(fileId);

      if (fileData) {
        setDesignData(fileData);

        const canvas = fileData.document.children.find(
          (child: any) => child.type === "CANVAS"
        );
        if (canvas) {
          const frameIds = canvas.children.map((child: any) => child.id);
          const imageData = await getImageURLs(fileId, frameIds);
          if (imageData && imageData.images) {
            setImageURLs(imageData.images);
          }
        }
      }
    };

    fetchDesignData();
  }, [figmaLink]);

  const renderPreviewImages = () => {
    return Object.values(imageURLs).map((url, index) => (
      <div key={index} className="preview-image-container">
        <img src={url} alt="Figma Design Preview" />
      </div>
    ));
  };

  return (
    <div className="design-preview">
      <h2>Design Preview</h2>
      {renderPreviewImages()}
    </div>
  );
};

export default DesignPreview;
