import React from "react";
import useStore from "../hooks/useStore";
import { MdOutput } from "react-icons/md";
import { post } from "../utils/requests";
import { PROMPT_API } from "../utils/config_data";
import { getFormattedPrompt } from "../utils/config_data";
import ReactLoading from "react-loading";

const PromptPreviewComponent = ({ promptRef }) => {
  const currentPrompt = useStore((state) => state.currentPrompt);
  const setResultBoxVisible = useStore((state) => state.setResultBoxVisible);
  const setResult = useStore((state) => state.setResult);
  const setPromptLoading = useStore((state) => state.setPromptLoading);
  const promptLoading = useStore((state) => state.promptLoading);

  const run = async () => {
    if (promptLoading) return;

    setPromptLoading(true);

    const response = await post(PROMPT_API + "/generate", {
      prompt: getFormattedPrompt(currentPrompt),
    });

    setResult(response.result);
    setPromptLoading(false);
    setResultBoxVisible(true);
  };

  return (
    <>
      <span className="flex text-2xl text-gray-600">
        {"Prompt Preview"}
        <button
          className="text-sm text-gray-100 bg-gray-400 h-6 px-2 hover:bg-green-500 active:bg-green-700 ml-2"
          onClick={run}
        >
          Run
        </button>
        <button
          className="text-gray-500 p-2 hover:text-gray-700 pt-0"
          onClick={() => setResultBoxVisible(true)}
        >
          <MdOutput />
        </button>
        {promptLoading && (
          <ReactLoading
            className="ml-2"
            type="bars"
            color="#00a38a"
            height={30}
            width={30}
          />
        )}
      </span>
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
