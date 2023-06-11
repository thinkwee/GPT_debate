import { translate } from "@docusaurus/Translate";
import { sortBy } from "@site/src/utils/jsUtils";
import { User, TagType, Tag } from './User.d';
import UsersData from "./debate.json";

export const Tags: { [type in TagType]: Tag } = {
  multi_sentences: {
    label: translate({ message: "多句辩论" }),
    description: translate({
      message: "多句辩论",
      id: "showcase.tag.multi_sentences.description",
    }),
    color: "#ce2d71",
  },

  single_sentence: {
    label: translate({ message: "单句辩论" }),
    description: translate({
      message: "单句辩论",
      id: "showcase.tag.single_sentence.description",
    }),
    color: "#ff7f04",
  },

  GPT4: {
    label: translate({ message: "GPT4" }),
    description: translate({
      message: "GPT4",
      id: "showcase.tag.GPT4.description",
    }),
    color: "#c1db3c",
  },
  
  ChatGPT: {
    label: translate({ message: "ChatGPT" }),
    description: translate({
      message: "ChatGPT",
      id: "showcase.tag.ChatGPT.description",
    }),
    color: "#a0c3d9",
  },

  counterfactual: {
    label: translate({ message: "反事实" }),
    description: translate({
      message: "反事实",
      id: "showcase.tag.counterfactual.description",
    }),
    color: "#f6d000",
  },

  hightemp: {
    label: translate({ message: "高温度" }),
    description: translate({
      message: "高温度",
      id: "showcase.tag.hightemp.description",
    }),
    color: "#a7db07",
  },
};

const Users: User[] = UsersData as User[];
export const TagList = Object.keys(Tags) as TagType[];
function sortUsers() {
  let result = Users;
  // Sort by prompt weight
  result = sortBy(result, (user) => -user.weight);
  // Sort by prompt title
  result = sortBy(result, (user) => user.title.toLowerCase());
  // Sort by favorite tag, favorites first
  result = sortBy(result, (user) => !user.tags.includes("favorite"));
  return result;
}

export const sortedUsers = sortUsers();
