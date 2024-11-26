import React from "react";
import { GetServerSideProps } from "next";
import axios from "axios";
import TemplateDetailPage from "@/components/templates/template-details";

// Types remain the same as in previous example
interface Tag {
  id: number;
  name: string;
}

interface Code {
  id: number;
  filePath: string;
  language: string;
  content: string;
}

interface Author {
  id: number;
  username: string;
}

interface TemplateDetail {
  id: number;
  title: string;
  explanation: string;
  code: Code;
  tags: Tag[];
  author: Author;
}

interface TemplateDetailProps {
  template: TemplateDetail;
  error?: string;
}

const TemplateDetailServerPage: React.FC<TemplateDetailProps> = ({
  template,
  error,
}) => {
  // If there's an error, pass it to the component
  if (error) {
    return <div className="error-page">Error: {error}</div>;
  }

  // Render the TemplateDetailPage with the fetched template
  return <TemplateDetailPage template={template} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};

  try {
    // dont need this
    // const token = localStorage.getItem("accessToken");

    // Fetch template details from your API
    // had the header included before, but is not needed for getting one template
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/templates/${id}`
    );

    return {
      props: {
        template: response.data,
      },
    };
  } catch (error) {
    console.error("Error fetching template details:", error);

    return {
      props: {
        error: "Failed to load template details",
        template: null,
      },
    };
  }
};

export default TemplateDetailServerPage;
