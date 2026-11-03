/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
} from "../services/inerview.api";
import { useContext, useEffect, useState, useCallback } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  const { interviewId } = useParams();
  const [reportsLoading, setReportsLoading] = useState(false);

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);
    try {
      const response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      setReport(response.interviewReport);
      return { success: true, data: response.interviewReport };
    } catch (err) {
      console.error("generateReport error:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to generate report. Please try again.";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const getReportById = useCallback(async (interviewId) => {
    setLoading(true);
    try {
      const response = await getInterviewReportById(interviewId);
      setReport(response.interviewReport);
      return response.interviewReport;
    } catch (err) {
      console.log(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getReports = async () => {
    setReportsLoading(true);
    try {
      const response = await getAllInterviewReports();
      setReports(response.interviewReports);
      return response.interviewReports;
    } catch (err) {
      console.log(err);
      return [];
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReports();
    }
  }, [interviewId]);

  return {
    loading,
    reportsLoading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
  };
};
