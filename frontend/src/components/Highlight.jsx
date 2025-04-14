import React from 'react';

const Highlight = ({ text, highlight }) => {
  if (!highlight.trim()) {
    return <>{text}</>;
  }
  
  // Create a regular expression for the search term (case-insensitive)
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} style={{ backgroundColor: 'yellow' }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

export default Highlight;
