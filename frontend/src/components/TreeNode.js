import PromptIcon from "../media/prompt.png";
import RepoIcon from "../media/server.png";
import { post } from "../utils/requests";
import { PROMPT_API } from "../utils/config_data";
import useStore from "../hooks/useStore";

function Node({ node, style, dragHandle }) {
  const currentPrompt = useStore((state) => state.currentPrompt);
  const setCurrentPrompt = useStore((state) => state.setCurrentPrompt);

  const openPrompt = async (node) => {
    let response = await post(PROMPT_API + "/get_prompt", {
      prompt_file: node.data.file,
      prompt_name: node.data.name,
    });
    response.directory = node.data.directory;
    response.category = node.data.category;
    response.file = node.data.file;
    console.log(response);
    setCurrentPrompt(response);
  };

  const getNodeStyle = (node) => {
    console.log(node.data.file, currentPrompt.file);
    if (
      node.data.name.toLowerCase() ===
        (currentPrompt.prompt || { name: "" }).name.toLowerCase() &&
      node.data.file === currentPrompt.file
    ) {
      return "prompt-style selected";
    }
    return node.isLeaf ? "prompt-style" : "dir-style";
  };

  return (
    <div
      style={{ ...style }}
      ref={dragHandle}
      onClick={() => {
        node.toggle();
        if (node.data.type === "prompt") {
          openPrompt(node);
        }
        // alert(node.data.name);
      }}
    >
      <div className={getNodeStyle(node)}>
        <img
          src={node.isLeaf ? PromptIcon : RepoIcon}
          alt="prompt"
          className="w-5 h-5 mr-2"
        />
        {node.data.name}
      </div>
    </div>
  );
}

export default Node;
