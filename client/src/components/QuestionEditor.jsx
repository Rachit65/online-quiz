import { useState } from "react";

const initialQuestionState = {
  questionText: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
};

function QuestionEditor({ onSubmit, loading }) {
  const [formData, setFormData] = useState(initialQuestionState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleOptionChange = (index, value) => {
    setFormData((current) => {
      const updatedOptions = [...current.options];
      updatedOptions[index] = value;
      return {
        ...current,
        options: updatedOptions,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      ...formData,
      correctAnswer: Number(formData.correctAnswer),
    });
    setFormData(initialQuestionState);
  };

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <h3>Add MCQ Question</h3>

      <label>
        Question
        <textarea
          name="questionText"
          value={formData.questionText}
          onChange={handleChange}
          placeholder="Enter the question text"
          rows="3"
          required
        />
      </label>

      {formData.options.map((option, index) => (
        <label key={index}>
          Option {index + 1}
          <input
            type="text"
            value={option}
            onChange={(event) => handleOptionChange(index, event.target.value)}
            placeholder={`Enter option ${index + 1}`}
            required
          />
        </label>
      ))}

      <label>
        Correct Answer
        <select name="correctAnswer" value={formData.correctAnswer} onChange={handleChange}>
          <option value={0}>Option 1</option>
          <option value={1}>Option 2</option>
          <option value={2}>Option 3</option>
          <option value={3}>Option 4</option>
        </select>
      </label>

      <button type="submit" className="primary-button" disabled={loading}>
        {loading ? "Saving..." : "Add Question"}
      </button>
    </form>
  );
}

export default QuestionEditor;
