import React, { useContext, useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import { message, Tooltip } from "antd";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import copy from "copy-text-to-clipboard";
//import Image from '@theme/IdealImage';
import FavoriteIcon from "@site/src/components/svgIcons/FavoriteIcon";
import {
  Tags,
  TagList,
  type TagType,
  type User,
  type Tag,
} from "@site/src/data/users";
import { sortBy } from "@site/src/utils/jsUtils";
import Heading from "@theme/Heading";
//import Tooltip from "../ShowcaseTooltip";
import styles from "./styles.module.css";
import {
  updateCopyCount,
  createFavorite,
  updateFavorite,
} from "@site/src/api";
import { AuthContext } from '../AuthContext';

import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

const TagComp = React.forwardRef<HTMLLIElement, Tag>(
  ({ label, color, description }, ref) => (
    <li ref={ref} className={styles.tag} title={description}>
      <span className={styles.textLabel}>{label.toLowerCase()}</span>
      <span className={styles.colorLabel} style={{ backgroundColor: color }} />
    </li>
  )
);

function ShowcaseCardTag({ tags }: { tags: TagType[] }) {
  const tagObjects = tags.map((tag) => ({ tag, ...Tags[tag] }));

  // Keep same order for all tags
  const tagObjectsSorted = sortBy(tagObjects, (tagObject) =>
    TagList.indexOf(tagObject.tag)
  );

  return (
    <>
      {tagObjectsSorted.map((tagObject, index) => {
        const id = `showcase_card_tag_${tagObject.tag}`;

        return (
          <Tooltip
            key={index}
            text={tagObject.description}
            anchorEl="#__docusaurus"
            id={id}
          >
            <TagComp key={index} {...tagObject} />
          </Tooltip>
        );
      })}
    </>
  );
}

function ShowcaseCard({ user, isDescription, copyCount, onCopy, onLove }) {
  const { userAuth, refreshUserAuth } = useContext(AuthContext);

  const [paragraphText, setParagraphText] = useState(
    isDescription ? user.description : user.desc_cn
  );

  useEffect(() => {
    setParagraphText(isDescription ? user.description : user.desc_cn);
  }, [isDescription, user.description, user.desc_cn]);

  // 点击显示中文文本
  function handleParagraphClick() {
    if (paragraphText === user.description) {
      setParagraphText(user.desc_cn);
    } else {
      setParagraphText(user.description);
    }
  }
  const { i18n } = useDocusaurusContext();
  const currentLanguage = i18n.currentLocale;
  const userTitle = currentLanguage === "en" ? user.title_en : user.title;
  const userRemark = currentLanguage === "en" ? user.remark_en : user.remark;
  const userDescription =
    currentLanguage === "zh-Hans" ? paragraphText : user.desc_en;
  //const image = getCardImage(user);
  // 复制
  const [copied, setShowCopied] = useState(false);

  const handleCopyClick = useCallback(async () => {
    try {
      const updatedCount = await updateCopyCount(user.id);
      if (user.description) {
        copy(userDescription);
      }
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
      // Notify parent component to update the copy count
      onCopy(user.id, updatedCount);
    } catch (error) {
      console.error("Error updating copy count:", error);
    }
  }, [user.id]);
  // 将显示数据单位简化到 k
  const formatCopyCount = (count) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "k";
    }
    return count;
  };

  const handleLove = useCallback(async () => {
    try {
      const response = userAuth;
      console.log(response);
      let userLoves;
      let favoriteId;

      if (!response.data.favorites) {
        const createFavoriteResponse = await createFavorite([user.id]);
        userLoves = [user.id];
        favoriteId = createFavoriteResponse.data.data.id;
      } else {
        userLoves = response.data.favorites.loves || [];
        favoriteId = response.data.favorites.id;

        if (!userLoves.includes(user.id)) {
          userLoves.push(user.id);
          message.success("Added to favorites successfully!");
        }
      }

      await updateFavorite(favoriteId, userLoves);
      onLove(userLoves);
      refreshUserAuth();
    } catch (err) {
      console.error(err);
    }
  }, [user.id, onLove, userAuth, refreshUserAuth]);

  const removeFavorite = useCallback(async () => {
    try {
      const response = userAuth;
      console.log(response);

      let userLoves;
      let favoriteId;

      if (response.data.favorites) {
        userLoves = response.data.favorites.loves || [];
        favoriteId = response.data.favorites.id;

        const index = userLoves.indexOf(user.id);
        if (index > -1) {
          userLoves.splice(index, 1);
          message.success("Removed from favorites successfully!");
        }

        await updateFavorite(favoriteId, userLoves);
        onLove(userLoves);
        refreshUserAuth();
      }
    } catch (err) {
      console.error(err);
    }
  }, [user.id, onLove, userAuth, refreshUserAuth]);

  const containsShowMore = userDescription.some((desc) =>
    desc.includes("点击展示更多")
  );

  return (
    <li key={userTitle} className="card shadow--md">
      <div className={clsx("card__body", styles.cardBodyHeight)}>
        <div className={clsx(styles.showcaseCardHeader)}>
          <Heading as="h4" className={styles.showcaseCardTitle}>
            <Link href={user.website} className={styles.showcaseCardLink}>
              {userTitle}{" "}
            </Link>
          </Heading>
          {user.tags.includes("favorite") && (
            <Tooltip
              title={userAuth ? <Translate>点击移除收藏</Translate> : ""}
            >
              <div onClick={userAuth ? removeFavorite : null}>
                <FavoriteIcon svgClass={styles.svgIconFavorite} size="small" />
              </div>
            </Tooltip>
          )}
          {userAuth && !user.tags.includes("favorite") && (
            <button
              className={clsx(
                "button button--secondary button--sm",
                styles.showcaseCardSrcBtn
              )}
              type="button"
              onClick={handleLove}
            >
              <Translate>收藏</Translate>
            </button>
          )}
        </div>
        <p className={styles.showcaseCardBody}>🗣️ {userRemark}</p>
        {userDescription.map((userDescription_single, index) => {
          const isLastTwo = index >= userDescription.length - 2;
          const botName = index % 2 === 0 ? "Bot A" : "Bot B";
          const prefix_nomore = `${botName}: `;
          const prefix = isLastTwo ? `${botName} conclusion: ` : `${botName}: `;
          const showMoreInDescription = userDescription_single.includes("点击展示更多");

          return (
            <p
              onClick={handleParagraphClick}
              className={
                showMoreInDescription
                  ? styles.showcaseCardBodyBorderMore
                  : index % 2 === 0
                    ? styles.showcaseCardBodyBorderA
                    : styles.showcaseCardBodyBorderB
              }
              key={index}
            >
              {showMoreInDescription
                ? userDescription_single
                : containsShowMore && isLastTwo
                  ? `${prefix_nomore}${userDescription_single}`
                  : !containsShowMore && isLastTwo
                    ? (
                      <strong>
                        {prefix}
                        {userDescription_single}
                      </strong>
                    )
                    : `${prefix}${userDescription_single}`}
            </p>
          );
        })}
      </div>
      <ul className={clsx("card__footer", styles.cardFooter)}>
        <ShowcaseCardTag tags={user.tags} />
      </ul>
    </li>
  );
}

export default React.memo(ShowcaseCard);
