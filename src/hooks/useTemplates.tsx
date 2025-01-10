import { useEffect, useState } from "react";
import { Template } from "../interface/template";
import { handleGetAllTemplates } from "../services/templates";

export default function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleSetTemplates();
  }, []);

  const handleSetTemplates = async () => {
    setIsLoading(true);
    const templates = await handleGetAllTemplates();
    setTemplates(templates);
    setIsLoading(false);
  };

  return { templates, isLoading };
}
