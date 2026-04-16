function QuizCard({ quiz, actions }) {
  return (
    <article className="card">
      <div className="card-header">
        <div>
          <h3>{quiz.title}</h3>
          <p className="muted-text">{quiz.description || "No description added yet."}</p>
        </div>
        <span className="tag">{quiz.timeLimit} min</span>
      </div>

      <div className="card-meta">
        <span>{quiz.totalQuestions || 0} questions</span>
        {quiz.createdBy?.name ? <span>Teacher: {quiz.createdBy.name}</span> : null}
      </div>

      <div className="card-actions">{actions}</div>
    </article>
  );
}

export default QuizCard;
