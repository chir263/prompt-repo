import "./css/index.css";
import "./css/App.css";
import {
  NavBar,
  PromptTemplateComponent,
  PromptPreviewComponent,
} from "./components";
import { useEffect, useRef } from "react";
import { USER_API } from "./utils/config_data";
import useStore from "./hooks/useStore";
import { get } from "./utils/requests";
import { Tree } from "react-arborist";
import { getPromptTree } from "./utils/config_data";
import Node from "./components/TreeNode";

function Main() {
  const setUser = useStore((state) => state.setUser);
  const accessToken = useStore((state) => state.accessToken);
  const promptTree = useStore((state) => state.promptTree);
  const setPromptTree = useStore((state) => state.setPromptTree);
  const currentPrompt = useStore((state) => state.currentPrompt);
  const promptRef = useRef(null);
  const textRef = useRef(null);

  const getPrompt = () => {
    let prompt = currentPrompt?.master_prompt || "";
    prompt += "\n\n";
    prompt += currentPrompt.prompt?.prompt_template || "";

    Object.keys(currentPrompt.prompt?.placeholders || {}).forEach((key) => {
      const value = currentPrompt.prompt.placeholders[key];
      prompt = prompt.replaceAll("{" + key + "}", value);
    });

    return prompt || "";
  };

  useEffect(() => {
    if (promptRef.current && textRef.current) {
      promptRef.current.value = getPrompt();
      promptRef.current.rows = 1;
      promptRef.current.rows = Math.ceil(promptRef.current.scrollHeight / 20);

      textRef.current.rows = 1;
      textRef.current.rows = Math.ceil(textRef.current.scrollHeight / 20);
    }
  }, [currentPrompt]);

  useEffect(() => {
    async function fetchData() {
      const response = await get(USER_API, accessToken);
      setUser(response);
      const prompT = await getPromptTree();
      setPromptTree(prompT);
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <div className="flex">
        <NavBar />
      </div>
      <div className="flex flex-1 flex-row flex-block overflow-hidden">
        <div className="flex w-1/5 bg-gray-200 overflow-y-hidden p-2">
          <Tree
            data={promptTree}
            openByDefault={false}
            indent={12}
            rowHeight={35}
          >
            {Node}
          </Tree>
        </div>
        <div className="flex flex-col w-2/5 p-2 border-r border-gray-300 h-full overflow-auto">
          {currentPrompt.directory ? (
            <PromptTemplateComponent textRef={textRef} />
          ) : (
            <span className="text-2xl text-gray-600">{"Select a prompt"}</span>
          )}
        </div>
        <div className="flex flex-col w-2/5 p-2">
          <PromptPreviewComponent promptRef={promptRef} />
        </div>
      </div>
    </div>
  );
}

export default Main;
