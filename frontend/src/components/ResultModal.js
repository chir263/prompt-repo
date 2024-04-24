import "../css/App.css";
import { useEffect, useRef } from "react";
import useStore from "../hooks/useStore";
import MDEditor from "@uiw/react-md-editor";

const ResultModal = () => {
  const promptRef = useRef(null);
  const result = useStore((state) => state.result);
  const setResult = useStore((state) => state.setResult);
  const setResultBoxVisible = useStore((state) => state.setResultBoxVisible);

  useEffect(() => {
    if (promptRef.current) {
      promptRef.current.value = result;
      promptRef.current.rows = 1;
      promptRef.current.rows = Math.ceil(promptRef.current.scrollHeight / 20);
    }
  }, [result]);

  return (
    <div className="host-req absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 h-full flex items-center justify-center z-1150">
      <div className="flex flex-col bg-gray-200 h-auto w-4/5 add-lab-container p-2">
        <div className="flex flex-row">
          <h2 className="flex-1 flex flex-row text-2xl text-gray-600 mt-0 items-center">
            {`Result`}
          </h2>
          <span
            className="text-2xl cursor-pointer hover:text-red-600 active:text-red-800"
            onClick={() => setResultBoxVisible(false)}
          >
            &times;
          </span>
        </div>
        <div data-color-mode="light">
          <MDEditor
            value={result}
            preview="preview"
            height={result === "" ? 50 : 500}
            onChange={(val) => setResult(val)}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
