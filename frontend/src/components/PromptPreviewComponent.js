import React from "react";
import useStore from "../hooks/useStore";

const PromptPreviewComponent = ({ promptRef }) => {
  const currentPrompt = useStore((state) => state.currentPrompt);
  return (
    <>
      <span className="text-2xl text-gray-600">{"Prompt Preview"}</span>
      {currentPrompt?.prompt?.prompt_template !== "" ? (
        <textarea
          className="flex flex-col p-2 border border-gray-300 bg-gray-100"
          ref={promptRef}
          contentEditable={false}
          readOnly
        />
      ) : null}
    </>
  );
};

export default PromptPreviewComponent;
