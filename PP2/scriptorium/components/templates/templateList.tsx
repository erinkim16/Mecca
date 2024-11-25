import React from "react";
import TemplateCard, { TemplateCardProps } from "./templateCard";

interface TemplateListProps {
  templates: TemplateCardProps[];
}

const TemplateList: React.FC<TemplateListProps> = ({ templates }) => {
  return (
    <div className="template-list grid grid-cols-1 md:grid-cols-2 gap-4">
      {templates.map((template) => (
        <TemplateCard key={template.id} {...template} />
      ))}
    </div>
  );
};

export default TemplateList;
