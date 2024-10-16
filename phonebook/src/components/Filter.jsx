const Filter = ({ showFound, handleFoundChange }) => {
    return (
      <div>
        filter shown with
        <input value={showFound} onChange={handleFoundChange} />
      </div>
    );
  };

  export default Filter