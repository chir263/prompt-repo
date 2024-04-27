import { create } from "zustand";

const useStore = create((set) => ({
  user: {},
  setUser: (newUser) => set({ user: newUser }),
  accessToken: "",
  setAccessToken: (newAccessToken) => set({ accessToken: newAccessToken }),
  promptTree: [],
  setPromptTree: (newPromptTree) => set({ promptTree: newPromptTree }),
  currentPrompt: {
    master_prompt: "",
    prompt: { name: "", prompt_template: "" },
  },
  setCurrentPrompt: (newCurrentPrompt) =>
    set({ currentPrompt: newCurrentPrompt }),

  result: "Nothing",
  setResult: (newResult) => set({ result: newResult }),

  isResultBoxVisible: false,
  setResultBoxVisible: (newResultBoxVisible) =>
    set({ isResultBoxVisible: newResultBoxVisible }),

  promptLoading: false,
  setPromptLoading: (newPromptLoading) =>
    set({ promptLoading: newPromptLoading }),

  role: "user",
  setRole: (newRole) => set({ role: newRole }),

  screenLoader: false,
  setScreenLoader: (newScreenLoader) => set({ screenLoader: newScreenLoader }),
}));

export default useStore;
