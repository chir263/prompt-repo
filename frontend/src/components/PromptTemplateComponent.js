import React from "react";
import { MdDelete, MdSave } from "react-icons/md";
import { PROMPT_API } from "../utils/config_data";
import { post } from "../utils/requests";
import { useState } from "react";
import useStore from "../hooks/useStore";

const PromptTemplateComponent = ({ textRef }) => {
  const [placeholder, setPlaceholder] = useState("");
  const setCurrentPrompt = useStore((state) => state.setCurrentPrompt);
  const currentPrompt = useStore((state) => state.currentPrompt);
  const role = useStore((state) => state.role);
  const setScreenLoader = useStore((state) => state.setScreenLoader);

  const save = async () => {
    try {
      setScreenLoader(true);
      const response = await post(PROMPT_API + "/save_prompt", {
        prompt: currentPrompt.prompt,
        prompt_dir: currentPrompt.directory,
        prompt_category: currentPrompt.category,
        prompt_name: currentPrompt.prompt.name,
      });
      if (response.status === "success") {
        alert("Prompt saved successfully");
      } else {
        alert("Prompt could not be saved: ", JSON.stringify(response));
      }
    } catch (e) {
      console.log(e);
    } finally {
      setScreenLoader(false);
    }
  };
  return (
    <>
      {currentPrompt.directory && (
        <span className="text-2xl text-gray-600">
          {currentPrompt.directory}
          {role.toLowerCase() === "admin" ? (
            <button
              className="text-green-500 p-2 hover:text-green-800"
              onClick={save}
            >
              <MdSave />
            </button>
          ) : null}
        </span>
      )}
      {currentPrompt.category && (
        <span className="text-xl text-gray-500">
          {currentPrompt.category.toLowerCase()}
          {" / "}
          {currentPrompt.prompt.name.toLowerCase().replaceAll(/ /g, "_")}
        </span>
      )}

      <span className="text-lg text-gray-600 mt-4">{"Prompt Template"}</span>
      <div className="flex">
        {currentPrompt?.prompt?.prompt_template !== "" ? (
          <textarea
            className="flex flex-col p-2 border border-gray-300 w-full overflow-auto"
            ref={textRef}
            value={currentPrompt.prompt?.prompt_template}
            onChange={(e) => {
              e.preventDefault();
              let cp = { ...currentPrompt };
              cp.prompt.prompt_template = e.target.value || " ";
              setCurrentPrompt(cp);

              e.target.rows = 1;
              e.target.rows = Math.min(
                Math.max(Math.ceil(e.target.scrollHeight / 20), 5),
                30
              );
              console.log(e.target.rows);
            }}
          ></textarea>
        ) : null}
      </div>

      <span className="text-lg text-gray-600 mt-4">
        {"Prompt Placeholders"}
      </span>

      {Object.keys(currentPrompt?.prompt?.placeholders || {}).map(
        (key, index) => {
          return (
            <div key={index} className="flex flex-col p-2">
              <span className="text-lg text-gray-500">
                {key}
                <button
                  className="text-gray-500 p-2 hover:text-red-500"
                  onClick={() => {
                    const conf = window.confirm(
                      `Are you sure you want to delete ${key} placeholder?`
                    );
                    if (!conf) return;
                    let cp = { ...currentPrompt };
                    delete cp.prompt.placeholders[key];
                    setCurrentPrompt(cp);
                  }}
                >
                  <MdDelete />
                </button>
              </span>
              <textarea
                className="border border-gray-300 p-2"
                rows={5}
                value={currentPrompt.prompt.placeholders[key]}
                onChange={(e) => {
                  e.preventDefault();
                  let cp = { ...currentPrompt };
                  cp.prompt.placeholders[key] = e.target.value;
                  setCurrentPrompt(cp);
                }}
              />
            </div>
          );
        }
      )}

      <span className="text-lg text-gray-600 mt-4">{"Add placeholder"}</span>
      <div className="flex flex-row p-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!placeholder) return;
            let cp = { ...currentPrompt };
            cp.prompt.placeholders[placeholder] = "";
            setCurrentPrompt(cp);
          }}
        >
          <input
            className="border border-gray-300 p-2"
            placeholder="Placeholder"
            value={placeholder}
            onChange={(e) => setPlaceholder(e.target.value)}
          />

          <button className="submit-button p-2 text-white">{"Add"}</button>
        </form>
      </div>
    </>
  );
};

export default PromptTemplateComponent;
