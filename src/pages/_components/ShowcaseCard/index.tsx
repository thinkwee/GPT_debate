import React, { useContext, useState, useEffect } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { Tooltip, message } from "antd";
import Translate from "@docusaurus/Translate";
//import Image from '@theme/IdealImage';
import {
  Tags,
  TagList,
  type TagType,
  type Tag,
} from "@site/src/data/users";
import { sortBy } from "@site/src/utils/jsUtils";
import Heading from "@theme/Heading";
//import Tooltip from "../ShowcaseTooltip";
import styles from "./styles.module.css";
import { AuthContext } from '../AuthContext';
import copy from "copy-to-clipboard";
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

function ShowcaseCard({ user, isDescription, onLove }) {
  const [copiedRed, setCopiedRed] = useState(false);
  const [copiedBlue, setCopiedBlue] = useState(false);
  const [copyCountRed, setCopyCountRed] = useState(0);
  const [copyCountBlue, setCopyCountBlue] = useState(0);

  async function handleCopyClickRed() {
    try {
      const response = await fetch(`/count/red/${user.id}`, { method: 'POST' });
      const data = await response.json();
      setCopiedRed(true);
      setCopyCountRed(data.count);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCopyClickBlue() {
    try {
      const response = await fetch(`/count/blue/${user.id}`, { method: 'POST' });
      const data = await response.json();
      setCopiedBlue(true);
      setCopyCountBlue(data.count);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchCounts() {
    try {
      const responseRed = await fetch(`/count/red/${user.id}`);
      const responseBlue = await fetch(`/count/blue/${user.id}`);
      if (!responseRed.ok || !responseBlue.ok) {
        throw new Error('Network response was not ok');
      }
      const dataRed = await responseRed.json();
      const dataBlue = await responseBlue.json();
      setCopyCountRed(dataRed.count);
      setCopyCountBlue(dataBlue.count);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchCounts();
  }, [user.id]);


  const { userAuth, refreshUserAuth } = useContext(AuthContext);

  const [paragraphText, setParagraphText] = useState(
    isDescription ? user.description : user.description_detail
  );

  useEffect(() => {
    setParagraphText(isDescription ? user.description : user.description_detail);
  }, [isDescription, user.description, user.description_detail]);

  // 点击展开文本
  function handleParagraphClick(showMoreInDescription) {
    if (showMoreInDescription) {
      setParagraphText(user.description_detail);
    } else {
      setParagraphText(user.description);
    }
  }

  // 点击收回文本
  function handleCollapseClick() {
    setParagraphText(user.description);
  }

  // 复制文本到剪贴板并显示提示
  function handleCopyText(text, index) {
    copy(text);
    message.success("已复制");
    setClickedIndex(index);
  }

  const { i18n } = useDocusaurusContext();
  const currentLanguage = i18n.currentLocale;
  const userTitle = currentLanguage === "en" ? user.title_en : user.title;
  const userRemark = currentLanguage === "en" ? user.remark_en : user.remark;
  const userDescription = currentLanguage === "zh-Hans" ? paragraphText : user.desc_en;
  const containsShowMore = userDescription.some((desc) =>
    desc.includes("点击展示更多")
  );

  {/* 计算红蓝方的投票比例 */ }
  const totalVotes = copyCountRed + copyCountBlue;
  const redPercentage = totalVotes > 0 ? (copyCountRed / totalVotes) * 100 : 50;
  const bluePercentage = totalVotes > 0 ? (copyCountBlue / totalVotes) * 100 : 50;

  const [clickedIndex, setClickedIndex] = useState(-1);

  return (
    <li key={userTitle} className="card shadow--md">
      <div className={clsx("card__body", styles.cardBodyHeight)}>
        <div className={clsx(styles.showcaseCardHeader)}>
          <Heading as="h4" className={styles.showcaseCardTitle}>
            <Link href={user.website} className={styles.showcaseCardLink}>
              {userTitle}{" "}
            </Link>
          </Heading>
          <button
            className={clsx('button button--secondary button--sm', styles.showcaseCardSrcBtnRed)}
            type="button"
            onClick={handleCopyClickRed}
          >
            {copiedRed ? (
              <Translate>已投票红方</Translate>
            ) : (
              <Translate>支持红方</Translate>
            )}
            {` (${copyCountRed})`}
          </button>
          <button
            className={clsx('button button--secondary button--sm', styles.showcaseCardSrcBtnBlue)}
            type="button"
            onClick={handleCopyClickBlue}
          >
            {copiedBlue ? (
              <Translate>已投票蓝方</Translate>
            ) : (
              <Translate>支持蓝方</Translate>
            )}
            {` (${copyCountBlue})`}
          </button>
        </div>
        {/* 添加状态条 */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '10px',
            marginTop: '10px',
            borderRadius: '5px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#F0F0F0',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(90deg, #FF8A80, #F44336)',
              width: `${redPercentage}%`,
              height: '100%',
              borderRadius: '5px 0 0 5px',
            }}
          ></div>
          <div
            style={{
              background: 'linear-gradient(90deg, #2196F3, #81D4FA)',
              width: `${bluePercentage}%`,
              height: '100%',
              borderRadius: '0 5px 5px 0',
            }}
          ></div>
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
              onClick={() => {
                if (showMoreInDescription) {
                  handleParagraphClick(true);
                } else if (userDescription_single.includes("点击收回")) {
                  handleCollapseClick();
                } else {
                  handleCopyText(userDescription_single, index);
                }
              }}
              className={
                showMoreInDescription
                  ? styles.showcaseCardBodyBorderMore
                  : index % 2 === 0
                    ? clsx(styles.showcaseCardBodyBorderA, {
                      [styles.clicked]: clickedIndex === index,
                    })
                    : clsx(styles.showcaseCardBodyBorderB, {
                      [styles.clicked]: clickedIndex === index,
                    })
              }
              onAnimationEnd={() => setClickedIndex(-1)}
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
        {paragraphText === user.description_detail && (
          <p
            onClick={() => handleCollapseClick()}
            className={styles.showcaseCardBodyBorderMore}
          >
            点击收回
          </p>
        )}
      </div>
      <ul className={clsx("card__footer", styles.cardFooter)}>
        <ShowcaseCardTag tags={user.tags} />
      </ul>
    </li>
  );
}

export default React.memo(ShowcaseCard);