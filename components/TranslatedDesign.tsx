import React, { useEffect, useState } from "react";
import { convertFigmaToTailwind } from "../utils/figmaToTailwind";

interface TranslatedDesignProps {
  designData: any;
}

const TranslatedDesign: React.FC<TranslatedDesignProps> = ({ designData }) => {
  const [tailwindNodes, setTailwindNodes] = useState<any[]>([]);

  useEffect(() => {
    if (designData) {
      const canvas = designData.document.children.find(
        (child: any) => child.type === "CANVAS"
      );
      if (canvas) {
        const processNodes = async () => {
          const tailwindConvertedNodes = await Promise.all(
            canvas.children.map(convertFigmaToTailwind)
          );
          setTailwindNodes(tailwindConvertedNodes);
        };

        processNodes();
      }
    }
  }, [designData]);

  const renderTailwindNodes = (nodes: any[]) => {
    return nodes.map((node, index) => {
      const NodeElement = node.type;
      return (
        <NodeElement key={index} className={node.css}>
          {node.children && renderTailwindNodes(node.children)}
        </NodeElement>
      );
    });
  };

  return (
    <div className="translated-design">
      <h2>Tailwind CSS Design</h2>
      {renderTailwindNodes(tailwindNodes)}
    </div>
  );
};

export default TranslatedDesign;
