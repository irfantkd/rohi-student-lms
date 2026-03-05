import React, { useState, useEffect } from "react";
import { useGetQuery, usePostMutation } from "../../../api/apiSlice";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const FeedBackForm = () => {
  const [responses, setResponses] = useState({});
  const [hoveredQuestion, setHoveredQuestion] = useState(null);
  const [hoveredValue, setHoveredValue] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetQuery({
    path: `/user/classes/${id}/feedback`,
  });

  const [submitFeedback, { isLoading: isSubmitting }] = usePostMutation();

  const questions = data?.questions || [];
  console.log(data);

  useEffect(() => {
    const initialResponses = {};
    questions.forEach((q) => {
      initialResponses[q.id] = null;
    });
    setResponses(initialResponses);
  }, [questions]);

  // Check if all questions are answered
  const allQuestionsAnswered =
    questions.length > 0 &&
    questions.every(
      (q) => responses[q.id] !== null && responses[q.id] !== undefined
    );

  const handleRatingChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    // Filter out unanswered questions and prepare feedback data
    const feedbackData = Object.entries(responses)
      .filter(([_, value]) => value !== null)
      .map(([questionId, answerValue]) => ({
        question_id: parseInt(questionId),
        answer_value: parseInt(answerValue),
      }));

    if (feedbackData.length === 0) {
      toast.error("Please answer at least one question");
      return;
    }

    if (feedbackData.length < questions.length) {
      toast.warning("Please answer all questions before submitting");
      return;
    }

    // Prepare the payload to send to API
    const payload = {
      student_class_id: data?.student_class_id,
      feedback: feedbackData,
    };

    try {
      const response = await submitFeedback({
        path: "/user/feedback",
        body: payload,
      });
      if (response.error) {
        toast.error(
          response?.error?.data?.message || "Feedback submitted Faild!"
        );
      } else {
        // Reset all responses
        toast.success(
          response?.data?.message || "Feedback submitted Successfully!"
        );
        const resetResponses = {};
        questions.forEach((q) => {
          resetResponses[q.id] = null;
        });

        setResponses(resetResponses);

        // Navigate to dashboard/courses after 1.5 seconds
        navigate("/dashboard/courses");
      }
    } catch (error) {
      console.error("❌ Error submitting feedback:", error);
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Failed to submit feedback. Please try again."
      );
    }
  };

  const handleClearAll = () => {
    const resetResponses = {};
    questions.forEach((q) => {
      resetResponses[q.id] = null;
    });
    setResponses(resetResponses);
    toast.info("All responses cleared");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "#31918D", borderTopColor: "transparent" }}
          ></div>
          <p className="text-gray-600">Loading feedback form...</p>
        </div>
      </div>
    );
  }

  if (!data || !questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">
            {`${data.message}` || " No feedback questions available"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: "#014376" }}
            >
              Student Feedback Form
            </h1>
            <p className="text-gray-600">
              Please rate your experience on a scale of 1 to 10
            </p>
            {questions.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Answered:{" "}
                {Object.values(responses).filter((v) => v !== null).length} /{" "}
                {questions.length}
              </p>
            )}
          </div>

          <div className="space-y-8">
            {questions?.map((question, index) => (
              <div
                key={question.id}
                className="pb-6 border-b border-gray-200 last:border-b-0"
              >
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-800 mb-2">
                    {index + 1}. {question.question}
                    {responses[question.id] === null && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {question.description && (
                    <p className="text-sm text-gray-500">
                      {question.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 mr-2">1</span>
                  <div className="flex gap-2 flex-1 justify-center">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleRatingChange(question.id, value)}
                        onMouseEnter={() => {
                          setHoveredQuestion(question.id);
                          setHoveredValue((prev) => ({
                            ...prev,
                            [question.id]: value,
                          }));
                        }}
                        onMouseLeave={() => {
                          setHoveredQuestion(null);
                          setHoveredValue((prev) => ({
                            ...prev,
                            [question.id]: null,
                          }));
                        }}
                        className="w-12 h-12 rounded-lg border-2 flex items-center justify-center font-semibold transition-all duration-200 hover:scale-110"
                        style={{
                          backgroundColor:
                            responses[question.id] === value
                              ? "#31918D"
                              : hoveredQuestion === question.id &&
                                hoveredValue[question.id] >= value
                              ? "#31918D40"
                              : "white",
                          borderColor:
                            responses[question.id] === value ||
                            (hoveredQuestion === question.id &&
                              hoveredValue[question.id] >= value)
                              ? "#31918D"
                              : "#e5e7eb",
                          color:
                            responses[question.id] === value
                              ? "white"
                              : "#014376",
                        }}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">10</span>
                </div>

                {responses[question.id] && (
                  <div
                    className="mt-2 text-sm text-center font-medium"
                    style={{ color: "#31918D" }}
                  >
                    Selected: {responses[question.id]}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={handleClearAll}
              className="px-6 py-3 rounded-lg border-2 font-semibold transition-all hover:bg-gray-50"
              style={{
                borderColor: "#014376",
                color: "#014376",
              }}
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !allQuestionsAnswered}
              className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#31918D",
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>

          {!allQuestionsAnswered && questions.length > 0 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-red-500">
                Please answer all questions to submit the feedback
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedBackForm;
