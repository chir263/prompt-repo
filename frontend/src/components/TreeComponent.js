import PromptIcon from "../media/prompt.png";
import RepoIcon from "../media/server.png";
import { post } from "../utils/requests";
import { PROMPT_API } from "../utils/config_data";
import useStore from "../hooks/useStore";
import { MdAddCircle, MdDelete } from "react-icons/md";

const isLeaf = (node) => !node.children || node.children.length === 0;

const TreeNode = ({ node, depth }) => {
  const currentPrompt = useStore((state) => state.currentPrompt);
  const setCurrentPrompt = useStore((state) => state.setCurrentPrompt);
  const setPromptTree = useStore((state) => state.setPromptTree);
  const promptTree = useStore((state) => state.promptTree);
  const role = useStore((state) => state.role);

  const getNodeStyle = (node) => {
    console.log(node.name, currentPrompt.prompt.name);
    console.log(node.file, currentPrompt.file);
    if (
      node.name.toLowerCase() ===
        (currentPrompt.prompt || { name: "" }).name.toLowerCase() &&
      node.file === currentPrompt.file
    ) {
      return "prompt-style selected cursor-default	";
    }
    return isLeaf(node)
      ? "prompt-style cursor-default	"
      : "dir-style cursor-default	";
  };

  const getAddButton = (node_) => {
    if (role !== "admin") return null;

    if (node_.type === "category") {
      return (
        <button
          className="float-end"
          onClick={async (e) => {
            e.stopPropagation();
            await addPromptTemplate(node_);
            // alert("Add prompt template");
          }}
        >
          <MdAddCircle className="text-xl hover:text-gray-200" />
        </button>
      );
    }
    return null;
  };

  const getDeleteButton = (node_) => {
    if (role !== "admin") return null;

    if (node_.type === "prompt") {
      return (
        <button
          className="float-end"
          onClick={async (e) => {
            e.stopPropagation();
            await deletePromptTemplate(node_);
            // alert("Add prompt template");
          }}
        >
          <MdDelete className="text-xl hover:text-gray-200" />
        </button>
      );
    }
    return null;
  };

  const openPrompt = async (node) => {
    let response = await post(PROMPT_API + "/get_prompt", {
      prompt_file: node.file,
      prompt_name: node.name,
    });
    response.directory = node.directory;
    response.category = node.category;
    response.file = node.file;
    console.log(response);
    setCurrentPrompt(response);
  };

  const toggledTree = (node, id) => {
    if (node.id === id) {
      node.isOpen = !node.isOpen;
      return node;
    }
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        node.children[i] = toggledTree(node.children[i], id);
      }
    }
    return node;
  };

  const addLeaf = (node, id, leaf) => {
    if (node.id === id) {
      if (node.children) {
        node.children.push(leaf);
        node.isOpen = true;
      }
      return node;
    }
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        node.children[i] = addLeaf(node.children[i], id, leaf);
      }
    }
    return node;
  };

  const deleteLeaf = (node, id, leaf) => {
    if (node.children) {
      let temp = [];
      for (let i = 0; i < node.children.length; i++) {
        if (node.children[i].id !== id) {
          node.children[i] = deleteLeaf(node.children[i], id, leaf);
          temp.push(node.children[i]);
        }
      }
      node.children = temp;
    }
    return node;
  };

  const addPromptTemplate = async (node_) => {
    const name = prompt("Please enter your Prompt Template Name:");
    if (name != null && name.trim() !== "") {
      const children = node_.children || [];
      for (let i = 0; i < children.length; i++) {
        if (children[i].name.toLowerCase() === name.toLowerCase()) {
          alert("Prompt already exists");
          return;
        }
      }

      const resp = await post(PROMPT_API + "/add_prompt_template", {
        category_file: node_.file,
        template_name: name,
        dir_name: node_.directory,
      });

      if (resp.status === "success") {
        alert("Prompt Template added successfully");
        let newTree = JSON.parse(JSON.stringify(promptTree));
        newTree = addLeaf(newTree, node_.id, {
          name: name,
          id: Math.random().toString(36).substr(2, 9),
          isLeaf: true,
          type: "prompt",
          file: node_.file,
          directory: node_.directory,
          category: node.name,
        });

        setPromptTree(newTree);
      }
    }
  };

  const deletePromptTemplate = async (node_) => {
    const conf = window.confirm(
      "Are you sure you want to delete this prompt template?"
    );
    if (!conf) return;

    const resp = await post(PROMPT_API + "/delete_prompt_template", {
      category_file: node_.file,
      template_name: node.name,
      dir_name: node_.directory,
    });

    if (resp.status === "success") {
      alert("Prompt Template deleted successfully");
      let newTree = JSON.parse(JSON.stringify(promptTree));
      newTree = deleteLeaf(newTree, node_.id);

      setPromptTree(newTree);
    }
  };

  return (
    <div
      style={{
        marginLeft: `${depth * 5}px`,
      }}
    >
      <div
        className={`${getNodeStyle(node)}`}
        onClick={() => {
          let newTree = JSON.parse(JSON.stringify(promptTree));
          setPromptTree(toggledTree(newTree, node.id));
          if (node.type === "prompt") {
            openPrompt(node);
          }
        }}
      >
        <img
          src={isLeaf(node) ? PromptIcon : RepoIcon}
          alt="prompt"
          className="w-5 h-5 mr-2"
        />
        <span className="node-name">{node.name}</span>
        {getAddButton(node)}
        {getDeleteButton(node)}
      </div>
      {node.children && node.isOpen && (
        <div className="children">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const TreeComponent = ({ data }) => {
  return (
    <div className="w-full mb-2 pb-2">
      {data.children.map((node) => (
        <TreeNode key={node.id} node={node} depth={1} />
      ))}
    </div>
  );
};
