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
}));

export default useStore;
