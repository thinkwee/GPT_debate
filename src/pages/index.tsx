import React, {
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import clsx from "clsx";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import Translate, { translate } from "@docusaurus/Translate";
import { useHistory, useLocation } from "@docusaurus/router";
import { usePluralForm } from "@docusaurus/theme-common";
import { debounce } from "lodash";

//import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import FavoriteIcon from "@site/src/components/svgIcons/FavoriteIcon";
import {
  sortedUsers,
  Tags,
  TagList,
  type User,
  type TagType,
} from "@site/src/data/users";
import Heading from "@theme/Heading";
import ShowcaseTagSelect, {
  readSearchTags,
} from "./_components/ShowcaseTagSelect";
import ShowcaseFilterToggle, {
  type Operator,
  readOperator,
} from "./_components/ShowcaseFilterToggle";
import ShowcaseTooltip from "./_components/ShowcaseTooltip";
import ShowcaseCard from "./_components/ShowcaseCard";
import UserStatus from "./_components/UserStatus";
import UserPrompts from "./_components/UserPrompts";
import { AuthContext, AuthProvider } from './_components/AuthContext';
import Cookies from "js-cookie";
import { fetchAllCopyCounts} from "@site/src/api";

import styles from "./styles.module.css";

const TITLE = translate({
  message:
    "GPT Debate",
});
const DESCRIPTION = translate({
  message: "powered by ChatGPT-Shortcut",
});
const SUBMIT_URL =
  "https://github.com/rockbenben/ChatGPT-Shortcut/discussions/11";

type UserState = {
  scrollTopPosition: number;
  focusedElementId: string | undefined;
};

function restoreUserState(userState: UserState | null) {
  const { scrollTopPosition, focusedElementId } = userState ?? {
    scrollTopPosition: 0,
    focusedElementId: undefined,
  };
  // @ts-expect-error: if focusedElementId is undefined it returns null
  document.getElementById(focusedElementId)?.focus();
  window.scrollTo({ top: scrollTopPosition });
}

export function prepareUserState(): UserState | undefined {
  if (ExecutionEnvironment.canUseDOM) {
    return {
      scrollTopPosition: window.scrollY,
      focusedElementId: document.activeElement?.id,
    };
  }

  return undefined;
}

const SearchNameQueryKey = "name";

function readSearchName(search: string) {
  return new URLSearchParams(search).get(SearchNameQueryKey);
}

function filterUsers(
  users: User[],
  selectedTags: TagType[],
  operator: Operator,
  searchName: string | null
) {
  if (searchName) {
    const lowercaseSearchName = searchName.toLowerCase();
    // eslint-disable-next-line no-param-reassign
    // 搜索范围
    users = users.filter((user) =>
      (
        user.title +
        user.description +
        user.desc_cn +
        user.remark +
        user.desc_en +
        user.remark_en
      )
        .toLowerCase()
        .includes(lowercaseSearchName)
    );
  }
  if (selectedTags.length === 0) {
    return users.sort((a, b) => b.weight - a.weight);
  }
  return users.filter((user) => {
    if (user.tags.length === 0) {
      return false;
    }
    if (operator === "AND") {
      return selectedTags.every((tag) => user.tags.includes(tag));
    }
    return selectedTags.some((tag) => user.tags.includes(tag));
  });
}

function useFilteredUsers() {
  const location = useLocation<UserState>();
  const [operator, setOperator] = useState<Operator>("OR");
  // On SSR / first mount (hydration) no tag is selected
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [searchName, setSearchName] = useState<string | null>(null);
  // Sync tags from QS to state (delayed on purpose to avoid SSR/Client
  // hydration mismatch)
  useEffect(() => {
    setSelectedTags(readSearchTags(location.search));
    setOperator(readOperator(location.search));
    setSearchName(readSearchName(location.search));
    restoreUserState(location.state);
  }, [location]);

  return useMemo(
    () => filterUsers(sortedUsers, selectedTags, operator, searchName),
    [selectedTags, operator, searchName]
  );
}

function ShowcaseHeader() {
  return (
    <section className="margin-top--lg margin-bottom--lg text--center">
      <Heading as="h1">GPT Debate</Heading>
      <p>{DESCRIPTION}</p>
      <UserStatus />
    </section>
  );
}

function useSiteCountPlural() {
  const { selectMessage } = usePluralForm();
  return (sitesCount: number) =>
    selectMessage(
      sitesCount,
      translate(
        {
          id: "showcase.filters.resultCount",
          description:
            'Pluralized label for the number of sites found on the showcase. Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: "{sitesCount} prompts",
        },
        { sitesCount }
      )
    );
}

function ShowcaseFilters({ onToggleDescription }) {
  //通过登陆用户名判断是否开启用户标签按钮
  const [showUserPrompts, setShowUserPrompts] = useState(false);
  const handleClick = () => {
    setShowUserPrompts(!showUserPrompts);
  }
  const [username, setUsername] = useState(null);
  useEffect(() => {
    const cookieUsername = Cookies.get("username");
    setUsername(cookieUsername || null);
  }, []);

  const filteredUsers = useFilteredUsers();
  const siteCountPlural = useCallback(useSiteCountPlural(), []);
  const { i18n } = useDocusaurusContext();
  const currentLanguage = i18n.currentLocale;
  return (
    <section className="container margin-top--l margin-bottom--lg">
      <div className={clsx("margin-bottom--sm", styles.filterCheckbox)}>
        <div>
          <Heading as="h2">
            <Translate id="showcase.filters.title">Filters</Translate>
          </Heading>
          <span>{siteCountPlural(filteredUsers.length)}</span>
        </div>
        {currentLanguage === "zh-Hans" && (
          <button
            onClick={onToggleDescription}
            className={styles.onToggleButton}
            title="展开所有Debate"
          >
            展开所有Debate
          </button>
        )}
        <ShowcaseFilterToggle />
      </div>
      <ul className={clsx("clean-list", styles.checkboxList)}>
        {/* 登陆用户标签按钮 */}
        {username && (
        <li className={styles.checkboxListItem} onClick={handleClick}>
          <ShowcaseTooltip
            text={translate({
              message: "个人提示词",
            })}
            anchorEl="#__docusaurus"
          >
            <ShowcaseTagSelect
              tag="yourprompt"
              label={translate({
                message: "你的提示词",
              })}
              icon={
                (
                  <span
                    style={{
                      backgroundColor: "#a2222a",
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      marginLeft: 8,
                    }}
                  />
                )
              }
            />
          </ShowcaseTooltip>
        </li>)}
        {TagList.map((tag, i) => {
          const { label, description, color } = Tags[tag];
          const id = `showcase_checkbox_id_${tag}`;

          return (
            <li key={i} className={styles.checkboxListItem}>
              <ShowcaseTooltip
                id={id}
                text={description}
                anchorEl="#__docusaurus"
              >
                <ShowcaseTagSelect
                  tag={tag}
                  id={id}
                  label={label}
                  icon={
                    tag === "favorite" ? (
                      <FavoriteIcon svgClass={styles.svgIconFavoriteXs} />
                    ) : (
                      <span
                        style={{
                          backgroundColor: color,
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          marginLeft: 8,
                        }}
                      />
                    )
                  }
                />
              </ShowcaseTooltip>
            </li>
          );
        })}
      </ul>
      {showUserPrompts && <UserPrompts />}
    </section>
  );
}

function SearchBar() {
  const history = useHistory();
  const location = useLocation();

  const { i18n } = useDocusaurusContext();
  const currentLanguage = i18n.currentLocale;
  const [value, setValue] = useState<string | null>(null);
  useEffect(() => {
    setValue(readSearchName(location.search));
  }, [location]);

  useEffect(() => {
    const searchbar = document.getElementById("searchbar");
    if (searchbar) {
      searchbar.focus();
    }
  }, [value]);

  const updateSearch = useCallback(
    debounce((searchValue: string) => {
      const newSearch = new URLSearchParams(location.search);
      newSearch.delete(SearchNameQueryKey);
      if (searchValue) {
        newSearch.set(SearchNameQueryKey, searchValue);
      }
      history.push({
        ...location,
        search: newSearch.toString(),
        state: prepareUserState(),
      });
    }, 1000), //搜索延时
    [location, history]
  );

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (
      currentLanguage === "zh-Hans" &&
      (window.innerWidth >= 768 ||
        (typeof chrome !== "undefined" && chrome.extension))
    ) {
      // PC 端或插件版
      setValue(e.currentTarget.value);
      updateSearch(e.currentTarget.value);
    } else {
      // 移动端
      setValue(e.currentTarget.value);
      const newSearch = new URLSearchParams(location.search);
      newSearch.delete(SearchNameQueryKey);
      if (e.currentTarget.value) {
        newSearch.set(SearchNameQueryKey, e.currentTarget.value);
      }
      history.push({
        ...location,
        search: newSearch.toString(),
        state: prepareUserState(),
      });
    }
  };

  return (
    <div className={styles.searchContainer}>
      <input
        id="searchbar"
        placeholder={translate({
          message: "Search for prompts...",
          id: "showcase.searchBar.placeholder",
        })}
        value={value ?? undefined}
        onInput={handleInput}
      />
    </div>
  );
}

