import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import ResumePreview from "../components/ResumePreview";
import { ArrowLeftIcon } from "lucide-react";
import api from "../config/api.js";

const Preview = () => {
  const { resumeId } = useParams();

  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadResume = async () => {
    try {
      const { data } = await api.get("/api/resumes/public/" + resumeId);
      setResumeData(data.resume);
    } catch (error) {
      console.error("Error loading resume:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return resumeData ? (
    <div className="bg-slate-100">
      <div className="max-w-3xl mx-auto py-10">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accentColor}
          classes="py-4 bg-white"
        />
      </div>
    </div>
  ) : (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-center text-6xl text-slate-400 font-medium">
            Resume not found
          </p>
          <a
            href="/"
            className="mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-green-400 flex items-center transition-colors"
          >
            <ArrowLeftIcon className="mr-2 size-4" />
            Go Back Home
          </a>
        </div>
      )}
    </div>
  );
};

export default Preview;
