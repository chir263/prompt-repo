import "./css/index.css";
import "./css/App.css";
import {
  NavBar,
  PromptTemplateComponent,
  PromptPreviewComponent,
  ResultModal,
  TreeComponent,
  ScreenLoader,
} from "./components";

import { useEffect, useRef } from "react";
import { USER_API } from "./utils/config_data";
import useStore from "./hooks/useStore";
import { get } from "./utils/requests";
import { getPromptTree, getFormattedPrompt } from "./utils/config_data";

const preeprocessTree = (tree) => {
  for (let i = 0; i < tree.length; i++) {
    // preprocess code here
    tree[i].isOpen = false;

    if (tree[i].children) {
      tree[i].children = preeprocessTree(tree[i].children);
    }
  }
  return tree;
};

function Main() {
  const setUser = useStore((state) => state.setUser);
  const accessToken = useStore((state) => state.accessToken);
  const promptTree = useStore((state) => state.promptTree);
  const setPromptTree = useStore((state) => state.setPromptTree);
  const currentPrompt = useStore((state) => state.currentPrompt);
  const isResultBoxVisible = useStore((state) => state.isResultBoxVisible);
  const setRole = useStore((state) => state.setRole);
  const screenLoader = useStore((state) => state.screenLoader);
  const setScreenLoader = useStore((state) => state.setScreenLoader);
  const promptRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (promptRef.current && textRef.current) {
      promptRef.current.value = getFormattedPrompt(currentPrompt);
      promptRef.current.rows = 1;
      promptRef.current.rows = Math.ceil(promptRef.current.scrollHeight / 20);

      textRef.current.rows = 1;
      textRef.current.rows = Math.ceil(textRef.current.scrollHeight / 20);
    }
  }, [currentPrompt]);

  useEffect(() => {
    async function fetchData() {
      try {
        setScreenLoader(true);
        // alert("fetching data");
        const response = await get(USER_API, accessToken);
        setUser(response);
        let [prompT, role] = await getPromptTree();
        setRole(role);

        const tree = {
          id: "root",
          name: "root",
          children: prompT,
        };

        setPromptTree(preeprocessTree(tree));
      } catch (e) {
        console.log(e);
      } finally {
        setScreenLoader(false);
      }
    }
    fetchData();
  }, []);

  console.log(promptTree);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {screenLoader ? <ScreenLoader /> : null}
      {isResultBoxVisible && <ResultModal />}
      <div className="flex">
        <NavBar />
      </div>
      <div className="flex flex-1 flex-row flex-block overflow-hidden">
        <div className="flex w-1/5 bg-gray-200 overflow-x-hidden overflow-y-auto p-2">
          {promptTree.children ? <TreeComponent data={promptTree} /> : null}
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