function ShowcaseCards({ isDescription }) {
  const [copyCounts, setCopyCounts] = useState({});

  const { userAuth } = useContext(AuthContext);
  const [userLoves, setUserLoves] = useState(() => userAuth?.data?.favorites?.loves || []);

  // 当 userAuth 改变时，更新 userLoves 的值
  useEffect(() => {
    setUserLoves(userAuth?.data?.favorites?.loves || []);
  }, [userAuth]);

  const [favoriteUsers, otherUsers] = sortedUsers.reduce(
    ([favorites, others], user) => {
      //登陆后移除默认的收藏标签
      if (Cookies.get('auth_token')) {
        if (user.tags.includes("favorite")) {
          const index = user.tags.indexOf("favorite");
          if (index > -1) {
            user.tags.splice(index, 1);
          }
        }
      }
      if (userLoves && userLoves.includes(user.id) && !user.tags.includes("favorite")) {
        //user.weight += 100000; // If user is loved by current user, add a very large number to its weight
        user.tags.push("favorite"); 
      }
      if (user.tags.includes("favorite")) {
        favorites.push(user);
      } else {
        others.push(user);
      }
      return [favorites, others];
    },
    [[], []]
  );

  favoriteUsers.sort((a, b) => b.weight - a.weight);
  otherUsers.sort((a, b) => b.weight - a.weight);

  useEffect(() => {
    const fetchData = async () => {
      const counts = await fetchAllCopyCounts();
      setCopyCounts(counts);
    };
  
    fetchData();
  }, []);

  const handleCardCopy = useCallback((cardId, updatedCount) => {
    setCopyCounts((prevCopyCounts) => ({
      ...prevCopyCounts,
      [cardId]: updatedCount,
    }));
  }, []);

  const filteredUsers = useFilteredUsers();

  if (filteredUsers.length === 0) {
    return (
      <section className="margin-top--lg margin-bottom--xl">
        <div className="container padding-vert--md text--center">
          <Heading as="h2">
            <Translate id="showcase.usersList.noResult">
              😒 找不到结果，请缩短搜索词
            </Translate>
          </Heading>
          <SearchBar />
        </div>
      </section>
    );
  }

  return (
    <section className="margin-top--lg margin-bottom--xl">
      {filteredUsers.length === sortedUsers.length ? (
        <>
          <div className={styles.showcaseFavorite}>
            <div className="container">
              <div
                className={clsx(
                  "margin-bottom--md",
                  styles.showcaseFavoriteHeader
                )}
              >
                {/* <Heading as="h2">
                  <Translate id="showcase.favoritesList.title">
                    All Debates
                  </Translate>
                </Heading> */}
                {/* <FavoriteIcon svgClass={styles.svgIconFavorite} /> */}
                <SearchBar />
              </div>
              {/* <ul className={clsx("clean-list", styles.showcaseList)}>
                {favoriteUsers.map((user) => (
                  <ShowcaseCard
                    key={user.title}
                    user={user}
                    isDescription={isDescription}
                    copyCount={copyCounts[user.id] || 0}
                    onCopy={handleCardCopy}
                    onLove={setUserLoves}
                  />
                ))}
              </ul> */}
            </div>
          </div>
          <div className="container margin-top--lg">
            <Heading as="h2" className={styles.showcaseHeader}>
              <Translate id="showcase.usersList.allUsers">
                All Debates
              </Translate>
            </Heading>
            <ul className={clsx("clean-list", styles.showcaseList)}>
              {otherUsers.map((user) => (
                <ShowcaseCard
                  key={user.title}
                  user={user}
                  isDescription={isDescription}
                  copyCount={copyCounts[user.id] || 0}
                  onCopy={handleCardCopy}
                  onLove={setUserLoves}
                />
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="container">
          <div
            className={clsx("margin-bottom--md", styles.showcaseFavoriteHeader)}
          >
            <SearchBar />
          </div>
          <ul className={clsx("clean-list", styles.showcaseList)}>
            {filteredUsers.map((user) => (
              <ShowcaseCard
                key={user.title}
                user={user}
                isDescription={isDescription}
                copyCount={copyCounts[user.id] || 0}
                onCopy={handleCardCopy}
                onLove={setUserLoves}
              />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default function Showcase(): JSX.Element {
  const [isDescription, setIsDescription] = useState(true);
  const toggleDescription = useCallback(() => {
    setIsDescription((prevIsDescription) => !prevIsDescription);
  }, []);
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <main className="margin-vert--lg">
        <AuthProvider>
          <ShowcaseHeader />
          <ShowcaseFilters onToggleDescription={toggleDescription} />
          <ShowcaseCards isDescription={isDescription} />
        </AuthProvider>
      </main>
    </Layout>
  );
}
