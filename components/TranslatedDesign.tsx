import React from "react";

interface TranslatedDesignProps {
  tailwindDesign: any;
}

const TranslatedDesign: React.FC<TranslatedDesignProps> = ({
  tailwindDesign,
}) => {
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
      {tailwindDesign && renderTailwindNodes(tailwindDesign)}
    </div>
  );
};

export default TranslatedDesign;
