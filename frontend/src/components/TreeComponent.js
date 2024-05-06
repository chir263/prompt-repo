import PromptIcon from "../media/prompt.png";
import RepoIcon from "../media/server.png";
import { post } from "../utils/requests";
import { PROMPT_API } from "../utils/config_data";
import useStore from "../hooks/useStore";
import { MdAddCircle, MdDelete } from "react-icons/md";

// const isLeaf = (node) => !node.children || node.children.length === 0;

const TreeNode = ({ node, depth }) => {
  const currentPrompt = useStore((state) => state.currentPrompt);
  const setCurrentPrompt = useStore((state) => state.setCurrentPrompt);
  const setPromptTree = useStore((state) => state.setPromptTree);
  const promptTree = useStore((state) => state.promptTree);
  const role = useStore((state) => state.role);
  const setScreenLoader = useStore((state) => state.setScreenLoader);

  const getNodeStyle = (node) => {
    const isCurrentPrompt = (node_) => {
      return (
        node_.name.toLowerCase() ===
          (currentPrompt.prompt || { name: "" }).name.toLowerCase() &&
        currentPrompt.directory === node_.directory &&
        currentPrompt.category === node_.category
      );
    };

    if (isCurrentPrompt(node)) {
      return "prompt-style selected cursor-default	";
    }
    if (node.type === "directory")
      return "dir-style bg-gray-500 cursor-default	";
    if (node.type === "template") return "prompt-style cursor-default	";
    if (node.type === "category") return "dir-style bg-gray-400 cursor-default	";
  };

  const getAddButton = (node_) => {
    if (role.toLowerCase() !== "admin") return null;

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
    } else if (node_.type === "directory") {
      return (
        <button
          className="float-end"
          onClick={async (e) => {
            e.stopPropagation();
            await addPromptCategory(node_);
          }}
        >
          <MdAddCircle className="text-xl hover:text-gray-200" />
        </button>
      );
    }
    return null;
  };

  const addPromptCategory = async (node_) => {
    const dir_name = node_.name;
    const category_name = prompt("Please enter your Category Name:");
    if (category_name != null && category_name.trim() !== "") {
      if (category_name.includes(",")) {
        alert("Category name cannot contain commas");
        return;
      }
      try {
        setScreenLoader(true);

        const response = await post(PROMPT_API + "/create_prompt_category", {
          dir_name: dir_name,
          category_name: category_name,
        });

        if (response.status === "success") {
          alert("Category created successfully");
          let newTree = JSON.parse(JSON.stringify(promptTree));
          for (let i = 0; i < newTree.children.length; i++) {
            if (newTree.children[i].name === dir_name) {
              newTree.children[i].isOpen = true;
              newTree.children[i].children.push({
                name: category_name,
                id: Math.random().toString(36).substr(2, 9),
                isLeaf: false,
                type: "category",
                children: [],
                directory: dir_name,
              });
              break;
            }
          }

          setPromptTree(newTree);
        } else {
          alert("Error creating category: " + JSON.stringify(response));
        }
      } catch (e) {
        console.log(e);
      } finally {
        setScreenLoader(false);
      }
    }
  };

  const getDeleteButton = (node_) => {
    if (role.toLowerCase() !== "admin") return null;

    if (node_.type === "template") {
      // alert("Delete button" + JSON.stringify(node_));
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

    if (node_.type === "category") {
      // alert("Delete button" + JSON.stringify(node_));
      return (
        <button
          className="float-end"
          onClick={async (e) => {
            e.stopPropagation();
            await deletePromptCategory(node_);
            // alert("Add prompt template");
          }}
        >
          <MdDelete className="text-xl hover:text-gray-200" />
        </button>
      );
    }

    // deletePromptDirectory

    if (node_.type === "directory") {
      // alert("Delete button" + JSON.stringify(node_));
      return (
        <button
          className="float-end"
          onClick={async (e) => {
            e.stopPropagation();
            await deletePromptDirectory(node_);
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
    try {
      setScreenLoader(true);
      let response = await post(PROMPT_API + "/get_prompt", {
        prompt_dir: node.directory,
        prompt_category: node.category,
        prompt_name: node.name,
      });
      response.directory = node.directory;
      response.category = node.category;
      console.log(response);
      setCurrentPrompt(response);
    } catch (e) {
      console.log(e);
    } finally {
      setScreenLoader(false);
    }
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
      try {
        setScreenLoader(true);
        const resp = await post(PROMPT_API + "/add_prompt_template", {
          category_name: node_.name,
          template_name: name,
          dir_name: node_.directory,
          template: "Hi! I am a new prompt template.",
        });

        if (resp.status === "success") {
          alert("Prompt Template added successfully");
          let newTree = JSON.parse(JSON.stringify(promptTree));
          newTree = addLeaf(newTree, node_.id, {
            name: name,
            id: Math.random().toString(36).substr(2, 9),
            isLeaf: true,
            type: "template",
            file: node_.file,
            directory: node_.directory,
            category: node.name,
          });

          setPromptTree(newTree);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setScreenLoader(false);
      }
    }
  };

  const deletePromptTemplate = async (node_) => {
    const conf = window.confirm(
      "Are you sure you want to delete this prompt template?"
    );
    if (!conf) return;

    try {
      setScreenLoader(true);
      const resp = await post(PROMPT_API + "/delete_prompt_template", {
        category_name: node_.category,
        template_name: node.name,
        dir_name: node_.directory,
      });

      if (resp.status === "success") {
        alert("Prompt Template deleted successfully");
        let newTree = JSON.parse(JSON.stringify(promptTree));
        newTree = deleteLeaf(newTree, node_.id);

        setPromptTree(newTree);
      } else {
        alert("Error deleting prompt template: " + JSON.stringify(resp));
      }
    } catch (e) {
      console.log(e);
    } finally {
      setScreenLoader(false);
    }
  };

  const deletePromptCategory = async (node_) => {
    const conf = window.confirm(
      "Are you sure you want to delete this prompt category?"
    );
    if (!conf) return;

    const category_name = node_.name,
      dir_name = node_.directory;

    try {
      setScreenLoader(true);
      const resp = await post(PROMPT_API + "/delete_prompt_category", {
        category_name: category_name,
        dir_name: dir_name,
      });

      if (resp.status === "success") {
        alert("Prompt Category deleted successfully");
        let newTree = JSON.parse(JSON.stringify(promptTree));
        for (let i = 0; i < newTree.children.length; i++) {
          if (newTree.children[i].name === dir_name) {
            newTree.children[i].isOpen = true;
            newTree.children[i].children = newTree.children[i].children.filter(
              (c) => c.name !== category_name
            );
            break;
          }
        }
        setPromptTree(newTree);
      } else {
        alert("Error deleting prompt category: " + JSON.stringify(resp));
      }
    } catch (e) {
      console.log(e);
    } finally {
      setScreenLoader(false);
    }
  };

  const deletePromptDirectory = async (node_) => {
    const conf = window.confirm(
      "Are you sure you want to delete this prompt directory?"
    );
    if (!conf) return;

    const dir_name = node_.name;

    try {
      setScreenLoader(true);
      const resp = await post(PROMPT_API + "/delete_prompt_directory", {
        dir_name: dir_name,
      });

      if (resp.status === "success") {
        alert("Prompt Directory deleted successfully");
        let newTree = JSON.parse(JSON.stringify(promptTree));
        newTree.children = newTree.children.filter((c) => c.name !== dir_name);
        setPromptTree(newTree);
      } else {
        alert("Error deleting prompt directory: " + JSON.stringify(resp));
      }
    } catch (e) {
      console.log(e);
    } finally {
      setScreenLoader(false);
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
          if (node.type === "template") {
            openPrompt(node);
          }
        }}
      >
        <img
          src={node.type === "prompt" ? PromptIcon : RepoIcon}
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
  const setScreenLoader = useStore((state) => state.setScreenLoader);
  const setPromptTree = useStore((state) => state.setPromptTree);
  const role = useStore((state) => state.role);

  const createPromptDirectory = async () => {
    const name = prompt("Please enter Directory Name:");

    if (name != null && name.trim() !== "") {
      try {
        setScreenLoader(true);
        const response = await post(PROMPT_API + "/create_prompt_directory", {
          dir_name: name,
        });
        if (response.status === "success") {
          alert("Directory created successfully");
          let newRoot = JSON.parse(JSON.stringify(data));
          newRoot.children.push({
            name: name,
            id: Math.random().toString(36).substr(2, 9),
            isLeaf: false,
            type: "directory",
            children: [],
          });
          setPromptTree(newRoot);
        } else {
          alert("Error creating directory: " + JSON.stringify(response));
        }
      } catch (e) {
        console.log(e);
      } finally {
        setScreenLoader(false);
      }
    }
  };

  return (
    <div className="w-full mb-2 pb-2">
      {role.toLowerCase() === "admin" ? (
        <button
          className="flex flex-row text-white bg-gray-400 rounded p-1 hover:bg-gray-500 active:bg-gray-600"
          onClick={createPromptDirectory}
        >
          <MdAddCircle className="text-xl mr-1" />
          Add Directory
        </button>
      ) : null}
      {data.children.map((node) => (
        <TreeNode key={node.id} node={node} depth={1} />
      ))}
    </div>
  );
};
