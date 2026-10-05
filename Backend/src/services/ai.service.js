const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = {
  type: "object",
  properties: {
    matchScore: {
      type: "number",
      description:
        "A score between 0 and 100 indicating how well the candidate's profile matches the job description.",
      minimum: 0,
      maximum: 100,
    },

    technicalQuestions: {
      type: "array",
      minItems: 5,
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
          },
          intention: {
            type: "string",
          },
          answer: {
            type: "string",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },

    behavioralQuestions: {
      type: "array",
      minItems: 5,
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
          },
          intention: {
            type: "string",
          },
          answer: {
            type: "string",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },

    skillGaps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          skill: {
            type: "string",
          },
          severity: {
            type: "string",
            enum: ["low", "medium", "high"],
          },
        },
        required: ["skill", "severity"],
      },
    },

    preparationPlan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: {
            type: "integer",
          },
          focus: {
            type: "string",
          },
          tasks: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        required: ["day", "focus", "tasks"],
      },
    },

    title:{
      type:"string",
      description:"The title of the job for which the interview report is generated"
    }
  },

  required: [
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
    "title"
  ],
};

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `You are an experienced technical interviewer.
                  Analyze the candidate's resume, self-description, and the job description.
                  Generate a structured interview preparation report.
                  Requirements:
                  - Calculate a realistic match score from 0 to 100.
                  - Generate technical questions specifically relevant to the candidate's skills
                    and the job requirements.
                  - Generate behavioral questions relevant to the candidate's experience.
                  - Identify genuine skill gaps by comparing the candidate against the job description.
                  - Assign each skill gap a severity of low, medium, or high.
                  - Create a practical day-wise preparation plan.
                  - Do not invent experience, projects, or skills that are not present in the candidate's information.
                  - Keep the questions appropriate for the candidate's experience level.
                    Candidate Resume:
                    ${resume}
                    Candidate Self Description:
                    ${selfDescription}
                    Job Description:
                    ${jobDescription}
                    `;

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: interviewReportSchema,
    },
  });

  const report = JSON.parse(response.text);

  return report;
}

module.exports = generateInterviewReport;
